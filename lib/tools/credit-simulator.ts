/**
 * Bank-Grade Credit Simulation
 * Uses 7-stage formula for realistic loan amount calculations
 */

export function simulateOptimization(userData: any, sim: any) {
    const currentIncome = userData.monthlyIncome || 30000
    const currentEMI = userData.existingEMI || 0
    const currentScore = userData.creditScore || 650
    const tenure = userData.tenure || 3
    const employmentType = userData.employmentType || "salaried"
    const employmentTenure = userData.employmentTenure || "1-2yr"
    const hasCreditHistory = userData.hasCreditHistory ?? true
    const monthlyExpenses = userData.monthlyExpenses || Math.round(currentIncome * 0.3)

    // Convert tenure to months
    const tenureMonths = employmentTenure === "<6_months" ? 3
        : employmentTenure === "6m-1yr" ? 9
            : employmentTenure === "1-2yr" ? 18
                : employmentTenure === "2-5yr" ? 42
                    : 72

    // Bank-grade calculation helper
    function calculateMaxLoan(income: number, emi: number, score: number, empType: string, tMonths: number, hasCredit: boolean, isJoint: boolean) {
        // Stage 1: ERF
        let erf = 0.60
        if (empType === "salaried") {
            erf = tMonths >= 24 ? 1.00 : 0.85
        } else if (empType === "self_employed" || empType === "freelancer") {
            erf = tMonths >= 24 ? 0.75 : 0.60
        } else if (empType === "student") {
            erf = 0.40
        }
        if (isJoint) erf = Math.max(erf, 0.85)

        // Stage 2: Max EMI Ratio
        const maxEMIRatio = (empType === "salaried") ? 0.45 : 0.35
        const maxTotalEMI = income * maxEMIRatio

        // Stage 3: Net EMI Capacity
        let netEMICapacity = Math.max(0, maxTotalEMI - emi)

        // Stage 4: Expense Safety Gate
        const minSurvival = income * 0.20
        const requiredRemaining = monthlyExpenses + minSurvival
        const remainingAfterEMI = income - emi - netEMICapacity
        if (remainingAfterEMI < requiredRemaining) {
            netEMICapacity = Math.max(0, income - emi - requiredRemaining)
        }

        // Stage 5: EMI → Loan Conversion
        let baseRate = 12.0
        if (score >= 800) baseRate = 9.5
        else if (score >= 750) baseRate = 10.5
        else if (score >= 700) baseRate = 11.5
        else if (score >= 650) baseRate = 12.5
        else baseRate = 14.0

        if (empType === "freelancer") baseRate += 1.0
        if (empType === "self_employed") baseRate += 0.5

        const i = baseRate / (12 * 100)
        const n = tenure * 12
        const factor = Math.pow(1 + i, n)
        let rawLoan = netEMICapacity > 0 ? netEMICapacity * ((factor - 1) / (i * factor)) : 0

        // Stage 6: CSM
        let csm = 1.0
        if (!hasCredit) csm = 0.50
        else if (score >= 780) csm = 1.00
        else if (score >= 720) csm = 0.90
        else if (score >= 680) csm = 0.80
        else csm = 0

        // Stage 7: Final
        let maxLoan = Math.floor(rawLoan * erf * csm)
        maxLoan = Math.min(maxLoan, income * 36)
        return Math.max(0, maxLoan)
    }

    // Current calculation
    const currentMax = calculateMaxLoan(currentIncome, currentEMI, currentScore, employmentType, tenureMonths, hasCreditHistory, false)
    const currentDTI = (currentEMI / currentIncome) * 100

    // Projected calculation
    const projectedIncome = currentIncome + sim.increaseIncome + (sim.jointApplication ? 40000 : 0)
    const paidOffDebt = Math.min(sim.payOffDebt, currentEMI * 12)
    const reducedEMI = Math.max(0, currentEMI - paidOffDebt / 12)
    const projectedScore = Math.min(850, currentScore + sim.improveScore)

    // Tenure improves if waiting
    const projectedTenureMonths = tenureMonths + sim.waitMonths

    const projectedMax = calculateMaxLoan(projectedIncome, reducedEMI, projectedScore, employmentType, projectedTenureMonths, hasCreditHistory, sim.jointApplication)
    const projectedDTI = (reducedEMI / projectedIncome) * 100

    const improvement = {
        amount: Math.floor(projectedMax - currentMax),
        percentage: currentMax > 0 ? ((projectedMax - currentMax) / currentMax) * 100 : 0,
    }

    const impacts = [
        {
            factor: "Debt Reduction",
            change: sim.payOffDebt > 0 ? Math.min(20, (sim.payOffDebt / 100000) * 10) : 0,
            description:
                sim.payOffDebt > 0 ? `Improves DTI from ${currentDTI.toFixed(0)}% to ${projectedDTI.toFixed(0)}%` : "No change",
        },
        {
            factor: "Income Growth",
            change: sim.increaseIncome > 0 ? Math.min(25, (sim.increaseIncome / 10000) * 5) : 0,
            description:
                sim.increaseIncome > 0
                    ? `Increases available income by ₹${sim.increaseIncome.toLocaleString("en-IN")}`
                    : "No change",
        },
        {
            factor: "Credit Score",
            change: sim.improveScore > 0 ? Math.min(15, sim.improveScore / 5) : 0,
            description: sim.improveScore > 0 ? `Boosts score from ${currentScore} to ${projectedScore}` : "No change",
        },
        {
            factor: "Joint Application",
            change: sim.jointApplication ? 30 : 0,
            description: sim.jointApplication ? "Combines household income + ERF boost to 85%" : "Single applicant",
        },
        {
            factor: "Employment Tenure",
            change: sim.waitMonths >= 6 && tenureMonths < 24 ? 15 : 0,
            description: sim.waitMonths >= 6 && tenureMonths < 24 ? "Waiting builds tenure past 24mo threshold" : "No change",
        },
    ]

    const aiRecommendation = generateRecommendation(sim, impacts)
    const timeline = calculateTimeline(sim)

    return {
        current: {
            maxAmount: currentMax,
            approvalOdds: Math.min(85, 50 + (currentScore >= 720 ? 20 : currentScore >= 680 ? 10 : 0)),
        },
        projected: {
            maxAmount: projectedMax,
            approvalOdds: Math.min(95, 50 + (projectedScore >= 720 ? 20 : projectedScore >= 680 ? 10 : 0) + (sim.jointApplication ? 10 : 0)),
        },
        improvement,
        impacts: impacts.filter((i) => i.change > 0),
        aiRecommendation,
        timeline,
    }
}

