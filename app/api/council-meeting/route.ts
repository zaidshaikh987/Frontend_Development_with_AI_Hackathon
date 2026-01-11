import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

/**
 * Financial Council - Fallback Implementation
 * Uses direct Gemini API when ADK fails on serverless
 * 
 * DEMO_MODE: Set to true to use cached responses (saves API quota)
 */

const DEMO_MODE = true; // Set to false for live AI responses

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY!,
});

// Pre-computed demo responses to save API calls
function getDemoResponse(data: any) {
    const income = data.monthlyIncome || 100000;
    const loanAmount = data.loanAmount || 500000;
    const creditScore = data.creditScore || 700;
    const dti = ((data.existingEMI || 0) / income * 100).toFixed(1);

    const isLikelyApproved = creditScore >= 700 && parseFloat(dti) < 40;

    return {
        optimistArgument: `With a monthly income of ₹${income.toLocaleString()} and ${creditScore >= 720 ? 'excellent' : 'decent'} credit score of ${creditScore}, this applicant shows strong repayment capacity. The ${parseFloat(dti) < 30 ? 'low' : 'manageable'} debt-to-income ratio of ${dti}% indicates financial discipline. Recommend approval with standard terms.`,

        pessimistArgument: `While the income appears stable, the loan amount of ₹${loanAmount.toLocaleString()} represents ${((loanAmount / (income * 12)) * 100).toFixed(0)}% of annual income. ${creditScore < 750 ? 'Credit score below 750 indicates potential payment irregularities.' : ''} ${parseFloat(dti) > 30 ? 'DTI above 30% poses repayment risk in economic downturn.' : ''} Recommend additional verification or reduced loan amount.`,

        judgeVerdict: isLikelyApproved
            ? `After weighing both arguments, the applicant's stable income of ₹${income.toLocaleString()}, credit score of ${creditScore}, and DTI of ${dti}% meet our lending criteria. The loan of ₹${loanAmount.toLocaleString()} is approved subject to document verification.`
            : `The risk factors outweigh the positives. With a credit score of ${creditScore} and DTI of ${dti}%, recommend conditional approval with reduced loan amount of ₹${Math.round(loanAmount * 0.7).toLocaleString()} or additional collateral.`,

        approved: isLikelyApproved,
        confidence: isLikelyApproved ? 72 : 45,
        _metadata: { mode: "demo-cached" }
    };
}

