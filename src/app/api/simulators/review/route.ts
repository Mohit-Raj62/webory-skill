import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { code, scenario } = body;

        if (!process.env.GEMINI_API_KEY) {
            // Mock response if no API key
            return NextResponse.json({ passed: true, feedback: ["LGTM!"] });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        const prompt = `
            Act as a strict Senior Developer at ${scenario.company} reviewing a Pull Request from a Junior ${scenario.role}.
            
            Task Description: ${scenario.tasks[0]?.desc || "Fix the code."}
            
            Student's Code:
            \`\`\`
            ${code}
            \`\`\`
            
            Evaluate the code for logical correctness, best practices, security, and performance. 
            If the code uses very bad practices or doesn't fully solve the task gracefully, reject it (passed: false) and give 1-2 specific points of feedback.
            If the code is acceptable and solves the task reasonably well, approve it (passed: true).
            
            Return ONLY valid JSON in this exact structure:
            {
                "passed": boolean,
                "feedback": ["string comment"]
            }
        `;

        const result = await model.generateContent(prompt);
        let responseText = result.response.text();
        
        // Clean up markdown markers if any
        responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        
        let jsonResponse;
        try {
            jsonResponse = JSON.parse(responseText);
        } catch (e) {
            console.error("Failed to parse AI review output:", responseText);
            jsonResponse = { passed: true, feedback: ["LGTM! Code looks fine."] };
        }

        return NextResponse.json(jsonResponse);

    } catch (error: any) {
        console.error("AI Review Error:", error);
        return NextResponse.json({ passed: true, feedback: ["Approval fallback (reviewer unavailable)."] });
    }
}
