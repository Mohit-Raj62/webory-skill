import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Activity from "@/models/Activity";
import crypto from "crypto";

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

    const getCompletion = async (messages: any[], useFastModel = false) => {
      const models = useFastModel
        ? ["llama-3.1-8b-instant", "llama-3.3-70b-versatile"]
        : ["llama-3.3-70b-versatile", "llama-3.1-8b-instant"];

      for (const model of models) {
        try {
          const completion = await groq.chat.completions.create({
            messages,
            model: model,
            temperature: 0.7,
            max_tokens: 1024, // Optimized limit
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
      // --- IDEMPOTENCY CHECK ---
      await dbConnect();
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
      const user = await User.findById(decoded.userId);

      if (user) {
        const sessionHash = crypto
          .createHash("sha256")
          .update(JSON.stringify(history))
          .digest("hex");

        const alreadyCompleted = user.completedSessions?.includes(sessionHash);

        // Calculate raw metrics to anchor AI scoring
        const totalQuestions = history ? history.length : 0;
        const correctCount = history
          ? history.filter((h: any) => h.isCorrect === true).length
          : 0;
        const accuracy =
          totalQuestions > 0
            ? Math.round((correctCount / totalQuestions) * 100)
            : 0;
        const avgRawScore = history
          ? history.reduce((sum: number, h: any) => sum + (h.score || 0), 0) /
            (totalQuestions || 1)
          : 0;

        // Strip 'feedback' from history to save tokens and time
        const condensedHistory = history?.map((h: any) => ({
          question: h.question,
          userAnswer: h.userAnswer,
          score: h.score,
          isCorrect: h.isCorrect,
        }));

        const prompt = `
            Analyze this session history and provide a performance report.
            Mode: ${mode} | Topic: ${topic}
            
            HARD METRICS (Calculated by System):
            - Accuracy: ${accuracy}%
            - Average Answer Rating: ${avgRawScore.toFixed(1)}/10
            - Total Questions: ${totalQuestions}

            History: ${JSON.stringify(condensedHistory)}

            TASK: Return a concise evaluation. The "overallScore" MUST be strictly grounded in the HARD METRICS provided above. 
            For Aptitude, "overallScore" should very closely align with Accuracy.
            For Interview, it can be a balance of Accuracy and Average Rating.
            
            JSON FORMAT:
            {
                "overallScore": 0-100,
                "strengths": ["max 2 points"],
                "weaknesses": ["max 2 points"],
                "tips": ["max 2 actionable tips"],
                "summary": "1-2 sentence encouraging summary."
            }
            `;

        const completion = await getCompletion(
          [{ role: "user", content: prompt }],
          true,
        ); // Use fast model for summary

        const analysis = JSON.parse(
          completion.choices[0].message.content || "{}",
        );

        if (alreadyCompleted) {
          console.log(`[XP SKIP] Session already completed: ${sessionHash}`);
          analysis.xpEarned = 0;
          analysis.streakBonus = 0;
          analysis.totalXp = user.xp;
          analysis.currentStreak = user.streak?.count || 0;
          analysis.alreadyAwarded = true;
          return NextResponse.json(analysis);
        }

        // XP Calculation Rules:
        const questionsAnswered = history ? history.length : 0;
        let xpEarned = 0;

        if (mode === "interview") {
          xpEarned = 50;
        } else {
          // For Aptitude: 1 XP per CORRECT answer
          const correctAnswers = history
            ? history.filter((h: any) => h.isCorrect === true || h.score >= 7)
                .length
            : 0;
          xpEarned = correctAnswers;
        }

        // Streak Logic
        // --- STREAK LOGIC (Robust) ---
        const now = new Date();
        const today = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
        );

        let lastActive = null;
        if (user.streak?.lastActiveDate) {
          const laDate = new Date(user.streak.lastActiveDate);
          lastActive = new Date(
            laDate.getFullYear(),
            laDate.getMonth(),
            laDate.getDate(),
          );
        }

        let newStreak = user.streak?.count || 0;
        let streakBonus = 0;

        // If never active OR last active was before today
        if (!lastActive || lastActive.getTime() < today.getTime()) {
          const oneDayMs = 24 * 60 * 60 * 1000;
          // Yesterday is within ~25 hours of today's midnight
          const isYesterday =
            lastActive &&
            today.getTime() - lastActive.getTime() <= oneDayMs + 3600000;

          if (isYesterday) {
            newStreak += 1;
          } else {
            newStreak = 1;
          }

          if (newStreak > 1) streakBonus = 10;
          user.streak = { count: newStreak, lastActiveDate: now };
          console.log(`[STREAK] Updated for ${user.email} to ${newStreak}`);
        } else {
          console.log(
            `[STREAK] Already recorded today for ${user.email}. Count: ${newStreak}`,
          );
        }

        user.xp = (user.xp || 0) + xpEarned + streakBonus;

        if (!user.completedSessions) user.completedSessions = [];
        user.completedSessions.push(sessionHash);

        // Record Activity for Monthly Analytics
        // Record Activity for Monthly Analytics
        try {
          // Adjust by 5.5 hours for IST to ensure the dot appears on the correct local day
          const istDate = new Date(Date.now() + 5.5 * 60 * 60 * 1000);

          await Activity.create({
            student: user._id,
            type: "quiz_attempted",
            category: "course",
            date: istDate,
            metadata: {
              questionsCount: questionsAnswered,
              internshipName: topic,
            },
          });
          console.log(
            `[ACTIVITY] Recorded for ${user.email} on ${istDate.toISOString()}`,
          );
        } catch (actErr: any) {
          console.error(`[ACTIVITY ERROR]`, actErr.message);
        }

        await user.save();

        analysis.xpEarned = xpEarned;
        analysis.streakBonus = streakBonus;
        analysis.totalXp = user.xp;
        analysis.currentStreak = newStreak;

        return NextResponse.json(analysis);
      }
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    console.error("AI Practice Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
