import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Enrollment from "@/models/Enrollment";
import User from "@/models/User";
import Course from "@/models/Course";
import PromoCode from "@/models/PromoCode";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { sendEmail, emailTemplates } from "@/lib/mail";
import { calculateDiscountedPrice, applyPromoDiscount } from "@/lib/pricing-utils";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    const { courseId, transactionId, promoCode } = await req.json();

    if (!courseId) {
      return NextResponse.json({ error: "Course ID required" }, { status: 400 });
    }

    // Check if already enrolled
    const existing = await Enrollment.findOne({
      student: decoded.userId,
      course: courseId,
    });

    if (existing) {
      return NextResponse.json({ message: "Already enrolled" }, { status: 200 });
    }

    // Get course details
    const course = await Course.findById(courseId);
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Calculate final price
    let finalPrice = course.price || 0;
    let appliedPromoCode = null;
    
    // Apply course discount if exists
    if (course.discountPercentage > 0 && course.originalPrice > 0) {
      finalPrice = calculateDiscountedPrice(course.originalPrice, course.discountPercentage);
    }

    // Apply promo code if provided
    if (promoCode) {
      const promo = await PromoCode.findOne({ 
        code: promoCode.toUpperCase(),
        isActive: true 
      });

      if (promo) {
        // Validate promo code
        const isExpired = promo.expiresAt && new Date(promo.expiresAt) < new Date();
        const isMaxedOut = promo.maxUses && promo.usedCount >= promo.maxUses;
        const isApplicable = promo.applicableTo === 'both' || promo.applicableTo === 'course';
        const isApplicableToThisCourse = promo.applicableIds.length === 0 || 
                                          promo.applicableIds.includes(courseId);

        if (!isExpired && !isMaxedOut && isApplicable && isApplicableToThisCourse) {
          finalPrice = applyPromoDiscount(finalPrice, {
            discountType: promo.discountType,
            discountValue: promo.discountValue,
          });
          
          // Increment usage count
          promo.usedCount += 1;
          await promo.save();
          
          appliedPromoCode = promo.code;
        }
      }
    }

    const enrollment = await Enrollment.create({
      student: decoded.userId,
      course: courseId,
      // In a real app, we would save the transactionId here
    });

    // Send enrollment confirmation email
    try {
      const user = await User.findById(decoded.userId);
      
      if (user && course) {
        const courseLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/courses/${courseId}`;
        
        // Send enrollment confirmation
        await sendEmail(
          user.email,
          `Enrolled in ${course.title}! 📚`,
          emailTemplates.courseEnrollment(user.firstName, course.title, courseLink)
        );
        
        // Send invoice
        const invoiceTransactionId = transactionId || `TXN${Date.now()}`;
        await sendEmail(
          user.email,
          `Invoice - ${course.title}`,
          emailTemplates.invoice(
            user.firstName + ' ' + user.lastName,
            course.title,
            finalPrice,
            invoiceTransactionId,
            new Date().toISOString(),
            'course'
          )
        );
        
        console.log('✅ Enrollment and invoice emails sent to:', user.email);
      }
    } catch (emailError) {
      console.error('❌ Failed to send enrollment emails:', emailError);
      // Don't fail enrollment if email fails
    }

    return NextResponse.json({ 
      message: "Enrolled successfully", 
      enrollment,
      finalPrice,
      appliedPromoCode 
    }, { status: 201 });
  } catch (error) {
    console.error("Enrollment error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
