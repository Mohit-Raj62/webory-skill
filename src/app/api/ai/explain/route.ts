import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { code, language } = await req.json();

    if (!code) {
      return NextResponse.json({ error: "No code provided" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    const prompt = `
      You are an expert programming mentor for absolute beginners. 
      Your goal is to explain the following ${language} code in a way that is extremely easy to understand.
      
      CODE:
      ${code}

      INSTRUCTIONS:
      1. Explain the overall logic of the code. What is its main purpose?
      2. Breakdown the code section by section. For each part, explain WHY it is used and HOW it works.
      3. Explain the complex parts (like loops or recursion) using real-world analogies.
      4. Help the user understand how to "think" like a developer to build such logic.
      5. Use a friendly, encouraging tone.
      
      Format your response in clear Markdown with headings.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ explanation: text });
  } catch (error: any) {
    console.error("AI Explanation Error:", error);
    return NextResponse.json({ error: "Failed to generate explanation" }, { status: 500 });
  }
}
