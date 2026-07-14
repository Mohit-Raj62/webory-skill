import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { code, language, history, message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "No message provided" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Formatting history for Gemini
    const formattedHistory = history.map((h: any) => ({
        role: h.role === "ai" ? "model" : "user",
        parts: [{ text: h.text }]
    }));

    const chat = model.startChat({
        history: formattedHistory,
    });

    const contextPrompt = `
You are an expert programming mentor. We are currently discussing the following ${language} code:
\`\`\`${language}
${code}
\`\`\`
The user asks: ${message}
Answer directly, clearly, and concisely. Keep formatting clean.`;

    const result = await chat.sendMessage(contextPrompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ reply: text });
  } catch (error: any) {
    console.error("AI Chat Error:", error);
    return NextResponse.json({ error: "Failed to generate chat response" }, { status: 500 });
  }
}
