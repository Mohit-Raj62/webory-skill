import cloudinary from "@/lib/cloudinary";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const rawResources: any = await cloudinary.api.resources({
      type: "upload",
      resource_type: "raw",
      prefix: "resumes/",
      max_results: 5,
    });

    const imageResources: any = await cloudinary.api.resources({
      type: "upload",
      resource_type: "image",
      prefix: "resumes/",
      max_results: 5,
    });

    // simplified response
    const rawMap = rawResources.resources.map((r: any) => ({
      public_id: r.public_id,
      secure_url: r.secure_url,
      access_mode: r.access_mode,
    }));

    const imageMap = imageResources.resources.map((r: any) => ({
      public_id: r.public_id,
      secure_url: r.secure_url,
      access_mode: r.access_mode,
      format: r.format,
    }));

    return NextResponse.json({
      raw: rawMap,
      image: imageMap,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
