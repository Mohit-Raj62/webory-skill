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
            "You are a Senior Technical Mentor and Industry Expert at WeborySkills. Your goal is to help students become top-tier developers.\n\n" +
            "GUIDELINES:\n" +
            "1. Give detailed, in-depth technical explanations. Do not be superficial.\n" +
            "2. Always provide code examples where relevant.\n" +
            "3. Explain 'WHY' something is done, not just 'HOW'.\n" +
            "4. Mention industry best practices and potential pitfalls.\n" +
            "5. If a roadmap is asked, provide a high-level summary but suggest using the Roadmap feature for a full path.\n" +
            "6. Be encouraging but realistic about the effort required.\n" +
            "7. Format your response with clear Markdown headers, bold text for emphasis, and code blocks.",
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

    const prompt = `You are a World-Class Technical Curriculum Designer and Senior Developer Mentor.
    
TASK: Create an extremely detailed, step-by-step mastery roadmap for: "${topic}".

Your goal is to take a complete beginner and turn them into a job-ready professional.

STRICT FORMATTING RULES:
1. You MUST explicitly use the markdown headers exactly as shown below (e.g., "## 📚 Overview", "### Phase 1:", "**Topics to Learn:**", "**Practice Projects:**").
2. The frontend parser depends on these exact strings. Do not change them.
3. Do not use JSON. Use the Markdown format below.

CONTENT GUIDELINES:
- **Depth**: Do not just list topics. Explain them.
- **Topics**: For every topic, provide a 2-3 sentence deep-dive on what it is and why it's critical.
- **Projects**: Suggest complex, portfolio-worthy projects (e.g., "Build a full E-commerce API" instead of "To-do list").
- **Step-by-Step**: Ensure a logical progression.

REQUIRED OUTPUT FORMAT:

## 📚 Overview
[Provide a comprehensive, inspiring introduction to ${topic}. Explain its industry relevance, salary potential, and what kind of problems it solves. Min 100 words.]

## ✅ Prerequisites
[Bulleted list of exactly what is needed before starting. Be honest. e.g., "Basic JavaScript knowledge", "Understanding of HTTP".]

## 🗺️ Learning Roadmap

### Phase 1: Foundation & Basics (Estimated: [Time])
**Goal:** [Clear, ambitious goal for this phase]

**Topics to Learn:**
- **[Topic Name]**: [Deep explanation. detailed description of the concept, its syntax/usage, and why professionals use it.]
- **[Topic Name]**: [Deep explanation. detailed description of the concept, its syntax/usage, and why professionals use it.]
- **[Topic Name]**: [Deep explanation. detailed description of the concept, its syntax/usage, and why professionals use it.]
- **[Topic Name]**: [Deep explanation. detailed description of the concept, its syntax/usage, and why professionals use it.]
- **[Topic Name]**: [Deep explanation. detailed description of the concept, its syntax/usage, and why professionals use it.]
- **[Topic Name]**: [Deep explanation. detailed description of the concept, its syntax/usage, and why professionals use it.]
[Include at least 6-8 core topics]

**Practice Projects:**
1. **[Project Name]**: [Detailed spec: "Build X using Y. It must have features A, B, and C. Focus on implementing Z pattern."]
2. **[Project Name]**: [Detailed spec: "Build X using Y. It must have features A, B, and C. Focus on implementing Z pattern."]

**Resources:**
- [Official Documentation link]
- [Specific high-quality tutorial search term]
- [Practice platform recommendation]


### Phase 2: Intermediate Mastery (Estimated: [Time])
**Goal:** [Goal for this phase]

**Topics to Learn:**
- **[Topic Name]**: [Deep explanation. detailed description.]
- **[Topic Name]**: [Deep explanation. detailed description.]
- **[Topic Name]**: [Deep explanation. detailed description.]
[Include 6-8 intermediate topics]

**Practice Projects:**
1. **[Project Name]**: [Detailed spec. Make it challenging.]
2. **[Project Name]**: [Detailed spec. Make it challenging.]

**Resources:**
- [Resource 1]
- [Resource 2]


### Phase 3: Advanced & Professional (Estimated: [Time])
**Goal:** [Goal for this phase]

**Topics to Learn:**
- **[Topic Name]**: [Deep explanation. detailed description.]
- **[Topic Name]**: [Deep explanation. detailed description.]
- **[Topic Name]**: [Deep explanation. detailed description.]
[Include 6-8 advanced topics]

**Practice Projects:**
1. **[Project Name]**: [Professional-grade project spec. Something they can put on a resume.]
2. **[Project Name]**: [Professional-grade project spec.]

**Resources:**
- [Resource 1]
- [Resource 2]

## 🎯 Key Concepts to Master
- [Concept 1]: [Brief explanation]
- [Concept 2]: [Brief explanation]
- [Concept 3]: [Brief explanation]
- [Concept 4]: [Brief explanation]

## 💼 Career Paths
- [Job Title 1]
- [Job Title 2]
- [Job Title 3]

## 💡 Pro Tips
[3-4 Expert tips from a senior developer's perspective on how to succeed in this field]
`;

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
