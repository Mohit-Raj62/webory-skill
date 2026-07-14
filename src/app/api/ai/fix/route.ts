import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { code, language, errorMessage } = await req.json();

    if (!code || !errorMessage) {
      return NextResponse.json({ error: "Code or error message missing" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash",
        generationConfig: {
            responseMimeType: "application/json",
        }
    });

    const prompt = `
You are an expert AI debugger. The following ${language} code threw a runtime error during visualization.
CODE:
${code}

ERROR:
${errorMessage}

Analyze the problem and provide a fixed version of the code, as well as a short explanation of what was wrong.
Return ONLY valid JSON matching this schema:
{
  "fixedCode": "the fully corrected code snippet",
  "explanation": "A 1-2 sentence explanation of the fix"
}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const data = JSON.parse(text);

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("AI Fix Error:", error);
    return NextResponse.json({ error: "Failed to generate fix" }, { status: 500 });
  }
}
