"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Percent,
  Download,
} from "lucide-react"
import { calculateDetailedEligibility } from "@/lib/tools/eligibility-calculator"

// Translation helper
const t = (lang: string, key: string): string => {
  const translations: Record<string, Record<string, string>> = {
    en: {
      eligibilityReport: "Eligibility Report",
      comprehensiveAnalysis: "Comprehensive analysis of your loan application",
      downloadReport: "Download Report",
      overallStatus: "Overall Status",
      eligible: "Eligible",
      underReview: "Under Review",
      notEligible: "Not Eligible",
      maxLoanAmount: "Max Loan Amount",
      basedOnProfile: "Based on your income & profile",
      approvalOdds: "Approval Odds",
      eligibilityFactors: "Eligibility Factors",
      financialSummary: "Financial Summary",
      monthlyIncome: "Monthly Income",
      existingEMI: "Existing EMI",
      monthlyExpenses: "Monthly Expenses",
      availableForEMI: "Available for EMI",
      debtToIncomeRatio: "Debt-to-Income Ratio",
      highDTI: "High DTI - Consider reducing existing debt",
      moderateDTI: "Moderate DTI - Room for improvement",
      healthyDTI: "Healthy DTI - Good financial position",
      estimatedMonthlyEMI: "Estimated Monthly EMI",
      forAmount: "For",
      at: "at",
      forYears: "years",
      recommendationsToImprove: "Recommendations to Improve",
      highImpact: "+15-20% approval odds",
      lowImpact: "+5-10% approval odds",
    },
    hi: {
      eligibilityReport: "पात्रता रिपोर्ट",
      comprehensiveAnalysis: "आपके ऋण आवेदन का व्यापक विश्लेषण",
      downloadReport: "रिपोर्ट डाउनलोड करें",
      overallStatus: "समग्र स्थिति",
      eligible: "पात्र",
      underReview: "समीक्षाधीन",
      notEligible: "पात्र नहीं",
      maxLoanAmount: "अधिकतम ऋण राशि",
      basedOnProfile: "आपकी आय और प्रोफ़ाइल के आधार पर",
      approvalOdds: "स्वीकृति संभावना",
      eligibilityFactors: "पात्रता कारक",
      financialSummary: "वित्तीय सारांश",
      monthlyIncome: "मासिक आय",
      existingEMI: "मौजूदा EMI",
      monthlyExpenses: "मासिक खर्च",
      availableForEMI: "EMI के लिए उपलब्ध",
      debtToIncomeRatio: "ऋण-आय अनुपात",
      highDTI: "उच्च DTI - मौजूदा ऋण कम करने पर विचार करें",
      moderateDTI: "मध्यम DTI - सुधार की गुंजाइश",
      healthyDTI: "स्वस्थ DTI - अच्छी वित्तीय स्थिति",
      estimatedMonthlyEMI: "अनुमानित मासिक EMI",
      forAmount: "के लिए",
      at: "पर",
      forYears: "वर्ष",
      recommendationsToImprove: "सुधार के लिए सुझाव",
      highImpact: "+15-20% स्वीकृति संभावना",
      lowImpact: "+5-10% स्वीकृति संभावना",
    },
    mr: {
      eligibilityReport: "पात्रता अहवाल",
      comprehensiveAnalysis: "तुमच्या कर्ज अर्जाचे सर्वसमावेशक विश्लेषण",
      downloadReport: "अहवाल डाउनलोड करा",
      overallStatus: "एकूण स्थिती",
      eligible: "पात्र",
      underReview: "पुनरावलोकनाधीन",
      notEligible: "पात्र नाही",
      maxLoanAmount: "कमाल कर्ज रक्कम",
      basedOnProfile: "तुमच्या उत्पन्न आणि प्रोफाइलवर आधारित",
      approvalOdds: "मंजुरी शक्यता",
      eligibilityFactors: "पात्रता घटक",
      financialSummary: "आर्थिक सारांश",
      monthlyIncome: "मासिक उत्पन्न",
      existingEMI: "विद्यमान EMI",
      monthlyExpenses: "मासिक खर्च",
      availableForEMI: "EMI साठी उपलब्ध",
      debtToIncomeRatio: "कर्ज-उत्पन्न गुणोत्तर",
      highDTI: "उच्च DTI - विद्यमान कर्ज कमी करण्याचा विचार करा",
      moderateDTI: "मध्यम DTI - सुधारणेची संधी",
      healthyDTI: "निरोगी DTI - चांगली आर्थिक स्थिती",
      estimatedMonthlyEMI: "अंदाजित मासिक EMI",
      forAmount: "साठी",
      at: "वर",
      forYears: "वर्षे",
      recommendationsToImprove: "सुधारणेसाठी शिफारसी",
      highImpact: "+15-20% मंजुरी शक्यता",
      lowImpact: "+5-10% मंजुरी शक्यता",
    },
  }
  return translations[lang]?.[key] || translations.en[key] || key
}

