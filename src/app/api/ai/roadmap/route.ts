import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/db";
import Course from "@/models/Course";

// Initialize Groq AI
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || "",
});

export async function POST(req: Request) {
  try {
    // Check authentication
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    jwt.verify(token, process.env.JWT_SECRET!);

    const { topic, mode, conversationHistory } = await req.json();

    if (!topic || topic.trim().length === 0) {
      return NextResponse.json(
        { error: "Question is required" },
        { status: 400 }
      );
    }

    // Q&A Chat Mode
    if (mode === "chat") {
      const messages = [
        {
          role: "system" as const,
          content:
            "You are a helpful AI learning assistant for WeborySkills platform. Answer questions clearly, provide examples, and help users learn effectively. Keep responses concise but informative.",
        },
        ...(conversationHistory || []),
        {
          role: "user" as const,
          content: topic,
        },
      ];

      console.log("Chat mode - Answering question:", topic);

      const completion = await groq.chat.completions.create({
        messages: messages,
        model: "llama-3.3-70b-versatile",
        temperature: 0.7,
        max_tokens: 2048,
      });

      const answer =
        completion.choices[0]?.message?.content ||
        "Sorry, I couldn't generate an answer.";

      console.log(`✅ Generated answer for question`);

      return NextResponse.json({
        success: true,
        answer: answer,
        mode: "chat",
      });
    }

    // Roadmap Mode (existing functionality)
    await dbConnect();
    const relatedCourses = await Course.find({
      $or: [
        { title: { $regex: topic, $options: "i" } },
        { description: { $regex: topic, $options: "i" } },
      ],
    })
      .limit(3)
      .select("title description price thumbnail");

    const courseRecommendations =
      relatedCourses.length > 0
        ? `\n\n## 🎓 Recommended Courses from WeborySkills\n\nWe have curated courses on our platform that align with your learning goals:\n\n${relatedCourses
            .map(
              (course: any, idx: number) =>
                `${idx + 1}. **${
                  course.title
                }**\n   ${course.description.substring(
                  0,
                  150
                )}...\n   [Enroll Now](${
                  process.env.NEXT_PUBLIC_APP_URL || "https://weboryskills.in"
                }/courses/${course._id})`
            )
            .join("\n\n")}\n\n💡 Visit [WeborySkills](${
            process.env.NEXT_PUBLIC_APP_URL || "https://weboryskills.in"
          }) to explore all our courses and start your learning journey!`
        : "";

    const prompt = `You are an expert learning advisor creating educational roadmaps.

TASK: Create a comprehensive learning roadmap for: "${topic}"

IMPORTANT GUIDELINES:
- Focus on "${topic}" as a technical skill, programming language, or technology
- Provide step-by-step learning path from beginner to advanced
- Include practical projects and resources
- Be specific and actionable

Please provide a detailed response in the following format:

## 📚 Overview
Brief introduction to ${topic} and why it's valuable to learn.

## ✅ Prerequisites
What foundational knowledge is needed before starting (if any).

## 🗺️ Learning Roadmap

### Phase 1: Beginner (Estimated: X weeks/months)
**Goal:** [What you'll achieve]

**Topics to Learn:**
- Topic 1: Brief description
- Topic 2: Brief description
- Topic 3: Brief description

**Practice Projects:**
1. Project idea 1
2. Project idea 2

**Resources:**
- Resource type 1
- Resource type 2

### Phase 2: Intermediate (Estimated: X weeks/months)
[Same structure as Phase 1]

### Phase 3: Advanced (Estimated: X weeks/months)
[Same structure as Phase 1]

## 🎯 Key Concepts to Master
- Concept 1
- Concept 2
- Concept 3

## 💼 Career Paths
Where this skill can lead you professionally.

## 🔗 Recommended Resources
- Online courses
- Documentation
- Books
- Communities

## 💡 Pro Tips
Practical advice for learning ${topic} effectively.

Keep the response well-structured, actionable, and motivating. Use emojis sparingly for visual appeal.`;

    console.log("Roadmap mode - Generating roadmap for topic:", topic);

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 4096,
    });

    const roadmap =
      completion.choices[0]?.message?.content || "Failed to generate roadmap";

    console.log(`✅ Generated roadmap for topic: ${topic}`);
    console.log(`📚 Found ${relatedCourses.length} related courses`);

    return NextResponse.json({
      success: true,
      roadmap: roadmap + courseRecommendations,
      topic: topic,
      mode: "roadmap",
      recommendedCourses: relatedCourses.map((c: any) => ({
        id: c._id,
        title: c.title,
        description: c.description,
        price: c.price,
        thumbnail: c.thumbnail,
      })),
    });
  } catch (error: any) {
    console.error("AI generation error:", error);
    console.error("Error details:", error.message);
    return NextResponse.json(
      {
        error: "Failed to generate response",
        details: error.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
