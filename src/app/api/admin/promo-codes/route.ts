import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import PromoCode from "@/models/PromoCode";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

// GET - Fetch all promo codes
export async function GET() {
  try {
    await dbConnect();
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    if (decoded.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const promoCodes = await PromoCode.find({}).sort({ createdAt: -1 });

    return NextResponse.json({ promoCodes });
  } catch (error) {
    console.error("Fetch promo codes error:", error);
    return NextResponse.json(
      { error: "Failed to fetch promo codes" },
      { status: 500 }
    );
  }
}

// POST - Create new promo code
export async function POST(req: Request) {
  try {
    await dbConnect();
    const data = await req.json();
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    if (decoded.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Check if code already exists
    const existingCode = await PromoCode.findOne({
      code: data.code.toUpperCase(),
    });
    if (existingCode) {
      return NextResponse.json(
        { error: "Promo code already exists" },
        { status: 400 }
      );
    }

    const promoCode = await PromoCode.create({
      ...data,
      code: data.code.toUpperCase(),
    });

    return NextResponse.json({ promoCode }, { status: 201 });
  } catch (error) {
    console.error("Create promo code error:", error);
    return NextResponse.json(
      { error: "Failed to create promo code" },
      { status: 500 }
    );
  }
}
