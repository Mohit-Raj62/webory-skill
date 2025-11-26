import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import PromoCode from "@/models/PromoCode";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();
    const { code, itemType, itemId } = body;

    if (!code) {
      return NextResponse.json(
        { error: "Promo code is required" },
        { status: 400 }
      );
    }

    // Find promo code
    const promoCode = await PromoCode.findOne({ 
      code: code.toUpperCase(),
      isActive: true 
    });

    if (!promoCode) {
      return NextResponse.json(
        { error: "Invalid promo code" },
        { status: 404 }
      );
    }

    // Check if expired
    if (promoCode.expiresAt && new Date(promoCode.expiresAt) < new Date()) {
      return NextResponse.json(
        { error: "Promo code has expired" },
        { status: 400 }
      );
    }

    // Check usage limit
    if (promoCode.maxUses && promoCode.usedCount >= promoCode.maxUses) {
      return NextResponse.json(
        { error: "Promo code usage limit reached" },
        { status: 400 }
      );
    }

    // Check applicability
    if (itemType && promoCode.applicableTo !== 'both' && promoCode.applicableTo !== itemType) {
      return NextResponse.json(
        { error: `This promo code is only valid for ${promoCode.applicableTo}s` },
        { status: 400 }
      );
    }

    // Check if applicable to specific items
    if (itemId && promoCode.applicableIds.length > 0) {
      if (!promoCode.applicableIds.includes(itemId)) {
        return NextResponse.json(
          { error: "This promo code is not applicable to this item" },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      {
        valid: true,
        promoCode: {
          code: promoCode.code,
          discountType: promoCode.discountType,
          discountValue: promoCode.discountValue,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error validating promo code:", error);
    return NextResponse.json(
      { error: "Failed to validate promo code" },
      { status: 500 }
    );
  }
}
