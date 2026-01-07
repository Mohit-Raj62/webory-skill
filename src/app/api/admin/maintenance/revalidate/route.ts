import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    // Auth Check
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    if (decoded.role !== "admin")
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    // Revalidate critical paths
    revalidatePath("/", "layout"); // Clears everything from root layout down
    revalidatePath("/courses");

    // If using tags
    // revalidateTag('courses');

    return NextResponse.json({
      success: true,
      message:
        "Cache cleared successfully. All pages will regenerate on next visit.",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
