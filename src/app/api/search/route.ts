import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Course from "@/models/Course";
import Internship from "@/models/Internship";
import Hackathon from "@/models/Hackathon";
import Blog from "@/models/Blog";

export const dynamic = "force-dynamic";

export interface SearchResultItem {
  id: string;
  title: string;
  description: string;
  type: "course" | "internship" | "hackathon" | "blog" | "tool" | "page";
  url: string;
  badge?: string;
  meta?: string;
  iconName?: string;
}

const STATIC_PLATFORM_ITEMS: SearchResultItem[] = [
  {
    id: "tool-playground",
    title: "DevLab - Code Playground & IDE",
    description: "Write, compile, and run code in multiple languages (Python, JS, C++, Java) in your browser.",
    type: "tool",
    url: "/playground",
    badge: "IDE",
    meta: "Developer Playground",
    iconName: "Code2",
  },
  {
    id: "tool-ai-weboryskills",
    title: "Weboryskills AI - Intelligent Assistant",
    description: "Ask technical questions, get instant debugging help, and learn concepts with your dedicated AI.",
    type: "tool",
    url: "/ai-weboryskills",
    badge: "AI Agent",
    meta: "AI Learning Assistant",
    iconName: "Bot",
  },
  {
    id: "tool-ai-prep",
    title: "AI Nexus - AI Mock Interview & Resume Prep",
    description: "Practice real-time technical & HR mock interviews with instant AI feedback and scoring.",
    type: "tool",
    url: "/ai-prep",
    badge: "Interview Prep",
    meta: "AI Career Prep",
    iconName: "BrainCircuit",
  },
  {
    id: "tool-agent-os",
    title: "Agent OS - Autonomous AI System",
    description: "Explore autonomous multi-agent developer workflows and AI systems.",
    type: "tool",
    url: "/agent-os",
    badge: "Next-Gen",
    meta: "AI Workspace",
    iconName: "Orbit",
  },
  {
    id: "page-courses",
    title: "Explore All Courses",
    description: "Browse all certified courses in Full Stack Web Development, Python, AI, and Software Engineering.",
    type: "page",
    url: "/courses",
    badge: "Curriculum",
    meta: "Course Catalog",
    iconName: "GraduationCap",
  },
  {
    id: "page-internships",
    title: "Browse Industry Internships",
    description: "Apply for verified internship programs with real-world projects, mentorship, and completion certificates.",
    type: "page",
    url: "/internships",
    badge: "Opportunities",
    meta: "Internship Programs",
    iconName: "Briefcase",
  },
  {
    id: "page-hackathons",
    title: "Webory Hackathons & Sprints",
    description: "Participate in coding challenges, hackathons, team building, and win cash prizes and recognition.",
    type: "page",
    url: "/hackathons",
    badge: "Competitions",
    meta: "Coding Challenges",
    iconName: "Trophy",
  },
  {
    id: "page-live-classes",
    title: "Live Classes & Interactive Sessions",
    description: "Join real-time classes, webinars, and live doubt resolution sessions with mentors.",
    type: "page",
    url: "/live-classes",
    badge: "Live",
    meta: "Interactive Learning",
    iconName: "Monitor",
  },
  {
    id: "page-mentorship",
    title: "1-on-1 Expert Mentorship",
    description: "Book personalized 1-on-1 sessions with industry engineers for career guidance and mock interviews.",
    type: "page",
    url: "/mentorship",
    badge: "Mentorship",
    meta: "Career Guidance",
    iconName: "Sparkles",
  },
  {
    id: "page-verify-certificate",
    title: "Verify Certificate & Credentials",
    description: "Authenticate course and internship completion certificates via Certificate ID or instant QR scanning.",
    type: "page",
    url: "/verify-certificate",
    badge: "Verification",
    meta: "Official Credential Check",
    iconName: "ShieldCheck",
  },
  {
    id: "page-ambassador",
    title: "Campus Ambassador Program",
    description: "Represent Webory at your college campus, lead tech events, and earn exclusive rewards and perks.",
    type: "page",
    url: "/ambassador",
    badge: "Leadership",
    meta: "Campus Community",
    iconName: "Users",
  },
  {
    id: "page-blogs",
    title: "Webory Blog & Tech Insights",
    description: "Read in-depth guides, developer roadmaps, tech trends, and career tutorials.",
    type: "page",
    url: "/blog",
    badge: "Articles",
    meta: "Knowledge Hub",
    iconName: "BookOpen",
  },
  {
    id: "page-about",
    title: "About Webory Skills",
    description: "Learn about our vision, leadership, mission to bridge academia and industry, and community.",
    type: "page",
    url: "/about",
    badge: "About",
    meta: "Company Overview",
    iconName: "Info",
  },
  {
    id: "page-contact",
    title: "Contact Us & Support",
    description: "Reach out to our support team for help with enrollments, certificates, or partnership inquiries.",
    type: "page",
    url: "/contact",
    badge: "Help",
    meta: "Get In Touch",
    iconName: "Mail",
  },
  {
    id: "page-careers",
    title: "Careers at Webory",
    description: "Join the Webory team and help build the future of online technical education.",
    type: "page",
    url: "/careers",
    badge: "Hiring",
    meta: "Work With Us",
    iconName: "Briefcase",
  },
  {
    id: "page-feedback",
    title: "Student Feedback Portal",
    description: "Provide suggestions, report issues, and tell us how we can improve your learning experience.",
    type: "page",
    url: "/feedback",
    badge: "Feedback",
    meta: "Share Experience",
    iconName: "MessageSquare",
  },
  {
    id: "page-terms",
    title: "Terms and Conditions",
    description: "Review Webory platform usage policies, user rights, terms, and community guidelines.",
    type: "page",
    url: "/terms",
    badge: "Legal",
    meta: "Legal Documentation",
    iconName: "FileText",
  },
  {
    id: "page-privacy",
    title: "Privacy Policy",
    description: "Learn how Webory protects your personal data, privacy, and account security.",
    type: "page",
    url: "/privacy",
    badge: "Legal",
    meta: "Data Protection",
    iconName: "FileText",
  },
  {
    id: "page-refund",
    title: "Refund & Cancellation Policy",
    description: "Read our transparent payment, refund, and fee policies.",
    type: "page",
    url: "/refund-policy",
    badge: "Legal",
    meta: "Refund Guidelines",
    iconName: "FileText",
  },
];

