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
You are a live code commentator. The user is visualizing the execution of this ${language} code.
CODE:
${code}

For each important line of code (variable declarations, loops, conditionals, function calls, return statements), write a very short, punchy 1-sentence comment explaining what is happening at that exact moment.
If a line is just a closing brace "}" or empty, you can skip it.
Line numbers must be 1-indexed (first line is 1).

Return ONLY valid JSON matching this schema:
{
  "commentary": {
    "1": "Initializing the array with 5 elements.",
    "2": "Starting a loop from 0 to array length."
  }
}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const data = JSON.parse(text);

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("AI Commentary Error:", error);
    return NextResponse.json({ error: "Failed to generate commentary" }, { status: 500 });
  }
}
