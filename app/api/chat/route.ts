import { GoogleGenAI } from "@google/genai"
import { OrchestratorAgent } from "@/lib/agents/core/orchestrator"

export const maxDuration = 30

/**
 * DEMO_MODE: Set to true to use cached responses (saves API quota)
 * Set to false for live AI responses
 */
const DEMO_MODE = true;

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
})

// Smart demo responses for common queries
function getDemoChatResponse(message: string, language: string): string {
  const msg = message.toLowerCase();
  const isHindi = language === "hi";

  // Credit score questions
  if (msg.includes("credit") || msg.includes("score") || msg.includes("cibil")) {
    return isHindi
      ? "क्रेडिट स्कोर 300-900 के बीच होता है। 750+ को उत्कृष्ट माना जाता है। आप समय पर भुगतान करके और क्रेडिट उपयोग 30% से कम रखकर अपना स्कोर सुधार सकते हैं।"
      : "A credit score ranges from 300-900. A score of 750+ is considered excellent for loan approvals. You can improve your score by paying bills on time, keeping credit utilization below 30%, and maintaining a good mix of credit.";
  }

  // Loan/EMI questions
  if (msg.includes("loan") || msg.includes("emi") || msg.includes("eligibility")) {
    return isHindi
      ? "आपकी लोन पात्रता आपकी आय, क्रेडिट स्कोर और मौजूदा EMI पर निर्भर करती है। एक सामान्य नियम: आपकी कुल EMI आपकी आय के 40% से कम होनी चाहिए।"
      : "Your loan eligibility depends on income, credit score, and existing EMIs. A general rule: your total EMI should be less than 40% of your income. Use our Credit Optimizer to simulate different scenarios!";
  }

  // Budget/savings questions  
  if (msg.includes("budget") || msg.includes("saving") || msg.includes("save")) {
    return isHindi
      ? "50-30-20 नियम आज़माएं: आय का 50% ज़रूरतों पर, 30% इच्छाओं पर, और 20% बचत पर खर्च करें। पहले खुद को भुगतान करें!"
      : "Try the 50-30-20 rule: 50% of income on needs, 30% on wants, and 20% on savings. Start an emergency fund with 3-6 months of expenses. Pay yourself first!";
  }

  // Investment questions
  if (msg.includes("invest") || msg.includes("mutual fund") || msg.includes("sip")) {
    return isHindi
      ? "SIP (सिस्टमैटिक इन्वेस्टमेंट प्लान) से शुरू करें। ₹500/महीने से भी शुरू किया जा सकता है। लंबी अवधि के लिए इक्विटी और सुरक्षा के लिए डेट फंड चुनें।"
      : "Start with SIP (Systematic Investment Plan) - you can begin with as little as ₹500/month. For long-term goals, consider equity funds. For safety, look at debt funds. Diversification is key!";
  }

  // Default response
  return isHindi
    ? "मैं ArthAstra का AI सहायक हूं। मैं आपको क्रेडिट स्कोर, बजट, लोन पात्रता और वित्तीय योजना में मदद कर सकता हूं। आप किस विषय के बारे में जानना चाहते हैं?"
    : "I'm ArthAstra's AI assistant! I can help you learn about credit scores, budgeting, loan eligibility, and financial planning. What topic would you like to explore?";
}

const AGENT_PERSONAS = {
  ONBOARDING: `You are the Onboarding Assistant. Your goal is to welcome the user and help them complete their profile. Be warm, encouraging, and ask one question at a time.`,

  LOAN_OFFICER: `You are the Senior Loan Officer & Eligibility Analyst. You specialize in analyzing loan eligibility, bank policies, interest rates, and calculating EMIs.`,

  RECOVERY: `You are the Credit Rehabilitation Specialist. 
  1. Start by identifying yourself.
  2. If the user's Credit Score is known (from analysis), acknowledge it (e.g., "I see your score is 810").
  3. If you don't know the specific rejection reason (e.g. "Low DTI", "Policy"), ask for it to tailor the plan.
  4. Be empathetic but very proactive.`,

  GENERAL: `You are ArthAstra, a helpful financial guide. Answer general queries politely.`
}

