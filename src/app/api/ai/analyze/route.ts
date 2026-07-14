import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { code, language } = await req.json();

    if (!code) {
      return NextResponse.json({ error: "No code provided" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash",
        generationConfig: {
            responseMimeType: "application/json",
        }
    });

    const prompt = `
Analyze the Time Complexity (Big-O) and Space Complexity of this ${language} code:
\`\`\`${language}
${code}
\`\`\`
Return ONLY valid JSON matching this schema:
{
  "timeComplexity": "e.g., O(n), O(n^2), O(1), O(log n)",
  "spaceComplexity": "e.g., O(1), O(n)",
  "summary": "1 short sentence explaining why."
}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const data = JSON.parse(text);

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("AI Analyze Error:", error);
    return NextResponse.json({ error: "Failed to analyze code" }, { status: 500 });
  }
}
