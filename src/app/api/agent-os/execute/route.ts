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
            
            The Founder (CEO) has just APPROVED the following task:
            Title: ${task.title}
            Description: ${task.description}
            
            Your job is to now EXECUTE this task and provide the actual resulting work.
            
            CRITICAL INSTRUCTIONS BASED ON DEPARTMENT:
            
            - If Marketing: Your output MUST follow this exact structure:
                1. **Overview**: Brief summary of current marketing performance.
                2. **Viral Reel Analysis**: Identify a specific recent reel that went viral in your niche and explain why.
                3. **New Reel Ideas**: Provide 2 detailed new reel concepts (with Hook and Script) based on the viral trend.
                4. **Content Ideas**: Give 2 broader content strategy ideas.
                5. Add a final line: *"All details and assets have been automatically emailed to the CEO for final review."*
            
            - If Sales: Your output MUST follow this exact structure:
                1. **New Leads**: Generate 3 specific, realistic B2B lead profiles (Name, Company, Role, Why they are a fit).
                2. **Outreach Emails**: Write a personalized cold outreach email for EACH of the generated leads.
                3. Add a final line: *"All emails have been queued and automatically sent via our outreach sequence."*
            
            - If Developer/Other: Provide a highly professional, realistic summary of the work done, code written, or operations completed.
            
            Format your response beautifully in Markdown. Make it look highly professional, data-driven, and ready to use. Keep it concise but complete.
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
