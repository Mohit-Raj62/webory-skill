import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { code, scenario, history } = body;

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json({ reply: "Mock interviewer: That sounds good. Since my AI brain is sleeping (no API key), you pass the interview!" });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        // Build history string for context
        const historyText = history.map((msg: any) => `${msg.sender === 'user' ? 'Candidate' : 'Interviewer'}: ${msg.text}`).join('\n');

        const prompt = `
            Act as a strict and professional Hiring Manager conducting a technical interview. The candidate has just completed a coding test for the role of ${scenario.role} at ${scenario.company}.
            
            Task: ${scenario.tasks[0]?.desc || "Fix the code"}
            
            Candidate's Submitted Code:
            \`\`\`
            ${code}
            \`\`\`
            
            Previous Conversation:
            ${historyText}
            
            Respond directly to the Candidate's last message as the Interviewer. 
            If it's the beginning of the interview (history is short), ask them to explain their logic or why they chose that specific code approach.
            Keep your response concise, professional, and directly related to their code or their explanation. Do not break character. 1-2 sentences max.
            If the candidate has successfully answered 2 questions, conclude the interview positively.
        `;

        const result = await model.generateContent(prompt);
        let responseText = result.response.text().trim();

        return NextResponse.json({ reply: responseText });

    } catch (error: any) {
        console.error("AI Interview Error:", error);
        return NextResponse.json({ reply: `System Error: ${error.message || 'Unknown Gemini error.'}` });
    }
}
