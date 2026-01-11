"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Target,
  CheckCircle2,
  FileCheck,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Users,
  Calendar,
  Volume2,
} from "lucide-react"
import Link from "next/link"
import { useVoiceAssistant } from "@/lib/voice-assistant-context"
import { DashboardHero } from "@/components/dashboard/dashboard-hero"
import { FinancialHealthChart } from "@/components/dashboard/financial-chart"
import CouncilVisualizer from "@/components/dashboard/council-visualizer"

// Translation helper
const t = (lang: string, key: string): string => {
  const translations: Record<string, Record<string, string>> = {
    en: {
      eligible: "ELIGIBLE",
      reviewNeeded: "REVIEW NEEDED",
      maxEligibleAmount: "Max Eligible Amount",
      ready: "Ready",
      documentationStatus: "Documentation Status",
      docsPending: "docs pending",
      aiRecommendation: "AI Recommendation",
      takeAction: "Take Action",
      quickActions: "Quick Actions",
      optimizePath: "Optimize Path",
      simulateScenarios: "Simulate scenarios to improve eligibility",
      bestTiming: "Best Timing",
      knowWhenToApply: "Know exactly when to apply for success",
      documentChecklist: "Document Checklist",
      uploadAndVerify: "Upload and verify your application docs",
      recommendedLoans: "Recommended Loans",
      viewAll: "View All",
      interestRate: "Interest Rate",
      approvalOdds: "approval odds",
      recentActivity: "Recent Activity",
      eligibilityChecked: "Eligibility Checked",
      justNow: "Just now",
      profileUpdated: "Profile Updated",
      minsAgo: "mins ago",
      documentUploaded: "Document Uploaded",
      hourAgo: "1 hour ago",
    },
    hi: {
      eligible: "पात्र",
      reviewNeeded: "समीक्षा आवश्यक",
      maxEligibleAmount: "अधिकतम पात्र राशि",
      ready: "तैयार",
      documentationStatus: "दस्तावेज़ीकरण स्थिति",
      docsPending: "दस्तावेज़ लंबित",
      aiRecommendation: "AI अनुशंसा",
      takeAction: "कार्रवाई करें",
      quickActions: "त्वरित क्रियाएं",
      optimizePath: "पथ अनुकूलित करें",
      simulateScenarios: "पात्रता सुधारने के लिए परिदृश्य सिमुलेट करें",
      bestTiming: "सर्वोत्तम समय",
      knowWhenToApply: "सफलता के लिए आवेदन का सही समय जानें",
      documentChecklist: "दस्तावेज़ चेकलिस्ट",
      uploadAndVerify: "अपने आवेदन दस्तावेज़ अपलोड करें और सत्यापित करें",
      recommendedLoans: "अनुशंसित ऋण",
      viewAll: "सभी देखें",
      interestRate: "ब्याज दर",
      approvalOdds: "स्वीकृति संभावना",
      recentActivity: "हाल की गतिविधि",
      eligibilityChecked: "पात्रता जांची गई",
      justNow: "अभी",
      profileUpdated: "प्रोफ़ाइल अपडेट किया",
      minsAgo: "मिनट पहले",
      documentUploaded: "दस्तावेज़ अपलोड किया",
      hourAgo: "1 घंटा पहले",
    },
    mr: {
      eligible: "पात्र",
      reviewNeeded: "पुनरावलोकन आवश्यक",
      maxEligibleAmount: "कमाल पात्र रक्कम",
      ready: "तयार",
      documentationStatus: "कागदपत्र स्थिती",
      docsPending: "कागदपत्रे प्रलंबित",
      aiRecommendation: "AI शिफारस",
      takeAction: "कृती करा",
      quickActions: "जलद कृती",
      optimizePath: "मार्ग अनुकूलित करा",
      simulateScenarios: "पात्रता सुधारण्यासाठी परिस्थिती सिम्युलेट करा",
      bestTiming: "सर्वोत्तम वेळ",
      knowWhenToApply: "यशासाठी अर्ज कधी करायचा ते जाणून घ्या",
      documentChecklist: "कागदपत्र चेकलिस्ट",
      uploadAndVerify: "तुमचे अर्ज कागदपत्रे अपलोड आणि सत्यापित करा",
      recommendedLoans: "शिफारस केलेली कर्जे",
      viewAll: "सर्व पहा",
      interestRate: "व्याज दर",
      approvalOdds: "मंजुरी शक्यता",
      recentActivity: "अलीकडील क्रियाकलाप",
      eligibilityChecked: "पात्रता तपासली",
      justNow: "आत्ताच",
      profileUpdated: "प्रोफाइल अपडेट केले",
      minsAgo: "मिनिटांपूर्वी",
      documentUploaded: "कागदपत्र अपलोड केले",
      hourAgo: "1 तास आधी",
    },
  }
  return translations[lang]?.[key] || translations.en[key] || key
}