export async function POST(req: Request) {
  try {
    const { messages, language = "en" } = await req.json()
    const lastMessage = messages[messages.length - 1]
    const context = lastMessage.context

    // DEMO MODE: Return cached response to save API quota
    if (DEMO_MODE) {
      console.log("\n🎭 DEMO MODE: Using cached chat response (no API calls)");
      const demoResponse = getDemoChatResponse(lastMessage.content, language);
      return new Response(JSON.stringify({ response: demoResponse, agent: "DEMO" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 1. Run Orchestrator to decide intent
    const orchestrator = new OrchestratorAgent()
    const routingResult = await orchestrator.routeRequest(lastMessage.content, messages.slice(0, -1))

    const selectedAgent = routingResult.data?.selectedAgent || "GENERAL"
    const specificPersona = AGENT_PERSONAS[selectedAgent as keyof typeof AGENT_PERSONAS] || AGENT_PERSONAS.GENERAL

    console.log(`[Chat] Routed to: ${selectedAgent}`)

    // 2. Execute Specialist Agent if applicable
    let agentContext = ""

    if (selectedAgent === "LOAN_OFFICER") {
      const { LoanOfficerAgent } = await import("@/lib/agents/specialists/loan-officer")
      const agent = new LoanOfficerAgent()
      const result = await agent.recommendLoans(context || {})
      if (result.success) {
        agentContext = `REAL-TIME AGENT ANALYSIS:\n${JSON.stringify(result.data)}\nUse this data to answer accurately.`
      }
    } else if (selectedAgent === "RECOVERY") {
    } else if (selectedAgent === "RECOVERY") {
      const { RecoveryAgent } = await import("@/lib/agents/specialists/recovery-agent")
      const agent = new RecoveryAgent()
      const result = await agent.generateRecoveryPlan(context || {})
      if (result.success) {
        agentContext = `REAL-TIME AGENT ANALYSIS (CIBIL & RECOVERY PLAN):\n${JSON.stringify(result.data)}\nUse this data to answer accurately.`
      }
    }

    // RAG: Semantic search for relevant knowledge
    let ragContext = "";
    try {
      const { vectorStore } = await import("@/lib/ai/vector-store");
      const relevantKnowledge = await vectorStore.getContext(lastMessage.content);
      if (relevantKnowledge) {
        ragContext = `\nKNOWLEDGE BASE (Use this to answer questions about ArthAstra features):\n${relevantKnowledge}`;
      }
    } catch (error) {
      console.log("RAG not available:", error);
    }

    const systemPrompt = `${specificPersona}
    
    LANGUAGE PREFERENCE: ${language === "hi" ? "Respond in Hindi (Devanagari script)." : "Respond in English."}

    CONTEXT AWARENESS:
    ${context ? `User Profile: ${JSON.stringify(context)}` : "No user profile available yet."}

    ${agentContext}

    ${ragContext}
    
    RESPONSE GUIDELINES:
    1. Stay in character as the "${selectedAgent}" agent.
    2. Keep responses concise (max 3 paragraphs).
    3. Use Indian financial context (₹, Lakhs, Crores).
    4. If AGENT ANALYSIS is provided, YOU MUST USE IT. Do not ask for data provided in the analysis.
    5. If KNOWLEDGE BASE info is provided, use it to give accurate answers about ArthAstra features.
    `

    const conversationHistory = messages.slice(0, -1).map((msg: any) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }))

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        { role: "user", parts: [{ text: systemPrompt }] },
        ...conversationHistory,
        { role: "user", parts: [{ text: lastMessage.content }] },
      ],
    })

    const text = response.text

    return new Response(JSON.stringify({ response: text, agent: selectedAgent }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error: any) {
    console.error("Chat API error:", error)
    return new Response(
      JSON.stringify({
        error: error?.message || "Failed to get response. Please try again.",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    )
  }
}
