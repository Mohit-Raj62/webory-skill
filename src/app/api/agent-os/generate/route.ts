import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
    try {
        const { context } = await req.json();
        const businessContext = context || "A fast-growing B2B SaaS startup.";

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); // Use latest stable gemini

        const prompt = `
            You are the Nexus (Chief Executive Agent) of Agent OS, an AI-powered business operating system.
            The user is the Founder of: ${businessContext}.

            Generate a morning briefing and exactly 3 pending tasks for the founder to approve.
            The tasks should be assigned to different department agents.

            Available Agents:
            - "sales" (Agent Name: Atlas)
            - "marketing" (Agent Name: Nova)
            - "finance" (Agent Name: Ledger)
            - "hr" (Agent Name: Harmony)
            - "ops" (Agent Name: Orion)

            Respond ONLY with a valid JSON object matching this schema:
            {
                "ceoMessage": "A short, encouraging 2-sentence morning greeting analyzing the overnight performance.",
                "tasks": [
                    {
                        "id": "t1",
                        "department": "marketing",
                        "agentName": "Nova",
                        "title": "Actionable task title",
                        "description": "2-3 sentences explaining the problem and the proposed action.",
                        "impact": "Expected metric impact (e.g. '+$1,200/mo' or '+4.2% conversion')"
                    }
                ]
            }
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();

        // Strip markdown code block markers if present
        text = text.replace(/```json/g, "").replace(/```/g, "").trim();
        
        const data = JSON.parse(text);

        // Add extra fields needed by UI
        const tasksWithUiState = data.tasks.map((task: any, index: number) => ({
            ...task,
            id: `generated_task_${index}_${Date.now()}`,
            status: 'pending',
            time: 'Just now',
            result: null
        }));

        return NextResponse.json({ 
            ceoMessage: data.ceoMessage, 
            tasks: tasksWithUiState 
        });

    } catch (error: any) {
        console.error("Agent OS Generate Error:", error);
        return NextResponse.json({ error: "Failed to generate morning briefing" }, { status: 500 });
    }
}