export default function DashboardOverview() {
  const [userData, setUserData] = useState<any>(null)
  const [lang, setLang] = useState("en")
  const { guideDashboard, setIsOpen } = useVoiceAssistant()

  useEffect(() => {
    // Load language
    const savedLang = localStorage.getItem("language") || "en"
    setLang(savedLang)

    // Load onboarding data
    const data = localStorage.getItem("onboardingData")
    if (data) {
      const parsedData = JSON.parse(data)

      // Load uploaded files count
      const filesStr = localStorage.getItem("uploadedFiles") || "[]"
      const filesCount = JSON.parse(filesStr).length

      // Calculate eligibility and scores
      const calculations = calculateEligibility(parsedData, filesCount)
      setUserData({ ...parsedData, ...calculations })
    }
  }, [])

  const handleVoiceGuide = () => {
    setIsOpen(true)
    guideDashboard()
  }

  if (!userData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600" />
      </div>
    )
  }



  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* 1. Hero Section (New) */}
      <DashboardHero userData={userData} />

      {/* 1.5 Financial Council (Genkit) */}
      <div className="mb-6">
        <CouncilVisualizer userData={userData} />
      </div>

      {/* 2. Key Metrics Grid (Refined) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Financial Chart (New) - Linked to Eligibility */}
        <Link href="/dashboard/eligibility" className="md:col-span-1 block group">
          <div className="h-full transition-transform group-hover:scale-[1.02]">
            <FinancialHealthChart userData={userData} />
          </div>
        </Link>

        {/* Metrics Cards (Softened) */}
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Eligibility Status */}
          <Link href="/dashboard/eligibility" className="block group">
            <Card className="p-6 h-full shadow-md border-teal-50 bg-gradient-to-br from-white to-teal-50/50 transition-all group-hover:shadow-lg group-hover:border-teal-200 cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-teal-100 rounded-lg group-hover:bg-teal-200 transition-colors">
                  <CheckCircle2 className="w-6 h-6 text-teal-600" />
                </div>
                <span className={`px-3 py-1 text-xs font-bold rounded-full ${userData.isEligible ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}>
                  {userData.isEligible ? t(lang, "eligible") : t(lang, "reviewNeeded")}
                </span>
              </div>
              <div className="mb-2">
                <p className="text-sm text-gray-500 mb-1">{t(lang, "maxEligibleAmount")}</p>
                <div className="text-3xl font-bold text-gray-900 tracking-tight">
                  ₹{(userData.maxEligibleAmount || 0).toLocaleString("en-IN")}
                </div>
              </div>
            </Card>
          </Link>

          {/* Document Readiness */}
          <Link href="/dashboard/documents" className="block group">
            <Card className="p-6 h-full shadow-md border-blue-50 bg-gradient-to-br from-white to-blue-50/50 transition-all group-hover:shadow-lg group-hover:border-blue-200 cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <FileCheck className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-sm font-semibold text-blue-600">{userData.documentReadiness}% {t(lang, "ready")}</span>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-2">{t(lang, "documentationStatus")}</p>
                <Progress value={userData.documentReadiness} className="h-2 bg-blue-100" />
                <p className="text-xs text-gray-400 mt-2 text-right">{5 - Math.floor(userData.documentReadiness / 20)} {t(lang, "docsPending")}</p>
              </div>
            </Card>
          </Link>

          {/* Recommended Action */}
          <Card className="p-6 shadow-md border-cyan-50 bg-gradient-to-br from-white to-cyan-50/50 sm:col-span-2">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-cyan-100 rounded-full">
                <Sparkles className="w-6 h-6 text-cyan-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{t(lang, "aiRecommendation")}</h4>
                <p className="text-sm text-gray-600">{userData.nextAction}</p>
              </div>
              <Link href={userData.actionLink}>
                <Button className="bg-cyan-600 hover:bg-cyan-700 shadow-lg shadow-cyan-200">
                  {t(lang, "takeAction")}
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>

      {/* Quick Actions Panel */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">{t(lang, "quickActions")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Optimizer Card */}
          <Link href="/dashboard/optimizer" className="block group">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 shadow-sm hover:shadow-md transition-all group-hover:scale-[1.02]">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mb-4 group-hover:bg-emerald-200 transition-colors">
                <Target className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">{t(lang, "optimizePath")}</h3>
              <p className="text-sm text-gray-600">{t(lang, "simulateScenarios")}</p>
            </div>
          </Link>

          {/* Timing Card */}
          <Link href="/dashboard/timeline" className="block group">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-100 shadow-sm hover:shadow-md transition-all group-hover:scale-[1.02]">
              <div className="w-12 h-12 rounded-full bg-violet-100 flex items-center justify-center mb-4 group-hover:bg-violet-200 transition-colors">
                <Calendar className="w-6 h-6 text-violet-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">{t(lang, "bestTiming")}</h3>
              <p className="text-sm text-gray-600">{t(lang, "knowWhenToApply")}</p>
            </div>
          </Link>

          {/* Documents Card */}
          <Link href="/dashboard/documents" className="block group">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 shadow-sm hover:shadow-md transition-all group-hover:scale-[1.02]">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                <FileCheck className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">{t(lang, "documentChecklist")}</h3>
              <p className="text-sm text-gray-600">{t(lang, "uploadAndVerify")}</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Loan Recommendations */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">{t(lang, "recommendedLoans")}</h2>
              <Link href="/dashboard/loans">
                <Button variant="ghost" size="sm">
                  {t(lang, "viewAll")} <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>

            <div className="space-y-4">
              {userData.recommendations?.slice(0, 3).map((loan: any, index: number) => (
                <div
                  key={index}
                  className="p-4 border-2 border-gray-100 rounded-lg hover:border-emerald-200 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-bold text-gray-900">{loan.bankName}</h3>
                      <p className="text-sm text-gray-600">{loan.productName}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-emerald-600">{loan.rate}%</div>
                      <div className="text-xs text-gray-600">{t(lang, "interestRate")}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>EMI: ₹{loan.emi.toLocaleString("en-IN")}</span>
                    <span>•</span>
                    <span className="text-green-600 font-medium">{loan.approvalOdds}% {t(lang, "approvalOdds")}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Recent Activity */}
        <div>
          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{t(lang, "recentActivity")}</h2>
            <div className="space-y-4">
              {[
                { action: t(lang, "eligibilityChecked"), time: t(lang, "justNow"), icon: CheckCircle2, color: "text-green-600" },
                { action: t(lang, "profileUpdated"), time: `2 ${t(lang, "minsAgo")}`, icon: Users, color: "text-blue-600" },
                { action: t(lang, "documentUploaded"), time: t(lang, "hourAgo"), icon: FileCheck, color: "text-purple-600" },
              ].map((activity, index) => (
                <div key={index} className="flex items-start gap-3">
                  <activity.icon className={`w-5 h-5 ${activity.color} mt-0.5`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

// Helper Functions - Bank-Grade 7-Stage Calculation
function calculateEligibility(data: any, filesCount: number = 0) {
  const monthlyIncome = data.monthlyIncome || 30000
  const existingEMI = data.existingEMI || 0
  // If monthlyExpenses is 0 or undefined, default to 30% of income
  const rawExpenses = Number(data.monthlyExpenses) || 0
  const monthlyExpenses = rawExpenses > 0 ? rawExpenses : Math.round(monthlyIncome * 0.3)
  const loanAmount = data.loanAmount || 100000
  const tenure = data.tenure || 3
  const creditScore = data.creditScore || 650
  const hasCreditHistory = data.hasCreditHistory ?? true
  const employmentType = data.employmentType || "salaried"
  const employmentTenure = data.employmentTenure || "1-2yr"


  // Convert tenure string to months
  const tenureMonths = employmentTenure === "<6_months" ? 3
    : employmentTenure === "6m-1yr" ? 9
      : employmentTenure === "1-2yr" ? 18
        : employmentTenure === "2-5yr" ? 42
          : 72

  // ============================================
  // STAGE 1: Employment Risk Factor (ERF)
  // ============================================
  let erf = 0.60
  if (employmentType === "salaried") {
    erf = tenureMonths >= 24 ? 1.00 : 0.85
  } else if (employmentType === "self_employed" || employmentType === "freelancer") {
    erf = tenureMonths >= 24 ? 0.75 : 0.60
  } else if (employmentType === "student") {
    erf = 0.40
  }

  // Education loan with co-applicant boost
  if (data.loanType === "education" && data.isJointApplication) {
    erf = Math.max(erf, 0.85)
  }

  // ============================================
  // STAGE 2: Max EMI Ratio (DTI Gate)
  // Salaried: 45%, Others: 35%
  // ============================================
  const maxEMIRatio = (employmentType === "salaried") ? 0.45 : 0.35
  const maxTotalEMI = monthlyIncome * maxEMIRatio

  // ============================================
  // STAGE 3: Net EMI Capacity
  // ============================================
  let netEMICapacity = Math.max(0, maxTotalEMI - existingEMI)

  // ============================================
  // STAGE 4: Expense Safety Gate (20% survival)
  // ============================================
  const minSurvival = monthlyIncome * 0.20
  const requiredRemaining = monthlyExpenses + minSurvival
  const remainingAfterEMI = monthlyIncome - existingEMI - netEMICapacity

  if (remainingAfterEMI < requiredRemaining) {
    netEMICapacity = Math.max(0, monthlyIncome - existingEMI - requiredRemaining)
  }

  // ============================================
  // STAGE 5: EMI → Loan Conversion
  // ============================================
  let baseRate = 12.0
  if (creditScore >= 800) baseRate = 9.5
  else if (creditScore >= 750) baseRate = 10.5
  else if (creditScore >= 700) baseRate = 11.5
  else if (creditScore >= 650) baseRate = 12.5
  else baseRate = 14.0

  if (employmentType === "self_employed") baseRate += 0.5
  if (employmentType === "freelancer") baseRate += 1.0
  if (employmentType === "student") baseRate += 2.0

  const i = baseRate / (12 * 100)
  const n = tenure * 12
  const factor = Math.pow(1 + i, n)

  let rawLoanAmount = 0
  if (netEMICapacity > 0 && i > 0 && n > 0) {
    rawLoanAmount = netEMICapacity * ((factor - 1) / (i * factor))
  }

  // ============================================
  // STAGE 6: Credit Score Multiplier (CSM)
  // ============================================
  let csm = 1.0
  let creditRejected = false
  if (!hasCreditHistory) {
    csm = 0.50
  } else if (creditScore >= 780) {
    csm = 1.00
  } else if (creditScore >= 720) {
    csm = 0.90
  } else if (creditScore >= 680) {
    csm = 0.80
  } else {
    csm = 0
    creditRejected = true
  }

  // ============================================
  // STAGE 7: Final Eligible Amount
  // ============================================
  let maxEligible = Math.floor(rawLoanAmount * erf * csm)
  maxEligible = Math.min(maxEligible, monthlyIncome * 36) // Max 36x income
  maxEligible = Math.max(maxEligible, 0)

  if (creditRejected) maxEligible = 0

  // Co-borrower boost (after primary calculation)
  if (data.isJointApplication && data.coborrowerIncome) {
    const coborrowerMax = data.coborrowerIncome * maxEMIRatio * 0.5 * ((factor - 1) / (i * factor))
    maxEligible += Math.floor(coborrowerMax * 0.85) // Co-borrower gets 85% ERF
  }

  // DTI Calculation for eligibility check
  const dti = (existingEMI / monthlyIncome) * 100
  const isEligible = !creditRejected && dti <= 45 && monthlyIncome >= 25000 && erf >= 0.60

  // Document Readiness
  const documentReadiness = Math.min(100, Math.round((filesCount / 5) * 100))

  // Credit Readiness Score
  const financialLoad = Math.max(0, 30 - dti * 0.6)
  const incomeStability = getIncomeStabilityScore(employmentType, employmentTenure)
  const creditBehavior = hasCreditHistory ? (creditScore >= 750 ? 20 : 15) : 5
  const docScoreContribution = Math.round((documentReadiness / 100) * 15)
  const timingScore = 5

  const creditReadinessScore = Math.round(
    financialLoad + incomeStability + creditBehavior + docScoreContribution + timingScore,
  )

  // Recommendations
  let baseOdds = 60
  if (creditRejected) baseOdds = 5
  else if (creditScore >= 750) baseOdds = 90
  else if (creditScore >= 700) baseOdds = 75
  else if (creditScore >= 650) baseOdds = 50
  else baseOdds = 30

  const recommendations = [
    {
      bankName: "HDFC Bank",
      productName: "Personal Loan",
      rate: baseRate,
      emi: Math.round(loanAmount * (baseRate / 1200) / (1 - Math.pow(1 + baseRate / 1200, -tenure * 12))),
      approvalOdds: baseOdds
    },
    {
      bankName: "ICICI Bank",
      productName: "Express Loan",
      rate: baseRate + 0.5,
      emi: Math.round(loanAmount * ((baseRate + 0.5) / 1200) / (1 - Math.pow(1 + (baseRate + 0.5) / 1200, -tenure * 12))),
      approvalOdds: Math.max(0, baseOdds - 5)
    },
    {
      bankName: "Axis Bank",
      productName: "Quick Loan",
      rate: baseRate + 0.3,
      emi: Math.round(loanAmount * ((baseRate + 0.3) / 1200) / (1 - Math.pow(1 + (baseRate + 0.3) / 1200, -tenure * 12))),
      approvalOdds: Math.max(0, baseOdds - 3)
    },
  ]

  return {
    isEligible,
    maxEligibleAmount: maxEligible,
    creditReadinessScore,
    nextAction: isEligible ? "Compare Loans" : creditRejected ? "Build Credit First" : "Improve Profile",
    actionLink: isEligible ? "/dashboard/loans" : "/dashboard/optimizer",
    documentReadiness,
    recommendations,
    // Additional info for debugging/display
    erf,
    csm,
    dti,
  }
}

function getIncomeStabilityScore(employmentType: string, tenure: string) {
  if (employmentType === "salaried") {
    if (tenure === "5+yr") return 25
    if (tenure === "2-5yr") return 23
    if (tenure === "1-2yr") return 20
    return 18
  }
  if (employmentType === "self_employed") {
    if (tenure === "5+yr") return 22
    if (tenure === "2-5yr") return 18
    return 15
  }
  return 10
}

function getScoreLabel(score: number) {
  if (score >= 80) return "Excellent - Ready to apply!"
  if (score >= 60) return "Good - Few improvements needed"
  if (score >= 40) return "Fair - Work on key areas"
  return "Needs improvement"
}
