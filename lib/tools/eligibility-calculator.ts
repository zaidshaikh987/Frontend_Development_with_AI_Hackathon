import { calculateEMI } from "./calculator"

/**
 * Bank-Grade 7-Stage Loan Eligibility Calculator
 * Based on real Indian banking underwriting practices
 */

// ============================================
// STAGE 1: Employment Risk Factor (ERF)
// Banks use this to discount eligibility for risky profiles
// ============================================
function calculateERF(employmentType: string, tenureMonths: number, hasCoBorrower: boolean = false, loanType: string = "personal"): number {
    let erf = 0.60; // Default for unknown

    // Base ERF by employment type and tenure
    if (employmentType === "salaried") {
        erf = tenureMonths >= 24 ? 1.00 : 0.85;
    } else if (employmentType === "self_employed") {
        erf = tenureMonths >= 24 ? 0.75 : 0.60;
    } else if (employmentType === "freelancer") {
        erf = tenureMonths >= 24 ? 0.75 : 0.60;
    } else if (employmentType === "student") {
        erf = 0.40; // Students are very high risk
    }

    // Soft override: Education loan with co-applicant gets boost
    if (loanType === "education" && hasCoBorrower) {
        erf = Math.max(erf, 0.85);
    }

    return erf;
}

// Helper to convert tenure string to months
function tenureToMonths(tenure: string): number {
    switch (tenure) {
        case "<6_months": return 3;
        case "6m-1yr": return 9;
        case "1-2yr": return 18;
        case "2-5yr": return 42;
        case "5+yr": return 72;
        default: return 18; // Default to 1-2yr
    }
}

// ============================================
// STAGE 6: Credit Score Multiplier (CSM)
// Banks reject below 680, reduce for lower scores
// ============================================
function calculateCSM(creditScore: number, hasCreditHistory: boolean): { csm: number; rejected: boolean } {
    if (!hasCreditHistory) {
        return { csm: 0.50, rejected: false }; // New-to-credit penalty
    }

    if (creditScore >= 780) return { csm: 1.00, rejected: false };
    if (creditScore >= 720) return { csm: 0.90, rejected: false };
    if (creditScore >= 680) return { csm: 0.80, rejected: false };

    // Below 680 = reject
    return { csm: 0, rejected: true };
}

