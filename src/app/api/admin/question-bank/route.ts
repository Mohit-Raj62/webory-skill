import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import QuestionBank from "@/models/QuestionBank";
import { requireAdmin } from "@/lib/exam-auth";

export async function GET(req: Request) {
  try {
    const auth = await requireAdmin();
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    await dbConnect();
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const subject = searchParams.get("subject") || "";
    const difficulty = searchParams.get("difficulty") || "";
    const questionType = searchParams.get("questionType") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "50", 10);

    const query: any = {};
    if (subject && subject !== "all") {
      query.subject = { $regex: new RegExp(subject, "i") };
    }
    if (difficulty && difficulty !== "all") {
      query.difficulty = difficulty;
    }
    if (questionType && questionType !== "all") {
      query.questionType = questionType;
    }
    if (search.trim()) {
      query.$or = [
        { questionText: { $regex: search.trim(), $options: "i" } },
        { topic: { $regex: search.trim(), $options: "i" } },
        { subject: { $regex: search.trim(), $options: "i" } },
        { tags: { $in: [new RegExp(search.trim(), "i")] } },
      ];
    }

    const total = await QuestionBank.countDocuments(query);
    const questions = await QuestionBank.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    // Distinct subjects and topics for filtering
    const subjects = await QuestionBank.distinct("subject");

    return NextResponse.json({
      success: true,
      questions,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      subjects: subjects.filter(Boolean),
    });
  } catch (error: any) {
    console.error("QuestionBank GET error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to fetch question bank" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const auth = await requireAdmin();
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    await dbConnect();
    const body = await req.json();

    if (!body.questionText || body.correctAnswer === undefined) {
      return NextResponse.json(
        { error: "questionText and correctAnswer are required" },
        { status: 400 }
      );
    }

    let question;
    try {
      question = await QuestionBank.create({
        ...body,
        createdBy: auth.user._id,
        source: body.source || "manual",
        isApproved: true,
      });
    } catch (saveErr: any) {
      if (
        saveErr?.code === 17262 ||
        String(saveErr?.message).includes("language override unsupported")
      ) {
        console.warn("Detected MongoDB language override error, dropping text index and retrying...");
        const indexes = await QuestionBank.collection.indexes();
        for (const idx of indexes) {
          if (idx.textIndexVersion !== undefined || idx.weights !== undefined) {
            await QuestionBank.collection.dropIndex(idx.name);
          }
        }
        await QuestionBank.collection.createIndex(
          { questionText: "text", topic: "text", tags: "text" },
          { default_language: "english", language_override: "none" }
        );
        question = await QuestionBank.create({
          ...body,
          createdBy: auth.user._id,
          source: body.source || "manual",
          isApproved: true,
        });
      } else {
        throw saveErr;
      }
    }

    return NextResponse.json(
      { success: true, question, message: "Question created successfully" },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("QuestionBank POST error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to save question" },
      { status: 500 }
    );
  }
}

