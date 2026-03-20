import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dbConnect from "@/lib/db";
import CodeSnippet from "@/models/CodeSnippet";
import { getDataFromToken } from "@/helpers/getDataFromToken";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
    try {
        await dbConnect();
        const userId = await getDataFromToken(req);
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { codeId, title, code, language } = await req.json();

        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        const prompt = `
            You are a professional software engineering career coach. 
            Write a stunning portfolio case study for the following code snippet.
            
            PROJECT TITLE: ${title}
            LANGUAGE: ${language}
            CODE: 
            \`\`\`${language}
            ${code}
            \`\`\`
            
            Structure the response in Markdown with these EXACT sections:
            # ${title}
            
            ## 🚀 Project Overview
            (A short, compelling summary of what the project does)
            
            ## 🛠 Tech Stack
            (List the technologies used based on the code)
            
            ## 💡 Challenges Solved
            (Describe 2-3 technical challenges this code solves)
            
            ## ✨ Key Features
            (List the main functionalities implemented)
            
            ## 🎯 Impact
            (How this demonstrates the developer's skills)

            KEEP IT PROFESSIONAL AND CONCISE. Use bolding and formatting for clarity.
        `;

        const result = await model.generateContent(prompt);
        const caseStudy = result.response.text();

        // Save Case Study to Snippet
        await CodeSnippet.findByIdAndUpdate(codeId, { caseStudy });

        return NextResponse.json({
            success: true,
            caseStudy
        });

    } catch (error: any) {
        console.error("Case Study AI Error:", error);
        return NextResponse.json({ error: error.message || "Failed to generate case study" }, { status: 500 });
    }
}
