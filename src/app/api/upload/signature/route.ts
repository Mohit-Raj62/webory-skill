import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { folder = "course-videos" } = body;

    const timestamp = Math.round(new Date().getTime() / 1000);

    const signParams: Record<string, any> = {
      timestamp,
      folder,
    };

    if (folder === "course-videos") {
      signParams.eager = "w_1920,h_1080,c_limit";
      signParams.eager_async = true;
    }

    const signature = cloudinary.utils.api_sign_request(
      signParams,
      process.env.CLOUDINARY_API_SECRET || "",
    );

    return NextResponse.json({
      signature,
      timestamp,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
    });
  } catch (error) {
    console.error("Signature generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate signature" },
      { status: 500 },
    );
  }
}
