import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import PromoCode from "@/models/PromoCode";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const promoCodes = await PromoCode.find({}).sort({ createdAt: -1 });

    return NextResponse.json({ promoCodes }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching promo codes:", error);
    return NextResponse.json(
      { error: "Failed to fetch promo codes" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();
    const {
      code,
      discountType,
      discountValue,
      applicableTo,
      applicableIds,
      maxUses,
      expiresAt,
    } = body;

    // Validation
    if (!code || !discountType || discountValue === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if code already exists
    const existingCode = await PromoCode.findOne({ code: code.toUpperCase() });
    if (existingCode) {
      return NextResponse.json(
        { error: "Promo code already exists" },
        { status: 400 }
      );
    }

    // Validate discount value
    if (discountType === 'percentage' && (discountValue < 0 || discountValue > 100)) {
      return NextResponse.json(
        { error: "Percentage discount must be between 0 and 100" },
        { status: 400 }
      );
    }

    if (discountType === 'fixed' && discountValue < 0) {
      return NextResponse.json(
        { error: "Fixed discount must be positive" },
        { status: 400 }
      );
    }

    const promoCode = await PromoCode.create({
      code: code.toUpperCase(),
      discountType,
      discountValue,
      applicableTo: applicableTo || 'both',
      applicableIds: applicableIds || [],
      maxUses: maxUses || null,
      expiresAt: expiresAt || null,
      isActive: true,
    });

    return NextResponse.json(
      { message: "Promo code created successfully", promoCode },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating promo code:", error);
    return NextResponse.json(
      { error: "Failed to create promo code" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Promo code ID required" },
        { status: 400 }
      );
    }

    await PromoCode.findByIdAndDelete(id);

    return NextResponse.json(
      { message: "Promo code deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error deleting promo code:", error);
    return NextResponse.json(
      { error: "Failed to delete promo code" },
      { status: 500 }
    );
  }
}
