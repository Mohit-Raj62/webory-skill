import dbConnect from "./db";
import Course from "@/models/Course";
import Internship from "@/models/Internship";
import User from "@/models/User";
import Enrollment from "@/models/Enrollment";

/**
 * Get available courses with key information
 */
export async function getCoursesContext() {
  await dbConnect();
  const courses = await Course.find({ isAvailable: true })
    .select("title description price level duration benefits")
    .limit(20)
    .lean();

  return courses.map((course) => ({
    title: course.title,
    description: course.description,
    price: course.price,
    level: course.level,
    duration: course.duration,
    benefits: course.benefits?.slice(0, 3), // Top 3 benefits
  }));
}

/**
 * Get available internships with key information
 */
export async function getInternshipsContext() {
  await dbConnect();
  const internships = await Internship.find()
    .select("title company location type stipend description requirements")
    .limit(20)
    .lean();

  return internships.map((internship) => ({
    title: internship.title,
    company: internship.company,
    location: internship.location,
    type: internship.type,
    stipend: internship.stipend,
    description: internship.description,
    requirements: internship.requirements?.slice(0, 3), // Top 3 requirements
  }));
}

/**
 * Get user-specific context including enrollments and progress
 */
export async function getUserContext(userId: string) {
  await dbConnect();
  const user = await User.findById(userId)
    .select("firstName lastName email role xp streak skills")
    .lean();

  if (!user) return null;

  // Get user's enrollments
  const enrollments = await Enrollment.find({ student: userId })
    .populate("course", "title")
    .select("course progress status")
    .lean();

  return {
    name: `${user.firstName} ${user.lastName}`,
    email: user.email,
    role: user.role,
    xp: user.xp || 0,
    streak: user.streak?.count || 0,
    skills: user.skills || [],
    enrollments: enrollments.map((e: any) => ({
      course: e.course?.title,
      progress: e.progress || 0,
      status: e.status,
    })),
  };
}

/**
 * Platform FAQs and common questions
 */
export function getPlatformFAQs() {
  return [
    {
      question: "How do I enroll in a course?",
      answer:
        "Browse courses, click on a course you like, and click the 'Enroll Now' button. You can pay online or upload payment proof.",
    },
    {
      question: "How do I get a certificate?",
      answer:
        "Complete all course modules and quizzes. Once eligible, go to your profile dashboard and click 'Download Certificate'.",
    },
    {
      question: "What is AI Practice?",
      answer:
        "AI Practice is our interactive feature where you can practice coding, take mock interviews, and solve aptitude questions with AI-powered feedback.",
    },
    {
      question: "How does XP and streak work?",
      answer:
        "Earn XP by completing quizzes and practice sessions. Maintain your streak by practicing daily to get bonus XP!",
    },
    {
      question: "Can I get a refund?",
      answer:
        "Please contact our support team at the email provided. Refund policies depend on your enrollment status and course progress.",
    },
    {
      question: "How do I access course videos?",
      answer:
        "After enrolling, go to 'My Courses' in your dashboard. Click on the course and you'll see all modules and videos.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept online payments via UPI, cards, and net banking. You can also upload payment proof for manual verification.",
    },
    {
      question: "How do I update my profile?",
      answer:
        "Go to your Profile page, click 'Edit Profile', and update your information including skills, projects, and experience.",
    },
  ];
}

/**
 * Platform features information
 */
export function getPlatformFeatures() {
  return {
    courses:
      "Learn from industry-expert courses with video lectures, PDFs, and quizzes",
    internships:
      "Apply for internship opportunities and gain real-world experience",
    aiPractice:
      "Practice coding, mock interviews, and aptitude tests with AI feedback",
    certificates: "Earn verified certificates upon course completion",
    liveClasses: "Attend live classes and interact with instructors",
    mentorship: "Get one-on-one mentorship from industry professionals",
    codePlayground: "Write and execute code in multiple programming languages",
    careerSupport:
      "Access career guidance, resume building, and job opportunities",
  };
}

/**
 * Build comprehensive system prompt for AI chatbot
 */
export async function buildSystemPrompt(userId?: string, currentPage?: string) {
  const courses = await getCoursesContext();
  const internships = await getInternshipsContext();
  const faqs = getPlatformFAQs();
  const features = getPlatformFeatures();

  let userContext = null;
  if (userId) {
    userContext = await getUserContext(userId);
  }

  const systemPrompt = `You are "Nexus", a smart and expert coding companion for Webory Skills. Your goal is to help students learn effectively, solve coding problems, and navigate the platform.

PLATFORM FEATURES:
${Object.entries(features)
  .map(([key, value]) => `- ${key}: ${value}`)
  .join("\n")}

AVAILABLE COURSES (${courses.length} total):
${courses
  .slice(0, 5)
  .map(
    (c) =>
      `- ${c.title} (${c.level}, ₹${c.price}, ${c.duration}): ${c.description?.substring(0, 100)}...`,
  )
  .join("\n")}
${courses.length > 5 ? `... and ${courses.length - 5} more courses` : ""}

INTERNSHIP OPPORTUNITIES (${internships.length} total):
${internships
  .slice(0, 5)
  .map(
    (i) =>
      `- ${i.title} at ${i.company} (${i.location}, ${i.type}, Stipend: ${i.stipend})`,
  )
  .join("\n")}
${internships.length > 5 ? `... and ${internships.length - 5} more internships` : ""}

COMMON FAQs:
${faqs.map((faq) => `Q: ${faq.question}\nA: ${faq.answer}`).join("\n\n")}

${
  userContext
    ? `
CURRENT USER INFORMATION:
- Name: ${userContext.name}
- Role: ${userContext.role}
- XP: ${userContext.xp}
- Streak: ${userContext.streak} days
- Skills: ${userContext.skills.join(", ") || "Not specified"}
- Enrolled Courses: ${userContext.enrollments.length > 0 ? userContext.enrollments.map((e: any) => `${e.course} (${e.progress}% complete)`).join(", ") : "None yet"}
`
    : ""
}

${currentPage ? `Current Page: ${currentPage}` : ""}

INSTRUCTIONS:
1. Be friendly, helpful, and professional in Hindi/Hinglish or English based on user's language
2. Provide accurate information about courses, internships, and platform features
3. If user asks about their progress or enrollments, use the user information provided
4. For technical issues, provide step-by-step troubleshooting
5. If you don't know something, be honest and suggest contacting support
6. Keep responses concise but informative (2-4 sentences usually)
7. Use emojis occasionally to be friendly 😊
8. If user asks about specific courses, provide details from the course list
9. Guide users to relevant pages when needed (e.g., "Go to My Courses dashboard")
10. For payment/refund issues, advise contacting support team

RESPONSE FORMAT:
You must respond with ONLY a valid JSON object. Do not include any conversational text outside the JSON object.
{
  "message": "Your helpful response here (this is where you talk to the user)",
  "suggestedActions": ["Optional action 1", "Optional action 2"],
  "links": [{"text": "Link text", "url": "/path"}]
}

IMPORTANT: Do not return any Markdown formatting. Just raw JSON.

Remember: You're here to make the user's experience better and help them succeed in their learning journey! 🚀`;

  return systemPrompt;
}