function generateRecommendation(sim: any, impacts: any[]) {
    const maxImpact = impacts.reduce((max, i) => (i.change > max.change ? i : max), impacts[0])

    if (sim.jointApplication) {
        return "Adding a joint applicant has the highest impact. Consider applying with a spouse or family member with stable income."
    } else if (maxImpact?.factor === "Debt Reduction") {
        return "Focus on paying off existing high-interest loans first. This will significantly improve your DTI ratio and eligibility."
    } else if (maxImpact?.factor === "Income Growth") {
        return "Negotiate a raise or consider additional income sources. Higher income directly increases your loan eligibility."
    } else if (maxImpact?.factor === "Credit Score") {
        return "Work on building your credit score by paying bills on time and using credit responsibly for the next few months."
    }
    return "Consider a combination of strategies for maximum impact on your loan eligibility."
}

function calculateTimeline(sim: any) {
    let months = sim.waitMonths
    if (sim.improveScore > 0) months = Math.max(months, 3)
    if (sim.payOffDebt > 50000) months = Math.max(months, 6)
    if (sim.jointApplication) months = Math.max(months, 1)

    if (months === 0) return "Immediate"
    if (months <= 3) return "1-3 months"
    if (months <= 6) return "3-6 months"
    return "6-12 months"
}