// ============================================
// MAIN FUNCTION: 7-Stage Eligibility Calculation
// ============================================
export function calculateDetailedEligibility(data: any) {
    // Extract user data with proper defaults
    const monthlyIncome = Number(data.monthlyIncome) || 30000
    const existingEMI = Number(data.existingEMI) || 0
    // If monthlyExpenses is 0 or undefined, default to 30% of income (realistic minimum living expenses)
    const rawExpenses = Number(data.monthlyExpenses) || 0
    const monthlyExpenses = rawExpenses > 0 ? rawExpenses : Math.round(monthlyIncome * 0.3)
    const loanAmount = Number(data.loanAmount) || 500000
    const tenure = Number(data.tenure) || 3
    const creditScore = Number(data.creditScore) || 650
    const hasCreditHistory = data.hasCreditHistory ?? true
    const coborrowerIncome = data.isJointApplication ? Number(data.coborrowerIncome) || 0 : 0
    const employmentType = data.employmentType || "salaried"
    const employmentTenure = data.employmentTenure || "1-2yr"
    const loanType = data.loanType || "personal"
    const hasCoBorrower = data.isJointApplication || false

    // Convert tenure string to months
    const tenureMonths = tenureToMonths(employmentTenure)

    // For joint applications, we use combined income but apply ERF to primary applicant only
    const totalIncome = monthlyIncome + coborrowerIncome

    // ============================================
    // STAGE 1: Employment Risk Factor (ERF)
    // ============================================
    const erf = calculateERF(employmentType, tenureMonths, hasCoBorrower, loanType)

    // ============================================
    // STAGE 2: Max EMI Ratio (DTI Gate)
    // Salaried: 45%, Freelancer/Self-employed: 35%
    // ============================================
    const maxEMIRatio = (employmentType === "salaried") ? 0.45 : 0.35
    const maxTotalEMI = monthlyIncome * maxEMIRatio

    // ============================================
    // STAGE 3: Net EMI Capacity
    // Deduct existing obligations
    // ============================================
    let netEMICapacity = Math.max(0, maxTotalEMI - existingEMI)

    // ============================================
    // STAGE 4: Expense Safety Gate
    // Banks enforce minimum 20% survival balance
    // ============================================
    const minSurvival = monthlyIncome * 0.20
    const requiredRemaining = monthlyExpenses + minSurvival
    const remainingAfterEMI = monthlyIncome - existingEMI - netEMICapacity

    let expenseSafetyPassed = remainingAfterEMI >= requiredRemaining

    // If failed, reduce net EMI capacity to pass safety gate
    if (!expenseSafetyPassed) {
        netEMICapacity = Math.max(0, monthlyIncome - existingEMI - requiredRemaining)
        expenseSafetyPassed = true // Adjusted to pass
    }

    // ============================================
    // STAGE 5: EMI → Loan Amount Conversion
    // Standard bank formula: P = EMI × [(1+i)^n - 1] / [i × (1+i)^n]
    // ============================================
    // Determine interest rate based on credit score
    let baseRate = 12.0
    if (creditScore >= 800) baseRate = 9.5
    else if (creditScore >= 750) baseRate = 10.5
    else if (creditScore >= 700) baseRate = 11.5
    else if (creditScore >= 650) baseRate = 12.5
    else baseRate = 14.0

    // Adjust for employment type
    if (employmentType === "self_employed") baseRate += 0.5
    if (employmentType === "freelancer") baseRate += 1.0
    if (employmentType === "student") baseRate += 2.0

    const i = baseRate / (12 * 100) // Monthly interest rate
    const n = tenure * 12 // Total months

    // Reverse EMI formula to get loan amount from EMI capacity
    let rawLoanAmount = 0
    if (netEMICapacity > 0 && i > 0 && n > 0) {
        const factor = Math.pow(1 + i, n)
        rawLoanAmount = netEMICapacity * ((factor - 1) / (i * factor))
    }

    // ============================================
    // STAGE 6: Credit Score Multiplier (CSM)
    // ============================================
    const { csm, rejected: creditRejected } = calculateCSM(creditScore, hasCreditHistory)

    // ============================================
    // STAGE 7: Final Eligible Amount
    // ============================================
    let maxEligibleAmount = Math.floor(rawLoanAmount * erf * csm)

    // Apply reasonable caps
    maxEligibleAmount = Math.min(maxEligibleAmount, monthlyIncome * 36) // Max 36x monthly (3 years income)
    maxEligibleAmount = Math.max(maxEligibleAmount, 0) // No negative

    // If credit rejected, set to 0
    if (creditRejected) {
        maxEligibleAmount = 0
    }

    // Calculate DTI for display
    // Standard banking DTI = (Existing EMI Obligations / Monthly Income) * 100
    // Note: This does NOT include living expenses - only debt payments
    let dti = 0
    if (monthlyIncome > 0) {
        dti = (existingEMI / monthlyIncome) * 100
    }
    // Ensure DTI is a valid number
    if (isNaN(dti) || !isFinite(dti)) {
        dti = 0 // If no existing EMI, DTI should be 0%
    }

    // Calculate EMI for the eligible amount
    const estimatedEMI = calculateEMI(maxEligibleAmount, baseRate, n)

    // ============================================
    // Eligibility Factors for Display
    // ============================================
    const factors = [
        {
            name: "Income Level",
            score: Math.min(100, Math.round((monthlyIncome / 100000) * 100)),
            status: monthlyIncome >= 25000 ? "pass" : monthlyIncome >= 15000 ? "warning" : "fail",
            description:
                monthlyIncome >= 25000
                    ? `₹${monthlyIncome.toLocaleString("en-IN")}/month - Meets requirements`
                    : `₹${monthlyIncome.toLocaleString("en-IN")}/month - Below ₹25,000 threshold`,
        },
        {
            name: "Debt-to-Income Ratio",
            score: Math.max(0, Math.round(100 - dti * 2)),
            status: dti <= 35 ? "pass" : dti <= 45 ? "warning" : "fail",
            description: `${dti.toFixed(1)}% of income goes to obligations. ${dti <= 35 ? "Healthy ratio" : dti <= 45 ? "Moderate - banks prefer <35%" : "High - consider reducing debt"}`,
        },
        {
            name: "Credit Score",
            score: hasCreditHistory ? Math.round((creditScore - 300) / 6) : 40,
            status: creditRejected ? "fail" : !hasCreditHistory ? "warning" : creditScore >= 750 ? "pass" : creditScore >= 680 ? "warning" : "fail",
            description: creditRejected
                ? `CIBIL Score: ${creditScore} - Below 680 minimum. Banks will reject.`
                : hasCreditHistory
                    ? `CIBIL Score: ${creditScore} - ${creditScore >= 780 ? "Excellent (100% multiplier)" : creditScore >= 720 ? "Good (90% multiplier)" : creditScore >= 680 ? "Fair (80% multiplier)" : "Needs improvement"}`
                    : "No credit history found - 50% reduction applied",
        },
        {
            name: "Employment Stability",
            score: Math.round(erf * 100),
            status: erf >= 0.85 ? "pass" : erf >= 0.60 ? "warning" : "fail",
            description: `${employmentType === "salaried" ? "Salaried" : employmentType === "self_employed" ? "Self-employed" : employmentType === "student" ? "Student" : "Freelancer"} (${employmentTenure}) - ERF: ${(erf * 100).toFixed(0)}%`,
        },
    ]

    // ============================================
    // Calculate Approval Odds
    // ============================================
    let approvalOdds = 50 // Base

    // Credit score impact
    if (creditRejected) approvalOdds = 5
    else if (creditScore >= 780) approvalOdds += 30
    else if (creditScore >= 720) approvalOdds += 20
    else if (creditScore >= 680) approvalOdds += 10
    else approvalOdds -= 20

    // Employment impact
    if (employmentType === "salaried" && tenureMonths >= 24) approvalOdds += 15
    else if (employmentType === "salaried") approvalOdds += 5
    else if (employmentType === "freelancer" && tenureMonths < 24) approvalOdds -= 15
    else if (employmentType === "student") approvalOdds -= 25

    // DTI impact
    if (dti > 50) approvalOdds -= 20
    else if (dti > 40) approvalOdds -= 10
    else if (dti <= 30) approvalOdds += 10

    // Joint application boost
    if (hasCoBorrower) approvalOdds += 15

    approvalOdds = Math.min(95, Math.max(5, approvalOdds))

    // ============================================
    // Determine Overall Status
    // ============================================
    let overallStatus = "approved"
    if (creditRejected || monthlyIncome < 15000 || dti > 60) {
        overallStatus = "rejected"
    } else if (dti > 45 || !hasCreditHistory || creditScore < 720 || erf < 0.75) {
        overallStatus = "review"
    }

    // ============================================
    // Generate Recommendations
    // ============================================
    const recommendations = []

    if (erf < 0.85 && employmentType !== "student") {
        recommendations.push({
            title: "Increase Employment Tenure",
            description: `Your ERF is ${(erf * 100).toFixed(0)}%. Completing 2+ years (24 months) in current role can increase eligibility by ${Math.round((0.85 / erf - 1) * 100)}%.`,
            impact: "high",
        })
    }

    if (employmentType === "freelancer" || employmentType === "student") {
        recommendations.push({
            title: "Register as Business Entity",
            description: "Registering as Sole Proprietor or OPC and routing income through a current account can improve ERF from 60% to 75% over 6 months.",
            impact: "high",
        })
    }

    if (dti > 35) {
        recommendations.push({
            title: "Reduce Existing Debt",
            description: `Your DTI is ${dti.toFixed(1)}%. Paying off ₹${Math.round(existingEMI * 0.3).toLocaleString("en-IN")} in existing loans can move DTI below 35% threshold.`,
            impact: "high",
        })
    }

    if (!hasCreditHistory || creditScore < 720) {
        recommendations.push({
            title: "Improve Credit Score",
            description: creditRejected
                ? "Score below 680 means automatic rejection. Use secured credit card for 6 months to build score to 700+."
                : creditScore < 720
                    ? "A score above 720 can reduce your interest rate by 1-2% and increase loan eligibility by 20%."
                    : "Maintain your score above 720 for best rates.",
            impact: "high",
        })
    }

    if (!hasCoBorrower && monthlyIncome < 50000) {
        recommendations.push({
            title: "Add Co-Applicant (Parent/Spouse)",
            description: "Adding an earning co-applicant can increase ERF to 85% and boost combined income for higher eligibility.",
            impact: "high",
        })
    }

    if (tenure < 5) {
        recommendations.push({
            title: "Extend Loan Tenure",
            description: `Increasing tenure from ${tenure} to ${Math.min(tenure + 2, 7)} years reduces EMI burden, allowing higher loan amount within your EMI capacity.`,
            impact: "medium",
        })
    }

    // ============================================
    // Return Complete Report
    // ============================================
    return {
        overallStatus,
        statusMessage:
            overallStatus === "approved"
                ? "You meet eligibility criteria. Final amount subject to bank verification."
                : overallStatus === "review"
                    ? "Your application needs additional review. Consider the recommendations below."
                    : creditRejected
                        ? "Credit score below 680 - banks will not approve. Build credit first."
                        : "Current profile doesn't meet minimum requirements. Follow recommendations to improve.",
        maxAmount: maxEligibleAmount,
        requestedAmount: loanAmount,
        approvalOdds,
        factors,
        financials: {
            monthlyIncome,
            existingEMI,
            monthlyExpenses,
            availableForEMI: Math.round(netEMICapacity),
            dti,
            estimatedEMI: Math.round(estimatedEMI),
            interestRate: baseRate,
            tenure,
            // New detailed breakdown
            maxEMIRatio: maxEMIRatio * 100,
            erf,
            csm,
            rawLoanBeforeMultipliers: Math.round(rawLoanAmount),
        },
        recommendations,
    }
}