export default function EligibilityReport() {
  const [report, setReport] = useState<any>(null)
  const [lang, setLang] = useState("en")

  useEffect(() => {
    const savedLang = localStorage.getItem("language") || "en"
    setLang(savedLang)

    const data = localStorage.getItem("onboardingData")
    if (data) {
      const parsedData = JSON.parse(data)
      const calculations = calculateDetailedEligibility(parsedData)
      setReport(calculations)
    }
  }, [])

  if (!report) {
    return (

      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t(lang, "eligibilityReport")}</h1>
          <p className="text-gray-600">{t(lang, "comprehensiveAnalysis")}</p>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700">
          <Download className="w-4 h-4 mr-2" />
          {t(lang, "downloadReport")}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="p-6 border-2 border-emerald-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">{t(lang, "overallStatus")}</h3>
            {report.overallStatus === "approved" ? (
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            ) : report.overallStatus === "review" ? (
              <AlertCircle className="w-6 h-6 text-yellow-600" />
            ) : (
              <XCircle className="w-6 h-6 text-red-600" />
            )}
          </div>
          <div
            className={`text-2xl font-bold mb-2 ${report.overallStatus === "approved"
              ? "text-green-600"
              : report.overallStatus === "review"
                ? "text-yellow-600"
                : "text-red-600"
              }`}
          >
            {report.overallStatus === "approved"
              ? t(lang, "eligible")
              : report.overallStatus === "review"
                ? t(lang, "underReview")
                : t(lang, "notEligible")}
          </div>
          <p className="text-sm text-gray-600">{report.statusMessage}</p>
        </Card>

        <Card className="p-6 border-2 border-teal-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">{t(lang, "maxLoanAmount")}</h3>
            <DollarSign className="w-6 h-6 text-teal-600" />
          </div>
          <div className="text-3xl font-bold text-teal-600 mb-2">₹{report.maxAmount.toLocaleString("en-IN")}</div>
          <p className="text-sm text-gray-600">{t(lang, "basedOnProfile")}</p>
        </Card>

        <Card className="p-6 border-2 border-cyan-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">{t(lang, "approvalOdds")}</h3>
            <Percent className="w-6 h-6 text-cyan-600" />
          </div>
          <div className="text-3xl font-bold text-cyan-600 mb-2">{report.approvalOdds}%</div>
          <Progress value={report.approvalOdds} className="h-2" />
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">{t(lang, "eligibilityFactors")}</h3>
          <div className="space-y-4">
            {report.factors.map((factor: any, index: number) => (
              <div key={index} className="flex items-start gap-4">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${factor.status === "pass"
                    ? "bg-green-100"
                    : factor.status === "warning"
                      ? "bg-yellow-100"
                      : "bg-red-100"
                    }`}
                >
                  {factor.status === "pass" ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  ) : factor.status === "warning" ? (
                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-gray-900">{factor.name}</h4>
                    <span className="text-sm font-medium text-gray-600">{factor.score}/100</span>
                  </div>
                  <Progress value={factor.score} className="h-2 mb-2" />
                  <p className="text-sm text-gray-600">{factor.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">{t(lang, "financialSummary")}</h3>
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">{t(lang, "monthlyIncome")}</span>
                <span className="font-bold text-gray-900">
                  ₹{report.financials.monthlyIncome.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">{t(lang, "existingEMI")}</span>
                <span className="font-bold text-gray-900">
                  ₹{report.financials.existingEMI.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">{t(lang, "monthlyExpenses")}</span>
                <span className="font-bold text-gray-900">
                  ₹{report.financials.monthlyExpenses.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">{t(lang, "availableForEMI")}</span>
                <span className="font-bold text-emerald-600">
                  ₹{report.financials.availableForEMI.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-gray-900">{t(lang, "debtToIncomeRatio")}</span>
                <span
                  className={`font-bold ${(report.financials?.dti || 0) > 50 ? "text-red-600" : (report.financials?.dti || 0) > 40 ? "text-yellow-600" : "text-emerald-600"}`}
                >
                  {(report.financials?.dti || 0).toFixed(1)}%
                </span>
              </div>
              <Progress value={Math.min(report.financials?.dti || 0, 100)} className="h-2 mb-2" />
              <p className="text-xs text-gray-600">
                {(report.financials?.dti || 0) > 50
                  ? t(lang, "highDTI")
                  : (report.financials?.dti || 0) > 40
                    ? t(lang, "moderateDTI")
                    : t(lang, "healthyDTI")}
              </p>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-3">{t(lang, "estimatedMonthlyEMI")}</h4>
              <div className="text-3xl font-bold text-emerald-600 mb-2">
                ₹{report.financials.estimatedEMI.toLocaleString("en-IN")}
              </div>
              <p className="text-sm text-gray-600">
                {t(lang, "forAmount")} ₹{report.maxAmount.toLocaleString("en-IN")} {t(lang, "at")} {report.financials.interestRate}% {t(lang, "forYears")}{" "}
                {report.financials.tenure}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">{t(lang, "recommendationsToImprove")}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {report.recommendations.map((rec: any, index: number) => (
            <div
              key={index}
              className="flex items-start gap-3 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg"
            >
              {rec.impact === "high" ? (
                <TrendingUp className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              ) : (
                <TrendingDown className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
              )}
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">{rec.title}</h4>
                <p className="text-sm text-gray-600 mb-2">{rec.description}</p>
                <span className="text-xs font-medium text-emerald-700 bg-emerald-100 px-2 py-1 rounded">
                  {rec.impact === "high" ? t(lang, "highImpact") : t(lang, "lowImpact")}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

