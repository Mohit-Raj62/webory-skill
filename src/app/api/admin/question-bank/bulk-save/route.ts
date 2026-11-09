import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import QuestionBank from "@/models/QuestionBank";
import { requireAdmin } from "@/lib/exam-auth";

async function ensureSafeTextIndex() {
  try {
    const indexes = await QuestionBank.collection.indexes();
    const textIdx = indexes.find(
      (idx: any) => idx.textIndexVersion !== undefined || idx.weights !== undefined
    );
    // If a text index exists with default language_override (not 'none'), drop and recreate
    if (textIdx && textIdx.language_override !== "none") {
      console.log("Rebuilding text index with language_override: 'none'");
      await QuestionBank.collection.dropIndex(textIdx.name);
      await QuestionBank.collection.createIndex(
        { questionText: "text", topic: "text", tags: "text" },
        { default_language: "english", language_override: "none" }
      );
    }
  } catch (err) {
    console.warn("Index check note:", err);
  }
}

export async function POST(req: Request) {
  try {
    const auth = await requireAdmin();
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    await dbConnect();
    await ensureSafeTextIndex();

    const { questions } = await req.json();

    if (!Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json(
        { error: "No questions provided" },
        { status: 400 }
      );
    }

    const docs = questions.map((q) => ({
      ...q,
      createdBy: auth.user._id,
      isApproved: true,
      source: q.source || "ai",
    }));

    let inserted;
    try {
      inserted = await QuestionBank.insertMany(docs);
    } catch (insertError: any) {
      // Check for code 17262 or language override unsupported
      if (
        insertError?.code === 17262 ||
        String(insertError?.message).includes("language override unsupported")
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
        inserted = await QuestionBank.insertMany(docs);
      } else {
        throw insertError;
      }
    }

    return NextResponse.json({
      success: true,
      count: inserted.length,
      questions: inserted,
      message: `Successfully saved ${inserted.length} questions to the Question Bank`,
    });
  } catch (error: any) {
    console.error("Bulk save error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to bulk save questions" },
      { status: 500 }
    );
  }
}

