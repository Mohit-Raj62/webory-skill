require('dotenv').config({ path: '.env.local' });
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

async function test() {
    const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash",
        generationConfig: {
            responseMimeType: "application/json",
        }
    });

    const prompt = `
            You are the Nexus (Chief Executive Agent) of Agent OS, an AI-powered business operating system.
            The user is the Founder of: A fast-growing B2B SaaS startup.

            Generate a morning briefing and exactly 3 pending tasks for the founder to approve.
            The tasks MUST involve exactly one from Sales, one from Marketing, and one from any other department.
            
            - Marketing Task Description: Must involve analyzing recent viral reels, generating new reel concepts, and outlining a content strategy.
            - Sales Task Description: Must involve finding new B2B leads and preparing personalized cold outreach emails to automatically send.

            Available Agents:
            - "sales" (Agent Name: Atlas)
            - "marketing" (Agent Name: Nova)
            - "finance" (Agent Name: Ledger)
            - "developer" (Agent Name: Cipher)
            - "support" (Agent Name: Echo)
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
                        "description": "2-3 sentences explaining the problem and the proposed action. Make it sound like they've already prepared the work and are awaiting approval.",
                        "impact": "Expected metric impact (e.g. '+$1,200/mo' or '+4.2% conversion')"
                    }
                ]
            }
        `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        console.log("Raw text:", response.text());
        JSON.parse(response.text());
        console.log("JSON is valid.");
    } catch (e) {
        console.error("Error:", e);
    }
}

test();
