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

const GROQ_MODELS = [
  process.env.GROQ_MODEL,
  "openai/gpt-oss-120b",
  "openai/gpt-oss-20b",
  "llama-3.3-70b-versatile",
  "llama-3.1-8b-instant",
  "qwen/qwen3.8-27b",
].filter(Boolean) as string[];

async function getGroqCompletion(messages: any[], maxTokens = 4096) {
  let lastError: any = null;
  for (const model of GROQ_MODELS) {
    try {
      const completion = await groq.chat.completions.create({
        messages,
        model,
        temperature: 0.7,
        max_tokens: maxTokens,
      });
      return completion;
    } catch (error: any) {
      console.warn(`Groq model ${model} failed:`, error.message);
      lastError = error;
    }
  }
  throw lastError || new Error("All Groq models failed");
}

function cleanDuration(duration: string): string {
  let d = duration.trim().replace(/^estimated:\s*/i, '').replace(/\*+/g, '');
  // Clean expressions like "week 4 - 6 week" -> "4-6 Weeks"
  d = d.replace(/^weeks?\s*(\d+)\s*[-–—]\s*(\d+)\s*weeks?/i, (_m, a, b) => `${a}-${b} Weeks`);
  d = d.replace(/^weeks?\s*(\d+)\s*[-–—]\s*(\d+)$/i, (_m, a, b) => `${a}-${b} Weeks`);
  d = d.replace(/^(\d+)\s*[-–—]\s*(\d+)\s*weeks?/i, (_m, a, b) => `${a}-${b} Weeks`);
  d = d.replace(/^weeks?\s*(\d+)\s*weeks?$/i, (_m, a) => `${a} Weeks`);
  if (/^\d+\s*[-–—]\s*\d+$/.test(d)) {
    d = d.replace(/\s+/g, '') + ' Weeks';
  }
  d = d.replace(/\bweeks?\b/gi, 'Weeks');
  d = d.replace(/\bWeeks\s+Weeks\b/gi, 'Weeks');
  return d;
}

