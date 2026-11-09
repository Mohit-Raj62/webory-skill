import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Groq from "groq-sdk";
import { requireAdmin } from "@/lib/exam-auth";
import {
  getCuratedQuestionsByLevel,
  distributeAndShuffleOptions,
} from "@/lib/basic-questions";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || "" });

export async function POST(req: Request) {
  try {
    const auth = await requireAdmin();
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const body = await req.json();
    const {
      subject = "General Technology",
      course = "",
      topic = "Fundamentals",
      chapter = "",
      count = 5,
      selectedLevel = "easy", // "easy" | "medium" | "hard" | "custom"
      difficultyDistribution = { easy: 5, medium: 0, hard: 0 },
      questionTypes = ["mcq"],
      marksPerQuestion = 1,
      basicOnly = false,
    } = body;

    const totalQuestions = Math.min(Math.max(Number(count) || 5, 1), 30);

    // Fast-path / Instant Curated Questions
    if (basicOnly) {
      const levelFilter = selectedLevel === "custom" ? "all" : selectedLevel;
      const curated = getCuratedQuestionsByLevel(subject, levelFilter as any, totalQuestions).map((q) => ({
        ...q,
        questionType: "mcq",
        negativeMarks: 0,
        marks: Number(marksPerQuestion) || 1,
      }));
      return NextResponse.json({
        success: true,
        questions: curated,
        provider: "curated-library",
      });
    }

    // Determine Easy/Medium/Hard counts
    let easyCount = difficultyDistribution?.easy ?? 0;
    let mediumCount = difficultyDistribution?.medium ?? 0;
    let hardCount = difficultyDistribution?.hard ?? 0;

    if (selectedLevel === "easy") {
      easyCount = totalQuestions;
      mediumCount = 0;
      hardCount = 0;
    } else if (selectedLevel === "medium") {
      easyCount = Math.floor(totalQuestions * 0.4);
      mediumCount = totalQuestions - easyCount;
      hardCount = 0;
    } else if (selectedLevel === "hard") {
      easyCount = Math.floor(totalQuestions * 0.3);
      mediumCount = Math.floor(totalQuestions * 0.4);
      hardCount = totalQuestions - easyCount - mediumCount;
    }

    const prompt = `
You are an expert exam creator for Webory Skills.
Your task is to generate exactly ${totalQuestions} SHORT, CRISP multiple choice questions.

CRITICAL LENGTH & COMPLEXITY RULES:
1. QUESTION LENGTH: MUST BE SHORT (Maximum 1 to 2 lines, under 20 words). DO NOT write long paragraphs, stories, or scenario descriptions.
2. OPTIONS LENGTH: MUST BE CONCISE (1 to 4 words per option).
3. DIFFICULTY SPECIFICATIONS (ONLY 3 LEVELS):
   - Easy (${easyCount} questions): Direct basic definitions and syntax (e.g. "What does HTML stand for?", "Which tag creates a heading?").
   - Medium (${mediumCount} questions): Basic practical usage (e.g. "Which CSS property sets text color?", "How to select ID in CSS?").
   - Hard (${hardCount} questions): Simple output prediction or logic (e.g. "What is output of 2 + '2' in JS?"). NEVER make questions overly difficult, confusing, or research-level.
4. OPTION RANDOMIZATION (CRITICAL):
   - Distribute the correct answer index across 0 (A), 1 (B), 2 (C), and 3 (D) evenly.
   - DO NOT make the correct answer option A (index 0) for all questions!
   - Consecutive questions MUST NOT share the same correct option index.
5. EXPLANATION: Exactly 1 short sentence.

Subject: ${subject}
Topic: ${topic}
Total Questions: ${totalQuestions}
Easy count: ${easyCount}, Medium count: ${mediumCount}, Hard count: ${hardCount}
Allowed Types: ${questionTypes.join(", ")}
Marks: ${marksPerQuestion}

Respond ONLY with a valid JSON array of question objects:
[
  {
    "questionText": "Which keyword declares a variable in modern JavaScript?",
    "questionType": "mcq",
    "options": ["let", "var", "dim", "val"],
    "correctAnswer": 0,
    "explanation": "'let' and 'const' declare block-scoped variables in modern JavaScript.",
    "marks": 1,
    "negativeMarks": 0,
    "difficulty": "easy",
    "subject": "${subject}",
    "topic": "${topic}"
  }
]
`;

    // Attempt 1: Gemini 2.5 / 1.5
    if (process.env.GEMINI_API_KEY) {
      try {
        const model = genAI.getGenerativeModel({
          model: "gemini-2.5-flash",
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.3,
          },
        });

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const parsed = JSON.parse(text);

        if (Array.isArray(parsed) && parsed.length > 0) {
          return NextResponse.json({
            success: true,
            questions: sanitizeQuestions(parsed, subject, topic),
            provider: "gemini",
          });
        }
      } catch (geminiErr: any) {
        console.warn("Gemini generation failed, falling back to Groq:", geminiErr?.message || geminiErr);
      }
    }

    // Attempt 2: Groq Fallback
    if (process.env.GROQ_API_KEY) {
      try {
        const groqCompletion = await groq.chat.completions.create({
          messages: [
            {
              role: "system",
              content:
                "You are an assessment engine. Generate only short, 1-line basic multiple choice questions. Always output valid JSON array.",
            },
            { role: "user", content: prompt },
          ],
          model: "llama-3.3-70b-versatile",
          temperature: 0.3,
          response_format: { type: "json_object" },
        });

        const content = groqCompletion.choices[0]?.message?.content || "";
        let parsed = JSON.parse(content);
        if (!Array.isArray(parsed) && parsed.questions && Array.isArray(parsed.questions)) {
          parsed = parsed.questions;
        }

        if (Array.isArray(parsed) && parsed.length > 0) {
          return NextResponse.json({
            success: true,
            questions: sanitizeQuestions(parsed, subject, topic),
            provider: "groq",
          });
        }
      } catch (groqErr: any) {
        console.error("Groq fallback error:", groqErr?.message || groqErr);
      }
    }

    // Fallback: Return curated short questions matching the requested level
    const fallbackLevel = selectedLevel === "custom" ? "all" : selectedLevel;
    const curatedFallback = getCuratedQuestionsByLevel(subject, fallbackLevel as any, totalQuestions).map((q) => ({
      ...q,
      questionType: "mcq",
      negativeMarks: 0,
      marks: Number(marksPerQuestion) || 1,
    }));

    return NextResponse.json({
      success: true,
      questions: curatedFallback,
      provider: "curated-library",
    });
  } catch (error: any) {
    console.error("Question generation error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to generate questions" },
      { status: 500 }
    );
  }
}

function sanitizeQuestions(questions: any[], defaultSubject: string, defaultTopic: string) {
  const cleaned = questions.map((q, idx) => ({
    questionText: q.questionText || `Question ${idx + 1}`,
    questionType: q.questionType || "mcq",
    options: Array.isArray(q.options) && q.options.length > 0 ? q.options.map(String) : ["A", "B", "C", "D"],
    correctAnswer: q.correctAnswer !== undefined ? q.correctAnswer : 0,
    explanation: q.explanation || "Correct answer.",
    marks: Number(q.marks) || 1,
    negativeMarks: Number(q.negativeMarks) || 0,
    difficulty: ["easy", "medium", "hard"].includes(q.difficulty) ? q.difficulty : "easy",
    subject: q.subject || defaultSubject,
    topic: q.topic || defaultTopic,
    codeSnippet: q.codeSnippet || "",
    language: q.language || "javascript",
  }));

  // Ensure options are balanced and distributed across A, B, C, D without consecutive repeats
  return distributeAndShuffleOptions(cleaned);
}
