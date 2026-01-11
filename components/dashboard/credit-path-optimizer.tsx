"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Target, TrendingUp, Calendar, Sparkles, RotateCcw } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export default function CreditPathOptimizer() {
  const [userData, setUserData] = useState<any>(null)
  const [simulation, setSimulation] = useState({
    payOffDebt: 0,
    increaseIncome: 0,
    improveScore: 0,
    waitMonths: 0,
    jointApplication: false,
  })
  const [results, setResults] = useState<any>(null)

  useEffect(() => {
    const data = localStorage.getItem("onboardingData")
    if (data) {
      setUserData(JSON.parse(data))
    }
  }, [])

  useEffect(() => {
    if (userData) {
      const optimized = simulateOptimization(userData, simulation)
      setResults(optimized)
    }
  }, [userData, simulation])

  const resetSimulation = () => {
    setSimulation({
      payOffDebt: 0,
      increaseIncome: 0,
      improveScore: 0,
      waitMonths: 0,
      jointApplication: false,
    })
  }

  if (!userData || !results) {
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Credit Path Optimizer</h1>
          <p className="text-gray-600">Simulate scenarios to maximize your loan eligibility</p>
        </div>
        <Button onClick={resetSimulation} variant="outline">
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="p-6 border-2 border-emerald-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Current Eligibility</h3>
            <Target className="w-6 h-6 text-gray-400" />
          </div>
          <div className="text-3xl font-bold text-gray-600 mb-2">
            ₹{results.current.maxAmount.toLocaleString("en-IN")}
          </div>
          <p className="text-sm text-gray-500">{results.current.approvalOdds}% approval odds</p>
        </Card>

        <Card className="p-6 border-2 border-teal-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Projected Eligibility</h3>
            <TrendingUp className="w-6 h-6 text-teal-600" />
          </div>
          <div className="text-3xl font-bold text-teal-600 mb-2">
            ₹{results.projected.maxAmount.toLocaleString("en-IN")}
          </div>
          <p className="text-sm text-teal-700">{results.projected.approvalOdds}% approval odds</p>
        </Card>

        <Card className="p-6 border-2 border-cyan-100 bg-gradient-to-br from-cyan-50 to-blue-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Improvement</h3>
            <Sparkles className="w-6 h-6 text-cyan-600" />
          </div>
          <div className="text-3xl font-bold text-cyan-600 mb-2">
            +₹{results.improvement.amount.toLocaleString("en-IN")}
          </div>
          <p className="text-sm text-cyan-700">+{results.improvement.percentage.toFixed(0)}% increase</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Optimization Controls</h3>

          <Tabs defaultValue="debt" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="debt">Debt</TabsTrigger>
              <TabsTrigger value="income">Income</TabsTrigger>
              <TabsTrigger value="credit">Credit</TabsTrigger>
            </TabsList>

            <TabsContent value="debt" className="space-y-6 pt-4">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label>Pay Off Existing Debt</Label>
                  <span className="text-sm font-bold text-emerald-600">
                    ₹{simulation.payOffDebt.toLocaleString("en-IN")}
                  </span>
                </div>
                <Slider
                  value={[simulation.payOffDebt]}
                  onValueChange={([value]) => setSimulation({ ...simulation, payOffDebt: value })}
                  max={userData.existingEMI * 12 || 50000}
                  step={5000}
                  className="mb-2"
                />
                <p className="text-xs text-gray-600">Reduce your monthly EMI burden by paying off loans</p>
              </div>
            </TabsContent>

            <TabsContent value="income" className="space-y-6 pt-4">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label>Increase Monthly Income</Label>
                  <span className="text-sm font-bold text-emerald-600">
                    +₹{simulation.increaseIncome.toLocaleString("en-IN")}
                  </span>
                </div>
                <Slider
                  value={[simulation.increaseIncome]}
                  onValueChange={([value]) => setSimulation({ ...simulation, increaseIncome: value })}
                  max={50000}
                  step={5000}
                  className="mb-2"
                />
                <p className="text-xs text-gray-600">Expected income increase in coming months</p>
              </div>

              <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg">
                <div>
                  <Label>Add Joint Applicant</Label>
                  <p className="text-xs text-gray-600 mt-1">Combine income with co-borrower</p>
                </div>
                <Switch
                  checked={simulation.jointApplication}
                  onCheckedChange={(checked) => setSimulation({ ...simulation, jointApplication: checked })}
                />
              </div>
            </TabsContent>

            <TabsContent value="credit" className="space-y-6 pt-4">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label>Improve Credit Score</Label>
                  <span className="text-sm font-bold text-emerald-600">+{simulation.improveScore} points</span>
                </div>
                <Slider
                  value={[simulation.improveScore]}
                  onValueChange={([value]) => setSimulation({ ...simulation, improveScore: value })}
                  max={100}
                  step={10}
                  className="mb-2"
                />
                <p className="text-xs text-gray-600">Expected credit score improvement</p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label>Wait Before Applying</Label>
                  <span className="text-sm font-bold text-emerald-600">{simulation.waitMonths} months</span>
                </div>
                <Slider
                  value={[simulation.waitMonths]}
                  onValueChange={([value]) => setSimulation({ ...simulation, waitMonths: value })}
                  max={12}
                  step={1}
                  className="mb-2"
                />
                <p className="text-xs text-gray-600">Build credit history and savings</p>
              </div>
            </TabsContent>
          </Tabs>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Impact Analysis</h3>
          <div className="space-y-6">
            {results.impacts.map((impact: any, index: number) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">{impact.factor}</span>
                  <span className={`text-sm font-bold ${impact.change > 0 ? "text-green-600" : "text-gray-400"}`}>
                    {impact.change > 0 ? "+" : ""}
                    {impact.change}%
                  </span>
                </div>
                <Progress value={Math.abs(impact.change)} className="h-2 mb-1" />
                <p className="text-xs text-gray-600">{impact.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border-2 border-emerald-100">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">AI Recommendation</h4>
                <p className="text-sm text-gray-700 mb-3">{results.aiRecommendation}</p>
                <div className="flex items-center gap-2 text-xs text-emerald-700">
                  <Calendar className="w-4 h-4" />
                  <span>Estimated timeline: {results.timeline}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

function simulateOptimization(userData: any, sim: any) {
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