function escapeRegex(text: string): string {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const rawQuery = searchParams.get("q") || "";
    const typeFilter = searchParams.get("type"); // optional: 'course' | 'internship' | 'hackathon' | 'blog' | 'tool' | 'page'
    const limit = Math.min(parseInt(searchParams.get("limit") || "24", 10), 50);

    const query = rawQuery.trim();

    // Matching static pages & tools locally first
    let matchingStatic: SearchResultItem[] = [];
    if (query) {
      const qLower = query.toLowerCase();
      matchingStatic = STATIC_PLATFORM_ITEMS.filter((item) => {
        if (typeFilter && typeFilter !== "all" && item.type !== typeFilter) return false;
        return (
          item.title.toLowerCase().includes(qLower) ||
          item.description.toLowerCase().includes(qLower) ||
          item.meta?.toLowerCase().includes(qLower) ||
          item.badge?.toLowerCase().includes(qLower)
        );
      });
    } else if (!typeFilter || typeFilter === "all" || typeFilter === "tool" || typeFilter === "page") {
      matchingStatic = STATIC_PLATFORM_ITEMS.slice(0, 6);
    }

    // Connect DB
    await dbConnect();

    const results: SearchResultItem[] = [];

    if (!query) {
      // Return featured / top items if query is empty
      const [courses, internships, hackathons] = await Promise.all([
        Course.find({ isAvailable: { $ne: false } })
          .select("title slug description level price isFree duration icon isPopular")
          .sort({ isPopular: -1, createdAt: -1 })
          .limit(4)
          .lean(),
        Internship.find({ isActive: { $ne: false } })
          .select("title slug company location type stipend price isFree tags")
          .sort({ createdAt: -1 })
          .limit(4)
          .lean(),
        Hackathon.find({ isArchived: false, isHidden: { $ne: true } })
          .select("title slug theme status")
          .sort({ startDate: -1 })
          .limit(2)
          .lean(),
      ]);

      courses.forEach((c: any) => {
        results.push({
          id: c._id.toString(),
          title: c.title,
          description: c.description ? c.description.slice(0, 100) + "..." : "Master skills with Webory",
          type: "course",
          url: `/courses/${c.slug || c._id}`,
          badge: c.isFree ? "Free Course" : (c.price ? `₹${c.price}` : "Featured"),
          meta: `${c.level || "All Levels"} • ${c.duration || "Online"}`,
          iconName: "GraduationCap",
        });
      });

      internships.forEach((i: any) => {
        results.push({
          id: i._id.toString(),
          title: i.title,
          description: `${i.company || "Webory Partner"} • ${i.location || "Remote"}`,
          type: "internship",
          url: `/internships/${i.slug || i._id}`,
          badge: i.stipend || "Stipend",
          meta: `${i.type || "Internship"} Program`,
          iconName: "Briefcase",
        });
      });

      hackathons.forEach((h: any) => {
        results.push({
          id: h._id.toString(),
          title: h.title,
          description: h.theme || "Coding Challenge & Competition",
          type: "hackathon",
          url: `/hackathons/${h.slug || h._id}`,
          badge: h.status ? h.status.toUpperCase() : "Active",
          meta: "Hackathon",
          iconName: "Trophy",
        });
      });

      // Append top tools
      results.push(...matchingStatic);

      return NextResponse.json({
        success: true,
        query: "",
        results: results.slice(0, limit),
        counts: {
          total: results.length,
          courses: courses.length,
          internships: internships.length,
          hackathons: hackathons.length,
          blogs: 0,
          tools: matchingStatic.filter((s) => s.type === "tool").length,
          pages: matchingStatic.filter((s) => s.type === "page").length,
        },
      }, {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
        },
      });
    }

    // Query is present: build regex
    const regex = new RegExp(escapeRegex(query), "i");

    const promises: Promise<any>[] = [];

    // 1. Courses
    const shouldFetchCourses = !typeFilter || typeFilter === "all" || typeFilter === "course";
    if (shouldFetchCourses) {
      promises.push(
        Course.find({
          isAvailable: { $ne: false },
          $or: [
            { title: regex },
            { description: regex },
            { outcome: regex },
            { whoIsThisFor: regex },
            { level: regex },
          ],
        })
          .select("title slug description outcome level price isFree duration icon")
          .limit(8)
          .lean()
      );
    } else {
      promises.push(Promise.resolve([]));
    }

    // 2. Internships
    const shouldFetchInternships = !typeFilter || typeFilter === "all" || typeFilter === "internship";
    if (shouldFetchInternships) {
      promises.push(
        Internship.find({
          isActive: { $ne: false },
          $or: [
            { title: regex },
            { company: regex },
            { location: regex },
            { type: regex },
            { tags: regex },
            { tagline: regex },
            { description: regex },
          ],
        })
          .select("title slug company location type stipend tags price isFree tagline")
          .limit(8)
          .lean()
      );
    } else {
      promises.push(Promise.resolve([]));
    }

    // 3. Hackathons
    const shouldFetchHackathons = !typeFilter || typeFilter === "all" || typeFilter === "hackathon";
    if (shouldFetchHackathons) {
      promises.push(
        Hackathon.find({
          isArchived: false,
          isHidden: { $ne: true },
          $or: [
            { title: regex },
            { description: regex },
            { theme: regex },
            { domains: regex },
            { problemStatement: regex },
          ],
        })
          .select("title slug theme status")
          .limit(6)
          .lean()
      );
    } else {
      promises.push(Promise.resolve([]));
    }

    // 4. Blogs
    const shouldFetchBlogs = !typeFilter || typeFilter === "all" || typeFilter === "blog";
    if (shouldFetchBlogs) {
      promises.push(
        Blog.find({
          status: "published",
          $or: [
            { title: regex },
            { excerpt: regex },
            { category: regex },
            { tags: regex },
          ],
        })
          .select("title slug excerpt category coverImage publishedAt")
          .limit(6)
          .lean()
      );
    } else {
      promises.push(Promise.resolve([]));
    }

    const [matchedCourses, matchedInternships, matchedHackathons, matchedBlogs] = await Promise.all(promises);

    // Format Course Results
    const formattedCourses: SearchResultItem[] = matchedCourses.map((c: any) => ({
      id: c._id.toString(),
      title: c.title,
      description: c.outcome || (c.description ? c.description.slice(0, 110) + "..." : "Learn industry skills"),
      type: "course",
      url: `/courses/${c.slug || c._id}`,
      badge: c.isFree ? "Free Course" : (c.price ? `₹${c.price}` : "Course"),
      meta: `${c.level || "All Levels"} • ${c.duration || "Self-Paced"}`,
      iconName: "GraduationCap",
    }));

    // Format Internship Results
    const formattedInternships: SearchResultItem[] = matchedInternships.map((i: any) => ({
      id: i._id.toString(),
      title: i.title,
      description: `${i.company || "Webory Partner"} • ${i.location || "Remote"} • ${i.tagline || (i.tags ? i.tags.slice(0, 3).join(", ") : "Internship")}`,
      type: "internship",
      url: `/internships/${i.slug || i._id}`,
      badge: i.stipend || "Stipend",
      meta: `${i.type || "Internship"} • Live Projects`,
      iconName: "Briefcase",
    }));

    // Format Hackathon Results
    const formattedHackathons: SearchResultItem[] = matchedHackathons.map((h: any) => ({
      id: h._id.toString(),
      title: h.title,
      description: h.theme || "Build projects, team up & win exciting prizes",
      type: "hackathon",
      url: `/hackathons/${h.slug || h._id}`,
      badge: h.status ? h.status.toUpperCase() : "Hackathon",
      meta: "Webory Coding Challenge",
      iconName: "Trophy",
    }));

    // Format Blog Results
    const formattedBlogs: SearchResultItem[] = matchedBlogs.map((b: any) => ({
      id: b._id.toString(),
      title: b.title,
      description: b.excerpt ? b.excerpt.slice(0, 110) + "..." : "Read technical article",
      type: "blog",
      url: `/blog/${b.slug || b._id}`,
      badge: b.category || "Blog",
      meta: "Tech Insights & Guides",
      iconName: "BookOpen",
    }));

    // Combine all results with static items prioritized if exact match
    const allCombined = [
      ...matchingStatic,
      ...formattedCourses,
      ...formattedInternships,
      ...formattedHackathons,
      ...formattedBlogs,
    ];

    return NextResponse.json({
      success: true,
      query,
      results: allCombined.slice(0, limit),
      counts: {
        total: allCombined.length,
        courses: formattedCourses.length,
        internships: formattedInternships.length,
        hackathons: formattedHackathons.length,
        blogs: formattedBlogs.length,
        tools: matchingStatic.filter((s) => s.type === "tool").length,
        pages: matchingStatic.filter((s) => s.type === "page").length,
      },
    }, {
      headers: {
        "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
      },
    });
  } catch (error: any) {
    console.error("SEARCH_API_ERROR:", error);
    return NextResponse.json(
      { success: false, error: "Failed to search", message: error?.message },
      { status: 500 }
    );
  }
}