async function runSimpleAgent(role: "optimist" | "pessimist" | "judge", context: string): Promise<string> {
    const prompts = {
        optimist: `You are 'The Optimist' loan officer. Find every reason to APPROVE this loan. Focus on potential, growth, and character. Give a punchy 2-3 sentence argument.

LOAN APPLICATION:
${context}

Your argument FOR approval:`,

        pessimist: `You are 'The Pessimist' risk officer. Find every reason to REJECT this loan. Focus on risk, volatility, and worst-case scenarios. Give a harsh 2-3 sentence argument.

LOAN APPLICATION:
${context}

Your argument AGAINST approval:`,

        judge: `You are the Chief Compliance Officer. Based on the arguments below, make a FINAL binding decision.

${context}

Return ONLY JSON: {"verdict": "your explanation", "approved": true/false, "confidence": 0-100}`
    };

    try {
        const result = await ai.models.generateContent({
            model: "gemini-2.0-flash-exp",
            contents: [{ role: "user", parts: [{ text: prompts[role] }] }],
        });

        const text = result.candidates?.[0]?.content?.parts?.[0]?.text || "";
        return text.trim();
    } catch (error: any) {
        console.error(`${role} error:`, error.message);
        return `${role} is unavailable: ${error.message}`;
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // DEMO MODE: Return cached response to save API quota
        if (DEMO_MODE) {
            console.log("\n🎭 DEMO MODE: Using cached response (no API calls)");
            console.log("   Set DEMO_MODE = false in route.ts for live AI\n");
            return NextResponse.json(getDemoResponse(body));
        }

        const context = JSON.stringify(body, null, 2);

        console.log("\n");
        console.log("╔════════════════════════════════════════════════════════════╗");
        console.log("║       🏛️  FINANCIAL COUNCIL - Multi-Agent Debate          ║");
        console.log("╠════════════════════════════════════════════════════════════╣");
        console.log("║  Powered by: Gemini 2.0 Flash + Google GenAI SDK          ║");
        console.log("╚════════════════════════════════════════════════════════════╝");
        console.log("\n📋 INPUT DATA:");
        console.log("   • Income: ₹" + (body.monthlyIncome || "N/A").toLocaleString());
        console.log("   • Loan Amount: ₹" + (body.loanAmount || "N/A").toLocaleString());
        console.log("   • Credit Score: " + (body.creditScore || "650 (default)"));
        console.log("");

        // Run optimist
        console.log("┌─────────────────────────────────────────────────────────────┐");
        console.log("│ STAGE 1: ⚡ THE OPTIMIST                                    │");
        console.log("├─────────────────────────────────────────────────────────────┤");
        console.log("│ Role: Sales-driven loan officer arguing FOR approval       │");
        console.log("│ Model: gemini-2.0-flash-exp                                │");
        console.log("│ Status: Generating argument...                             │");
        console.log("└─────────────────────────────────────────────────────────────┘");
        const optimistArg = await runSimpleAgent("optimist", context);
        console.log("   ✅ Optimist complete: " + optimistArg.substring(0, 80) + "...\n");

        // Small delay to avoid rate limits
        await new Promise(r => setTimeout(r, 1000));

        // Run pessimist
        console.log("┌─────────────────────────────────────────────────────────────┐");
        console.log("│ STAGE 2: 🔒 THE PESSIMIST                                   │");
        console.log("├─────────────────────────────────────────────────────────────┤");
        console.log("│ Role: Risk underwriter arguing AGAINST approval            │");
        console.log("│ Model: gemini-2.0-flash-exp                                │");
        console.log("│ Status: Generating counter-argument...                     │");
        console.log("└─────────────────────────────────────────────────────────────┘");
        const pessimistArg = await runSimpleAgent("pessimist", context);
        console.log("   ✅ Pessimist complete: " + pessimistArg.substring(0, 80) + "...\n");

        // Small delay
        await new Promise(r => setTimeout(r, 1000));

        // Run judge
        console.log("┌─────────────────────────────────────────────────────────────┐");
        console.log("│ STAGE 3: ⚖️  THE JUDGE                                      │");
        console.log("├─────────────────────────────────────────────────────────────┤");
        console.log("│ Role: Chief Compliance Officer - Final Decision Maker      │");
        console.log("│ Model: gemini-2.0-flash-exp                                │");
        console.log("│ Status: Weighing arguments...                              │");
        console.log("└─────────────────────────────────────────────────────────────┘");
        const judgeContext = `
LOAN APPLICATION:
${context}

OPTIMIST ARGUMENT:
${optimistArg}

PESSIMIST ARGUMENT:
${pessimistArg}
`;
        const judgeResponse = await runSimpleAgent("judge", judgeContext);

        // Parse judge response
        let judgment: any = { verdict: judgeResponse, approved: false, confidence: 50 };
        try {
            const jsonMatch = judgeResponse.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                judgment = JSON.parse(jsonMatch[0]);
            }
        } catch {
            // Keep default
        }

        console.log("   ✅ Judge complete\n");
        console.log("╔════════════════════════════════════════════════════════════╗");
        console.log("║                    📜 FINAL VERDICT                        ║");
        console.log("╠════════════════════════════════════════════════════════════╣");
        console.log("║  Decision: " + (judgment.approved ? "✅ APPROVED" : "❌ REJECTED") + "                                       ║");
        console.log("║  Confidence: " + (judgment.confidence || 50) + "%                                        ║");
        console.log("╚════════════════════════════════════════════════════════════╝");
        console.log("\n");

        return NextResponse.json({
            optimistArgument: optimistArg || "No argument provided.",
            pessimistArgument: pessimistArg || "No argument provided.",
            judgeVerdict: judgment.verdict || "No verdict.",
            approved: judgment.approved ?? false,
            confidence: judgment.confidence ?? 50,
            _metadata: { mode: "fallback-genai" }
        });

    } catch (error: any) {
        console.error("Council Error:", error);
        return NextResponse.json({
            optimistArgument: "Service temporarily unavailable.",
            pessimistArgument: "Service temporarily unavailable.",
            judgeVerdict: `Error: ${error.message}`,
            approved: false
        }, { status: 500 });
    }
}