function normalizeRoadmapMarkdown(text: string): string {
  let normalized = text;
  
  // Normalize Phase headers (e.g., Estimated: **4 weeks** -> Estimated: 4 Weeks)
  normalized = normalized.replace(
    /### Phase (\d+): (.*?)\s*\(Estimated:\s*\*?([^*()\n]+)\*?\)/gi,
    (_m, pNum, title, dur) => `### Phase ${pNum}: ${title} (Estimated: ${cleanDuration(dur)})`
  );
  
  // Normalize Topics to Learn header (e.g. #### Topics to Learn -> **Topics to Learn:**)
  normalized = normalized.replace(/#{2,4}\s*Topics to Learn:?/gi, '**Topics to Learn:**');
  
  // Normalize Practice Projects header
  normalized = normalized.replace(/#{2,4}\s*Practice Projects:?/gi, '**Practice Projects:**');
  
  // Normalize Resources header
  normalized = normalized.replace(/#{2,4}\s*Resources:?/gi, '**Resources:**');
  
  // Normalize bullet items: - **Topic** – desc or - **Topic** - desc -> - **Topic**: desc
  normalized = normalized.replace(/^-\s*\*\*([^*]+)\*\*\s*[–—\-:]\s*/gm, '- **$1**: ');
  
  // Normalize project items: 1. **Project** – desc -> 1. **Project**: desc
  normalized = normalized.replace(/^(\d+\.)\s*\*\*([^*]+)\*\*\s*[–—\-:]\s*/gm, '$1 **$2**: ');
  
  return normalized;
}

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

      const completion = await getGroqCompletion(messages, 2048);

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
    
TASK: Create an extremely comprehensive, exhaustive, step-by-step mastery roadmap for: "${topic}" at the ${level} level. Cover every micro-concept, tool, debugging skill, best practice, and nuance from beginner to industry-lead level across 5 to 6 dedicated phases (Do NOT compress into only 3 phases). Every phase must include 6 to 10 granular topics covering every single detail.

${levelInstruction}

CRITICAL ACCURACY REQUIREMENTS:
1. **Industry-Relevant**: Only include technologies and practices that are CURRENTLY used in the industry (2024-2026). Avoid outdated tools.
2. **Practical Focus**: Every topic should have a clear real-world application. Explain "Why this matters in production."
3. **Realistic Timeline**: Provide honest, progressive time estimates (e.g., "1-3 Weeks", "4-6 Weeks").
4. **Modern Stack**: Recommend current industry-standard tools, frameworks, and best practices.
5. **Job-Ready Skills**: Focus on what employers actually look for in job descriptions.
6. **Exhaustive Detail**: Do NOT skip basic or intermediate details. Cover environment setup, syntax nuances, every essential hook/method, debugging, testing, and production deployment.

STRICT FORMATTING RULES:
1. You MUST explicitly use the markdown headers exactly as shown below (e.g., "## 📚 Overview", "### Phase 1:", "**Topics to Learn:**", "**Practice Projects:**").
2. The frontend parser depends on these exact strings. Do not change them.
3. Do NOT use markdown tables anywhere in the response. Use bulleted lists instead.
4. For every topic, you MUST use the format: "- **Topic Name**: Description" (Always a colon ':' after the bold name. NEVER use dashes, en-dashes, or em-dashes).
5. For every project, you MUST use the format: "1. **Project Name**: Spec".
6. In phase headers, write progressive timeframes: Phase 1: "(Estimated: 1-3 Weeks)", Phase 2: "(Estimated: 4-6 Weeks)", Phase 3: "(Estimated: 7-9 Weeks)", Phase 4: "(Estimated: 10-12 Weeks)", Phase 5: "(Estimated: 13-15 Weeks)", Phase 6: "(Estimated: 16-18 Weeks)". Never duplicate the word "week".
7. Do not use JSON. Use the Markdown format below.

CONTENT GUIDELINES:
- **Depth**: Do not just list topics. Explain them with context.
- **Topics**: For every topic, provide a 2-3 sentence explanation covering: (1) What it is, (2) Why it's critical in production, (3) Real-world use case.
- **Projects**: Suggest portfolio-worthy projects that demonstrate job-ready skills. Include specific features and technologies to use.
- **Resources**: Recommend specific, high-quality, free resources (official docs, YouTube channels, practice platforms).
- **Step-by-Step**: Ensure a logical, dependency-aware progression.

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

### Phase 1: Environment Setup, Foundations & Core Syntax (Estimated: 1-3 Weeks)
**Goal:** [Mastering environment setup, foundational syntax, and mental models from absolute scratch]

**Topics to Learn:**
- **[Topic Name]**: [Deep explanation: what it is, syntax/usage, and real-world necessity]
- **[Topic Name]**: [Deep explanation]
- **[Topic Name]**: [Deep explanation]
- **[Topic Name]**: [Deep explanation]
- **[Topic Name]**: [Deep explanation]
- **[Topic Name]**: [Deep explanation]
- **[Topic Name]**: [Deep explanation]
[Include 7-10 foundational topics covering every initial detail]

**Practice Projects:**
1. **[Project Name]**: [Detailed spec with specific features]
2. **[Project Name]**: [Detailed portfolio-worthy project spec]

**Resources:**
- Official Documentation: [Specific link or search term]
- Video Tutorial: [Specific YouTube channel or course name]
- Practice Platform: [Interactive platform]


### Phase 2: Component Architecture, Deep Hooks & State Patterns (Estimated: 4-6 Weeks)
**Goal:** [Deep mastery of all core hooks, component lifecycles, and state management mechanics]

**Topics to Learn:**
- **[Topic Name]**: [Deep explanation covering hook mechanics, pitfall avoidance, and production use]
- **[Topic Name]**: [Deep explanation]
- **[Topic Name]**: [Deep explanation]
- **[Topic Name]**: [Deep explanation]
- **[Topic Name]**: [Deep explanation]
- **[Topic Name]**: [Deep explanation]
- **[Topic Name]**: [Deep explanation]
[Include 7-10 topics covering every hook and pattern in detail]

**Practice Projects:**
1. **[Project Name]**: [Interactive, state-driven real-world application spec]
2. **[Project Name]**: [Production-grade project spec]

**Resources:**
- [Specific resource 1]
- [Specific resource 2]


### Phase 3: Ecosystem, Routing, Data Fetching & Form Architecture (Estimated: 7-9 Weeks)
**Goal:** [Mastering client-side routing, server state, API integration, and robust forms]

**Topics to Learn:**
- **[Topic Name]**: [Explanation with industry context]
- **[Topic Name]**: [Explanation with industry context]
- **[Topic Name]**: [Explanation with industry context]
- **[Topic Name]**: [Explanation with industry context]
- **[Topic Name]**: [Explanation with industry context]
- **[Topic Name]**: [Explanation with industry context]
- **[Topic Name]**: [Explanation with industry context]
[Include 7-10 topics covering routing, caching, validation, UI libraries]

**Practice Projects:**
1. **[Project Name]**: [Multi-page API-driven application spec]
2. **[Project Name]**: [Complex dashboard application spec]

**Resources:**
- [Specific resource 1]
- [Specific resource 2]


### Phase 4: Enterprise State Management & Scalable Architecture (Estimated: 10-12 Weeks)
**Goal:** [Mastering large-scale state tools, modular architectures, and clean code principles]

**Topics to Learn:**
- **[Topic Name]**: [Advanced state tool deep dive (RTK, Zustand, Context)]
- **[Topic Name]**: [Architecture & folder structure pattern]
- **[Topic Name]**: [Advanced pattern explanation]
- **[Topic Name]**: [Advanced pattern explanation]
- **[Topic Name]**: [Advanced pattern explanation]
- **[Topic Name]**: [Advanced pattern explanation]
[Include 6-8 architectural topics]

**Practice Projects:**
1. **[Project Name]**: [Enterprise SaaS application spec]
2. **[Project Name]**: [Production-grade project spec]

**Resources:**
- [Specific resource 1]
- [Specific resource 2]


### Phase 5: Testing, Performance Optimization & Security (Estimated: 13-15 Weeks)
**Goal:** [Writing rock-solid tests, profiling & optimizing Web Vitals, and securing applications]

**Topics to Learn:**
- **[Topic Name]**: [Unit & Integration testing (Vitest / RTL / Jest)]
- **[Topic Name]**: [E2E Testing (Playwright / Cypress)]
- **[Topic Name]**: [Memoization & Profiler deep-dive]
- **[Topic Name]**: [Core Web Vitals & Bundle optimization]
- **[Topic Name]**: [Security practices & XSS / CSRF prevention]
- **[Topic Name]**: [Error handling & Sentry / monitoring]
[Include 6-8 production-quality topics]

**Practice Projects:**
1. **[Project Name]**: [Test-driven, fully optimized application spec]
2. **[Project Name]**: [Security-hardened application spec]

**Resources:**
- [Testing documentation]
- [Performance profiling guide]


### Phase 6: Full-Stack Integration, Modern Frameworks, CI/CD & Career Prep (Estimated: 16-18 Weeks)
**Goal:** [Mastering Next.js/Full-Stack, CI/CD pipelines, system design, and landing senior offers]

**Topics to Learn:**
- **[Topic Name]**: [Full-stack framework concepts (SSR, SSG, Server Components)]
- **[Topic Name]**: [CI/CD automation with GitHub Actions]
- **[Topic Name]**: [Containerization (Docker) & Cloud Deployment (Vercel/AWS)]
- **[Topic Name]**: [Frontend System Design principles]
- **[Topic Name]**: [Technical Interview questions & Coding rounds]
- **[Topic Name]**: [Portfolio crafting, Open Source contributions & Resume strategy]
[Include 6-8 career-ready topics]

**Practice Projects:**
1. **[Project Name]**: [Full-stack capstone deployed to production]
2. **[Project Name]**: [Open source or developer tool project]

**Resources:**
- [Specific career resource 1]
- [Specific career resource 2]

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
1. **[Tip 1]**: [Specific, actionable advice]
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

    const completion = await getGroqCompletion(
      [
        {
          role: "user",
          content: prompt,
        },
      ],
      8192,
    );

    const rawRoadmap =
      completion.choices[0]?.message?.content || "Failed to generate roadmap";
    const roadmap = normalizeRoadmapMarkdown(rawRoadmap);

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
