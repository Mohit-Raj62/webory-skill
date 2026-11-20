import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function POST(req: Request) {
    try {
        if (
            !process.env.CLOUDINARY_CLOUD_NAME ||
            !process.env.CLOUDINARY_API_KEY ||
            !process.env.CLOUDINARY_API_SECRET
        ) {
            return NextResponse.json({ error: "Cloudinary credentials not configured" }, { status: 500 });
        }

        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        // Limit to 10MB
        if (file.size > 10 * 1024 * 1024) {
            return NextResponse.json({ error: "File exceeds 10MB size limit" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const isImage = file.type.startsWith("image/");
        const resourceType = isImage ? "image" : "raw";

        const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");

        const result: any = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: "support-attachments",
                    resource_type: resourceType,
                    public_id: `${Date.now()}-${cleanFileName.replace(/\.[^/.]+$/, "")}`,
                },
                (error, res) => {
                    if (error) {
                        console.error("Cloudinary support upload error:", error);
                        reject(error);
                    } else {
                        resolve(res);
                    }
                }
            );
            uploadStream.end(buffer);
        });

        return NextResponse.json({
            success: true,
            url: result.secure_url,
            name: file.name,
            size: file.size,
            type: file.type,
            isImage
        });
    } catch (error: any) {
        console.error("Support file upload error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to upload attachment" },
            { status: 500 }
        );
    }
}
