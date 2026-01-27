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

    const { topic, level, mode, conversationHistory } = await req.json();

    if (!topic || topic.trim().length === 0) {
      return NextResponse.json(
        { error: "Question is required" },
        { status: 400 },
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
                  150,
                )}...\n   [Enroll Now](${
                  process.env.NEXT_PUBLIC_APP_URL || "https://weboryskills.in"
                }/courses/${course._id})`,
            )
            .join("\n\n")}\n\n💡 Visit [WeborySkills](${
            process.env.NEXT_PUBLIC_APP_URL || "https://weboryskills.in"
          }) to explore all our courses and start your learning journey!`
        : "";

    // Define level-specific instructions
    const levelInstructions = {
      Beginner:
        "Your goal is to take a complete beginner with NO prior experience and turn them into a job-ready professional. Start from absolute basics (e.g., 'What is a variable?', 'How to install tools'). Use simple language and explain every concept thoroughly. Focus on building strong fundamentals.",
      Intermediate:
        "Your goal is to help someone who already knows the basics advance to a professional level. Skip beginner topics like 'what is a variable' and focus on intermediate concepts, design patterns, best practices, and real-world application. Assume they have 6-12 months of experience. Help them build production-ready skills.",
      Advanced:
        "Your goal is to help an experienced professional master advanced topics and become an expert. Focus on system design, architecture, optimization, scalability, advanced patterns, and cutting-edge techniques. Assume they have 2+ years of experience and want to reach senior/lead level. Emphasize industry best practices and leadership skills.",
    };

    const levelInstruction =
      levelInstructions[level as keyof typeof levelInstructions] ||
      levelInstructions.Beginner;

    const prompt = `You are a World-Class Technical Curriculum Designer and Senior Developer Mentor with 10+ years of industry experience.
    
TASK: Create an extremely detailed, step-by-step mastery roadmap for: "${topic}" at the ${level} level.

${levelInstruction}

CRITICAL ACCURACY REQUIREMENTS:
1. **Industry-Relevant**: Only include technologies and practices that are CURRENTLY used in the industry (2024-2026). Avoid outdated tools.
2. **Practical Focus**: Every topic should have a clear real-world application. Explain "Why this matters in production."
3. **Realistic Timeline**: Provide honest time estimates based on actual learning curves (e.g., "2-3 weeks" not "2 days" for complex topics).
4. **Modern Stack**: Recommend current industry-standard tools, frameworks, and best practices.
5. **Job-Ready Skills**: Focus on what employers actually look for in job descriptions.

STRICT FORMATTING RULES:
1. You MUST explicitly use the markdown headers exactly as shown below (e.g., "## 📚 Overview", "### Phase 1:", "**Topics to Learn:**", "**Practice Projects:**").
2. The frontend parser depends on these exact strings. Do not change them.
3. Do not use JSON. Use the Markdown format below.

CONTENT GUIDELINES:
- **Depth**: Do not just list topics. Explain them with context.
- **Topics**: For every topic, provide a 2-3 sentence explanation covering: (1) What it is, (2) Why it's critical in production, (3) Real-world use case.
- **Projects**: Suggest portfolio-worthy projects that demonstrate job-ready skills. Include specific features and technologies to use.
- **Resources**: Recommend specific, high-quality, free resources (official docs, YouTube channels, practice platforms).
- **Step-by-Step**: Ensure a logical, dependency-aware progression (e.g., learn X before Y).

REQUIRED OUTPUT FORMAT:

## 📚 Overview
[Provide a comprehensive, inspiring introduction to ${topic}. Include:
- What is ${topic} and why it matters in 2024-2026
- Industry demand and salary potential (be specific with ranges)
- Real-world problems it solves
- Career opportunities and growth path
Min 150 words. Make it motivating but realistic.]

## ✅ Prerequisites
[Bulleted list of exactly what is needed before starting. Be honest and specific.
Examples:
- "Basic understanding of JavaScript (variables, functions, loops)"
- "Familiarity with command line/terminal"
- "HTML & CSS fundamentals"
Include 3-5 prerequisites based on the ${level} level.]

## 🗺️ Learning Roadmap

### Phase 1: Foundation & Core Concepts (Estimated: [Realistic Time e.g., 4-6 weeks])
**Goal:** [Clear, specific, measurable goal for this phase. E.g., "Build 3 functional projects demonstrating core concepts"]

**Topics to Learn:**
- **[Topic Name]**: [2-3 sentences: What it is, why it's essential in production, and a real-world example. E.g., "**State Management**: The practice of managing application data flow. Critical for building scalable apps because it prevents prop-drilling and makes debugging easier. Used in every modern React app at companies like Netflix and Airbnb."]
- **[Topic Name]**: [Deep explanation with real-world context]
- **[Topic Name]**: [Deep explanation with real-world context]
- **[Topic Name]**: [Deep explanation with real-world context]
- **[Topic Name]**: [Deep explanation with real-world context]
- **[Topic Name]**: [Deep explanation with real-world context]
[Include 6-8 core topics relevant to ${level} level]

**Practice Projects:**
1. **[Project Name]**: [Detailed spec with specific features. E.g., "**E-commerce Product Catalog**: Build a product listing page with filtering, sorting, and search. Must include: React components, API integration, responsive design, and error handling. Focus on component reusability and clean code."]
2. **[Project Name]**: [Detailed, portfolio-worthy project spec]
3. **[Project Name]**: [Detailed, portfolio-worthy project spec]

**Resources:**
- Official Documentation: [Specific link or search term]
- Video Tutorial: [Specific YouTube channel or course name]
- Practice Platform: [E.g., "LeetCode for algorithms", "Frontend Mentor for UI projects"]


### Phase 2: Intermediate & Production Skills (Estimated: [Time])
**Goal:** [Specific goal focused on production-ready skills]

**Topics to Learn:**
- **[Topic Name]**: [Explanation with industry context and real-world application]
- **[Topic Name]**: [Explanation with industry context]
- **[Topic Name]**: [Explanation with industry context]
- **[Topic Name]**: [Explanation with industry context]
- **[Topic Name]**: [Explanation with industry context]
- **[Topic Name]**: [Explanation with industry context]
[Include 6-8 intermediate topics]

**Practice Projects:**
1. **[Project Name]**: [Complex, production-like project. E.g., "**Full-Stack Social Media Dashboard**: Build a complete dashboard with authentication, real-time updates, and data visualization. Tech stack: React, Node.js, MongoDB, Socket.io. Must include: JWT auth, RESTful API, responsive UI, and deployment to Vercel/Heroku."]
2. **[Project Name]**: [Production-grade project spec]
3. **[Project Name]**: [Production-grade project spec]

**Resources:**
- [Specific resource 1]
- [Specific resource 2]
- [Specific resource 3]


### Phase 3: Advanced & Expert Level (Estimated: [Time])
**Goal:** [Goal focused on mastery and leadership]

**Topics to Learn:**
- **[Topic Name]**: [Advanced concept with system design context]
- **[Topic Name]**: [Advanced concept with scalability focus]
- **[Topic Name]**: [Advanced concept with performance optimization]
- **[Topic Name]**: [Advanced concept]
- **[Topic Name]**: [Advanced concept]
- **[Topic Name]**: [Advanced concept]
[Include 6-8 advanced topics]

**Practice Projects:**
1. **[Project Name]**: [Enterprise-level project. E.g., "**Microservices E-commerce Platform**: Build a scalable e-commerce system with separate services for users, products, orders, and payments. Implement: API Gateway, service discovery, message queues, caching, monitoring, and CI/CD pipeline. Deploy on AWS/GCP."]
2. **[Project Name]**: [Enterprise-level project spec]

**Resources:**
- [Advanced resource 1]
- [Advanced resource 2]

## 🎯 Key Concepts to Master
- **[Concept 1]**: [Why it's critical for ${topic} professionals]
- **[Concept 2]**: [Industry importance]
- **[Concept 3]**: [Real-world application]
- **[Concept 4]**: [Career impact]
[Include 4-6 must-know concepts]

## 💼 Career Paths
- **[Job Title 1]**: [Salary range and key responsibilities]
- **[Job Title 2]**: [Salary range and key responsibilities]
- **[Job Title 3]**: [Salary range and key responsibilities]
- **[Job Title 4]**: [Salary range and key responsibilities]
[Include 4-5 realistic career paths]

## 💡 Pro Tips from Industry Experts
1. **[Tip 1]**: [Specific, actionable advice. E.g., "Focus on building projects, not just watching tutorials. Employers care about your GitHub, not your course certificates."]
2. **[Tip 2]**: [Practical wisdom from experience]
3. **[Tip 3]**: [Common pitfall to avoid]
4. **[Tip 4]**: [Success strategy]
[Include 4-5 expert tips]

REMEMBER: 
- Be specific, not generic
- Focus on 2024-2026 industry standards
- Provide actionable, measurable goals
- Include realistic timelines
- Emphasize practical, job-ready skills
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
      { status: 500 },
    );
  }
}
