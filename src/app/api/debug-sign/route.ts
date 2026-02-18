import cloudinary from "@/lib/cloudinary";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const publicId = "resumes/1771448358748-real_dummy";

    // Generate signed URL
    const url = cloudinary.url(publicId, {
      resource_type: "image",
      format: "pdf",
      sign_url: true,
      type: "authenticated",
    });

    // Also try standard upload type with signature (sometimes works for restrictive accounts?)
    const urlUpload = cloudinary.url(publicId, {
      resource_type: "image",
      format: "pdf",
      sign_url: true,
      // type defaults to upload
    });

    return new NextResponse(`Auth: ${url}\nUploadSigned: ${urlUpload}`, {
      status: 200,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
