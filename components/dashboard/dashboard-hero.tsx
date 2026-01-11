"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Sparkles, TrendingUp, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

// Translation helper
const t = (lang: string, key: string): string => {
    const translations: Record<string, Record<string, string>> = {
        en: {
            aiPoweredInsight: "AI Powered Insight",
            excellentProfile: "Excellent Profile!",
            goodProgress: "Good Progress!",
            needsAttention: "Needs Attention",
            topApplicants: "You are in the top 10% of applicants. Banks are likely to offer you their best rates.",
            onRightTrack: "You're on the right track. Improving your document score can boost your chances by 20%.",
            checkOffers: "Check Offers",
            viewReport: "View Report",
            outOf100: "Out of 100",
        },
        hi: {
            aiPoweredInsight: "AI संचालित अंतर्दृष्टि",
            excellentProfile: "उत्कृष्ट प्रोफ़ाइल!",
            goodProgress: "अच्छी प्रगति!",
            needsAttention: "ध्यान देने की आवश्यकता",
            topApplicants: "आप शीर्ष 10% आवेदकों में हैं। बैंक आपको अपनी सर्वोत्तम दरें देने की संभावना रखते हैं।",
            onRightTrack: "आप सही रास्ते पर हैं। अपने दस्तावेज़ स्कोर में सुधार करने से आपकी संभावनाएं 20% बढ़ सकती हैं।",
            checkOffers: "ऑफर देखें",
            viewReport: "रिपोर्ट देखें",
            outOf100: "100 में से",
        },
        mr: {
            aiPoweredInsight: "AI संचालित अंतर्दृष्टी",
            excellentProfile: "उत्कृष्ट प्रोफाइल!",
            goodProgress: "चांगली प्रगती!",
            needsAttention: "लक्ष देणे आवश्यक",
            topApplicants: "तुम्ही शीर्ष 10% अर्जदारांमध्ये आहात. बँका तुम्हाला त्यांचे सर्वोत्तम दर देण्याची शक्यता आहे.",
            onRightTrack: "तुम्ही योग्य मार्गावर आहात. तुमचा कागदपत्र स्कोअर सुधारल्यास तुमच्या शक्यता 20% वाढू शकतात.",
            checkOffers: "ऑफर पहा",
            viewReport: "अहवाल पहा",
            outOf100: "100 पैकी",
        },
    }
    return translations[lang]?.[key] || translations.en[key] || key
}

export function DashboardHero({ userData }: { userData: any }) {
    const [lang, setLang] = useState("en")
    const score = userData.creditReadinessScore || 0

    useEffect(() => {
        const savedLang = localStorage.getItem("language") || "en"
        setLang(savedLang)
    }, [])

    // Calculate stroke dash for circular progress
    const radius = 40
    const circumference = 2 * Math.PI * radius
    const strokeDashoffset = circumference - (score / 100) * circumference

    return (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 text-white shadow-xl mb-8">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-purple-500 rounded-full blur-[100px] opacity-20" />
            <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-blue-500 rounded-full blur-[100px] opacity-20" />

            <div className="relative p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8">

                {/* Left Content */}
                <div className="flex-1 text-center md:text-left space-y-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-medium backdrop-blur-sm"
                    >
                        <Sparkles className="w-3 h-3 text-yellow-300" />
                        <span>{t(lang, "aiPoweredInsight")}</span>
                    </motion.div>

                    <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
                        {score > 75 ? t(lang, "excellentProfile") : score > 50 ? t(lang, "goodProgress") : t(lang, "needsAttention")}
                    </h1>

                    <p className="text-gray-300 max-w-lg text-lg">
                        {score > 75 ? t(lang, "topApplicants") : t(lang, "onRightTrack")}
                    </p>

                    <div className="flex flex-wrap gap-3 justify-center md:justify-start pt-2">
                        <Link href="/dashboard/loans">
                            <Button className="bg-white text-indigo-900 hover:bg-gray-100 border-0 font-semibold shadow-lg shadow-indigo-900/20">
                                {t(lang, "checkOffers")} <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </Link>

                        <Link href="/dashboard/eligibility">
                            <Button variant="outline" className="border-white/30 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm shadow-sm">
                                {t(lang, "viewReport")}
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Right Content - Circular Score */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="relative"
                >
                    <div className="relative flex items-center justify-center w-48 h-48">
                        {/* Outer Glow */}
                        <div className="absolute inset-0 bg-indigo-500 rounded-full blur-xl opacity-20 animate-pulse" />

                        {/* SVG Circle */}
                        <svg className="transform -rotate-90 w-full h-full">
                            {/* Track */}
                            <circle
                                cx="50%"
                                cy="50%"
                                r={radius + "%"}
                                className="stroke-white/10 fill-none"
                                strokeWidth="12"
                            />
                            {/* Progress */}
                            <motion.circle
                                initial={{ strokeDashoffset: circumference }}
                                animate={{ strokeDashoffset }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                cx="50%"
                                cy="50%"
                                r={radius + "%"}
                                className="stroke-emerald-400 fill-none"
                                strokeWidth="12"
                                strokeLinecap="round"
                                strokeDasharray={circumference}
                            />
                        </svg>

                        {/* Inner Text */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                            <span className="text-5xl font-bold text-white">{score}</span>
                            <span className="text-xs text-uppercase tracking-wider text-emerald-300 font-medium">{t(lang, "outOf100")}</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
