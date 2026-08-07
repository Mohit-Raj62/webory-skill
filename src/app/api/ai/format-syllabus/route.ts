import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      You are an expert curriculum formatter. I am building a learning platform where a syllabus is displayed as a visual roadmap.
      The roadmap parser requires strict Markdown formatting:
      - Main modules, sections, or weeks MUST start with "## " (e.g. "## Week 1: Introduction" or "## Module 1")
      - Subtopics and details MUST be bullet points starting with "- " (e.g. "- Topic 1")
      
      Take the following messy, unformatted syllabus text and format it perfectly according to these rules.
      Do not add any conversational text before or after the syllabus. ONLY return the formatted markdown.
      Make sure to logically organize the content. If there are no clear weeks, group topics into logical "## " headings.

      RAW TEXT:
      ${text}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const formattedText = response.text();

    return NextResponse.json({ formattedText });
  } catch (error: any) {
    console.error("AI Formatting Error:", error);
    return NextResponse.json({ error: "Failed to format syllabus" }, { status: 500 });
  }
}
