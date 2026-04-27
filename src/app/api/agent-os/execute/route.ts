import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
    try {
        const { task, context } = await req.json();
        
        if (!task || !task.title || !task.department) {
            return NextResponse.json({ error: "Invalid task data" }, { status: 400 });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `
            You are ${task.agentName}, the AI Agent running the ${task.department} department for ${context || "a B2B SaaS startup"}.
            
            The Founder has just APPROVED the following task:
            Title: ${task.title}
            Description: ${task.description}
            
            Your job is to now EXECUTE this task and provide the actual resulting work.
            
            If it's an email task, write the actual email.
            If it's an ad campaign, write the ad copy and targeting strategy.
            If it's a code/ops task, provide a summary of the script or config changes.
            
            Format your response in Markdown. Make it look professional and ready to use. Keep it concise but complete (max 300 words).
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({ result: text });

    } catch (error: any) {
        console.error("Agent OS Execute Error:", error);
        return NextResponse.json({ error: "Failed to execute task" }, { status: 500 });
    }
}
