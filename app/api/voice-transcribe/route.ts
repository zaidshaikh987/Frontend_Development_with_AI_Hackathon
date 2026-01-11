import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

/**
 * Voice Transcription API
 * Uses Gemini 2.5 Flash for speech-to-text
 */

// Ensure API key is set - prioritize GEMINI_API_KEY then fall back to GOOGLE_GENERATIVE_AI_API_KEY
const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;

// Debug: Log which key is being used (masked for security)
console.log("🔑 API Key Status:", apiKey ? `Found (${apiKey.substring(0, 10)}...${apiKey.slice(-4)})` : "❌ NOT FOUND");
console.log("   GEMINI_API_KEY:", process.env.GEMINI_API_KEY ? "✅ set" : "❌ not set");
console.log("   GOOGLE_GENERATIVE_AI_API_KEY:", process.env.GOOGLE_GENERATIVE_AI_API_KEY ? "✅ set" : "❌ not set");

if (!apiKey) {
    console.error("❌ GEMINI_API_KEY or GOOGLE_GENERATIVE_AI_API_KEY not set in environment variables");
}

// Initialize with explicit API key (not ADC)
const ai = new GoogleGenAI({
    apiKey: apiKey || "",
});


export async function POST(req: Request) {
    // Check API key at request time
    if (!apiKey) {
        return NextResponse.json(
            { error: "API key not configured. Set GEMINI_API_KEY in .env.local" },
            { status: 500 }
        );
    }

    try {

        const { audioData, language } = await req.json();

        if (!audioData) {
            return NextResponse.json(
                { error: "Missing audioData" },
                { status: 400 }
            );
        }

        console.log("\n");
        console.log("╔════════════════════════════════════════════════════════════╗");
        console.log("║       🎤 GEMINI VOICE TRANSCRIPTION                         ║");
        console.log("╠════════════════════════════════════════════════════════════╣");
        console.log("║  Model: gemini-2.5-flash                                   ║");
        console.log("║  Language: " + (language || "auto-detect") + "                                     ║");
        console.log("╚════════════════════════════════════════════════════════════╝");

        // Extract base64 data and MIME type
        let mimeType = "audio/webm";
        let base64Data = audioData;

        if (audioData.includes(";base64,")) {
            const parts = audioData.split(";base64,");
            mimeType = parts[0].replace("data:", "");
            base64Data = parts[1];
        }

        console.log("   📦 Audio MIME Type:", mimeType);

        // Call Gemini with audio input
        const result = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [
                {
                    role: "user",
                    parts: [
                        {
                            text: `Transcribe this audio to text. The speaker may be speaking in ${language === "hi" ? "Hindi" : "English"} or a mix of both.

INSTRUCTIONS:
1. Transcribe exactly what is spoken
2. If it's a number, write it as digits (e.g., "50000" not "fifty thousand")
3. If it's a name, capitalize it properly
4. Return ONLY the transcribed text, nothing else
5. If you cannot understand the audio clearly, return "[unclear]"

Transcription:`
                        },
                        {
                            inlineData: {
                                mimeType: mimeType,
                                data: base64Data,
                            },
                        },
                    ],
                },
            ],
        });

        const transcription = result.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";

        console.log("   ✅ Transcription:", transcription);
        console.log("");

        return NextResponse.json({
            success: true,
            transcription,
            model: "gemini-2.5-flash"
        });

    } catch (error: any) {
        console.error("Voice transcription error:", error);
        return NextResponse.json(
            { error: error.message || "Transcription failed" },
            { status: 500 }
        );
    }
}
