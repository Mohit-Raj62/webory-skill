import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/db";
import User from "@/models/User";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || "",
});

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    jwt.verify(token, process.env.JWT_SECRET!);

    const { mode, topic, level, action, currentQuestion, userAnswer, history } =
      await req.json();

    // Validate inputs
    if (!mode || !topic || !action) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const getCompletion = async (messages: any[]) => {
      const models = [
        "llama-3.3-70b-versatile",
        "llama-3.1-8b-instant",
        "llama3-70b-8192",
      ];

      for (const model of models) {
        try {
          const completion = await groq.chat.completions.create({
            messages,
            model: model,
            temperature: 0.7,
            response_format: { type: "json_object" },
          });
          return completion;
        } catch (error: any) {
          console.warn(`Model ${model} failed:`, error.message);
          // Retry only on Rate Limit (429) or Service Unavailable (503)
          if (
            (error.status === 429 ||
              error.status === 503 ||
              error.code === "rate_limit_exceeded") &&
            model !== models[models.length - 1]
          ) {
            continue;
          }
          throw error;
        }
      }
      throw new Error("All models failed");
    };

    // --- ACTION: START ---
    if (action === "start") {
      const prompt = `
            You are an expert AI Interviewer and Aptitude Trainer.
            Mode: ${mode === "interview" ? "Mock Interview" : "Aptitude Test"}
            Topic: ${topic}
            Level: ${level}

            TASK: Generate the FIRST ${mode === "interview" ? "technical interview question" : "aptitude question"} for this session.

            REQUIREMENTS:
            1. Question must be relevant to the topic and level.
            2. ${mode === "interview" ? "Open-ended technical question. No Multiple Choice." : "Provide 4 options (A, B, C, D)."}
            3. Do not provide the answer yet.
            4. Be professional and encouraging.

            OUTPUT FORMAT (JSON):
            {
                "question": "The question text",
                ${mode === "aptitude" ? '"options": ["A) ...", "B) ...", "C) ...", "D) ..."],' : ""}
                "intro": "A short welcoming intro message."
            }
            `;

      const completion = await getCompletion([
        { role: "user", content: prompt },
      ]);

      const result = JSON.parse(completion.choices[0].message.content || "{}");

      // Ensure 'question' field exists
      if (!result.question && result.nextQuestion) {
        result.question = result.nextQuestion;
      }

      return NextResponse.json(result);
    }

    // --- ACTION: SUBMIT ANSWER ---
    if (action === "submit_answer") {
      const questionIndex = history ? history.length + 1 : 1;

      // Extract previous questions to avoid repetition
      const previousQuestions = history
        ? history.map((h: any) => h.question).join("\n- ")
        : "";

      let difficulty = "Easy";
      if (mode === "aptitude") {
        // 30 Questions: 1-10 Easy, 11-20 Medium, 21-30 Hard
        if (questionIndex > 20) difficulty = "Hard";
        else if (questionIndex > 10) difficulty = "Medium";
      } else {
        // 15 Questions: 1-5 Easy, 6-10 Medium, 11-15 Hard
        if (questionIndex > 10) difficulty = "Hard";
        else if (questionIndex > 5) difficulty = "Medium";
      }

      const prompt = `
            You are an expert AI Interviewer.
            Mode: ${mode}
            Topic: ${topic}
            Current Difficulty Level: ${difficulty}
            
            Current Question: ${currentQuestion}
            User Answer: ${userAnswer}

            PREVIOUS QUESTIONS (DO NOT REPEAT THESE):
            - ${currentQuestion}
            - ${previousQuestions}

            TASK: 
            1. Evaluate the answer.
            2. Generate the NEXT question.
            3. The next question MUST be of ${difficulty} difficulty.
            4. Ensure the next question is distinct and has NOT been asked before.
            
            OUTPUT FORMAT (JSON):
            {
                "feedback": "Brief feedback on the answer (Correct/Incorrect and why).",
                "score": 0-10 (Rating for this specific answer),
                "nextQuestion": "The next question text",
                ${mode === "aptitude" ? '"options": ["A) ...", "B) ...", "C) ...", "D) ..."],' : ""}
                "isCorrect": boolean (true ONLY if user selected the correct option, else false)
            }
            `;

      const completion = await getCompletion([
        { role: "user", content: prompt },
      ]);

      const result = JSON.parse(completion.choices[0].message.content || "{}");

      // Fallback if AI returns 'question' instead of 'nextQuestion'
      if (!result.nextQuestion && result.question) {
        result.nextQuestion = result.question;
      }

      return NextResponse.json(result);
    }

    // --- ACTION: ANALYZE (Final Report) ---
    if (action === "analyze") {
      const prompt = `
            You are a Senior Mentor. Analyze this session history and provide a final report.
            Mode: ${mode}
            Topic: ${topic}
            History: ${JSON.stringify(history)}

            TASK: Generate a comprehensive performance report.

            OUTPUT FORMAT (JSON):
            {
                "overallScore": number (0-100),
                "strengths": ["point 1", "point 2"],
                "weaknesses": ["point 1", "point 2"],
                "tips": ["actionable tip 1", "actionable tip 2"],
                "summary": "A friendly encouraging summary paragraph."
            }
            `;

      const completion = await getCompletion([
        { role: "user", content: prompt },
      ]);

      const analysis = JSON.parse(
        completion.choices[0].message.content || "{}",
      );

      // --- XP & Streak Calculation ---
      await dbConnect();
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
      const user = await User.findById(decoded.userId);

      if (user) {
        // XP Calculation Rules:
        // Interview: Flat 100 XP for completion
        // Aptitude: 5 XP per question answered (Max 150)
        const questionsAnswered = history ? history.length : 0;
        let xpEarned = 0;

        if (mode === "interview") {
          xpEarned = 50;
        } else {
          // For Aptitude: 1 XP per CORRECT answer (Robust check)
          const correctAnswers = history
            ? history.filter((h: any) => h.isCorrect === true || h.score >= 7)
                .length
            : 0;
          xpEarned = correctAnswers;
        }

        // Streak Logic
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let lastActive = user.streak?.lastActiveDate
          ? new Date(user.streak.lastActiveDate)
          : null;
        if (lastActive) lastActive.setHours(0, 0, 0, 0);

        let newStreak = user.streak?.count || 0;
        let streakBonus = 0;

        if (!lastActive || lastActive.getTime() < today.getTime()) {
          // Valid new day
          if (
            lastActive &&
            today.getTime() - lastActive.getTime() === 86400000
          ) {
            // Consecutive day
            newStreak += 1;
          } else {
            // Reset or Start
            newStreak = 1;
          }

          // Daily Streak Bonus (e.g., 10 XP if streak > 1)
          if (newStreak > 1) streakBonus = 10;

          user.streak = { count: newStreak, lastActiveDate: new Date() };
        }

        console.log(
          `[XP UPDATE] User: ${user._id}, Current XP: ${user.xp}, XP Earned: ${xpEarned}, Streak Bonus: ${streakBonus}`,
        );

        user.xp = (user.xp || 0) + xpEarned + streakBonus;
        await user.save();

        console.log(`[XP UPDATE] New XP Saved: ${user.xp}`);

        // Append to response
        analysis.xpEarned = xpEarned;
        analysis.streakBonus = streakBonus;
        analysis.totalXp = user.xp;
        analysis.currentStreak = newStreak;

        // Append to response
        analysis.xpEarned = xpEarned;
        analysis.streakBonus = streakBonus;
        analysis.totalXp = user.xp;
        analysis.currentStreak = newStreak;
      }

      return NextResponse.json(analysis);
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    console.error("AI Practice Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
