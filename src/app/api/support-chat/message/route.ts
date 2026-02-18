import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/db";
import ChatMessage from "@/models/ChatMessage";
import { buildSystemPrompt } from "@/lib/chatbot-context";
import { nanoid } from "nanoid";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || "",
});

export async function POST(req: Request) {
  try {
    // Validate GROQ API key
    if (!process.env.GROQ_API_KEY) {
      console.error("GROQ_API_KEY is not set in environment variables");
      return NextResponse.json(
        { error: "AI service not configured. Please contact support." },
        { status: 500 },
      );
    }

    await dbConnect();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    let userId = null;
    let userRole = "guest";

    // Check if user is authenticated (optional for chatbot)
    if (token) {
      try {
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
        userId = decoded.userId;
        userRole = decoded.role || "student";
      } catch (error) {
        // Token invalid, continue as guest
        console.log("Invalid token, continuing as guest");
      }
    }

    const { message, sessionId, currentPage, deviceType } = await req.json();

    if (!message || !message.trim()) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 },
      );
    }

    // Generate or use existing session ID
    const chatSessionId = sessionId || nanoid();

    // Find or create chat session
    let chatSession = await ChatMessage.findOne({
      sessionId: chatSessionId,
    });

    if (!chatSession) {
      const sessionData: any = {
        sessionId: chatSessionId,
        messages: [],
        context: {
          currentPage: currentPage || "unknown",
          userRole: userRole,
          deviceType: deviceType || "desktop",
          timestamp: new Date(),
        },
      };

      // Only add userId if it exists to avoid validation issues
      if (userId) {
        sessionData.userId = userId;
      }

      chatSession = new ChatMessage(sessionData);
    }

    // Add user message to history
    chatSession.messages.push({
      role: "user",
      content: message,
      timestamp: new Date(),
    });

    // Build conversation history for AI
    const conversationHistory = chatSession.messages.map((msg: any) => ({
      role: msg.role,
      content: msg.content,
    }));

    // Build system prompt with context
    const systemPrompt = await buildSystemPrompt(userId, currentPage);

    // Get AI response using Groq
    const completion = await getGroqCompletion(
      systemPrompt,
      conversationHistory,
    );

    let aiResponse;
    try {
      // First try to parse the entire response as JSON
      aiResponse = JSON.parse(completion);
    } catch (parseError) {
      // If that fails, try to extract JSON object from the text
      // Matches content between the first { and the last }
      const jsonMatch = completion.match(/\{[\s\S]*\}/);

      if (jsonMatch) {
        try {
          aiResponse = JSON.parse(jsonMatch[0]);
        } catch (innerError) {
          // If regex match is not valid JSON
          console.warn("Failed to parse extracted JSON:", innerError);
        }
      }

      // If all parsing fails, treat the whole response as a text message
      if (!aiResponse) {
        aiResponse = {
          message: completion,
          suggestedActions: [],
          links: [],
        };
      }
    }

    // Add AI response to history
    chatSession.messages.push({
      role: "assistant",
      content: JSON.stringify(aiResponse),
      timestamp: new Date(),
    });

    // Save chat session
    await chatSession.save();

    return NextResponse.json({
      sessionId: chatSessionId,
      response: aiResponse,
      success: true,
    });
  } catch (error: any) {
    console.error("=== Support Chat Error ===");
    console.error("Error message:", error.message);
    console.error("Error name:", error.name);
    console.error("Error stack:", error.stack);
    if (error.errors) {
      console.error("Validation errors:", error.errors);
    }

    return NextResponse.json(
      {
        error: "Failed to process message",
        details: error.message,
        errorName: error.name,
      },
      { status: 500 },
    );
  }
}

/**
 * Get completion from Groq with fallback models
 */
async function getGroqCompletion(
  systemPrompt: string,
  conversationHistory: any[],
) {
  const models = ["llama-3.3-70b-versatile", "llama-3.1-8b-instant"];

  for (const model of models) {
    try {
      const messages = [
        { role: "system", content: systemPrompt },
        ...conversationHistory,
      ];

      const completion = await groq.chat.completions.create({
        messages: messages as any,
        model: model,
        temperature: 0.7,
        max_tokens: 1024,
      });

      return (
        completion.choices[0].message.content ||
        "Sorry, I couldn't generate a response."
      );
    } catch (error: any) {
      console.warn(`Model ${model} failed:`, error.message);

      // Retry with next model on rate limit or service issues
      if (
        (error.status === 429 ||
          error.status === 503 ||
          error.code === "rate_limit_exceeded") &&
        model !== models[models.length - 1]
      ) {
        continue;
      }

      // If it's the last model, throw the error
      if (model === models[models.length - 1]) {
        throw error;
      }
    }
  }

  throw new Error("All models failed");
}
