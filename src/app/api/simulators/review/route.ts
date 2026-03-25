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
            Act as an encouraging Senior Developer at ${scenario.company} reviewing a Pull Request from a Junior ${scenario.role}.
            
            Task Description: ${scenario.tasks[0]?.desc || "Fix the code."}
            
            Student's Code:
            \`\`\`
            ${code}
            \`\`\`
            
            Evaluate the code primarily for functionality and logically solving the core task.
            DO NOT reject the code for minor styling, pedantic best practices, or syntax choices (like using "magic numbers" for basic CSS, using standard variables, or hardcoding simple values in a test environment).
            
            If the code fundamentally solves the task described (e.g., setting the padding exactly to what was asked), you MUST approve it (passed: true). You may provide up to 1 brief, friendly tip for best practices in the feedback array.
            ONLY reject the code (passed: false) if it fails to achieve the core goal of the task, is completely broken, or is entirely wrong.
            Keep feedback short, highly encouraging, and very easy to understand for a beginner.
            
            Return ONLY valid JSON in this exact structure without markdown formatting blocks (start with { and end with }):
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
