import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import ResumeAnalysis from "@/models/ResumeAnalysis";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: NextRequest) {
    try {
        console.log("--- ANALYSIS START ---");
        
        if (!process.env.GEMINI_API_KEY) {
            console.error("CRITICAL: GEMINI_API_KEY is missing");
            return NextResponse.json({ error: "Environment Error: Gemini API Key missing" }, { status: 500 });
        }

        try {
            await dbConnect();
            console.log("DB Connected");
        } catch (dbErr: any) {
            console.error("DB Connection Failed:", dbErr.message);
            return NextResponse.json({ error: "Database Connection Failed", details: dbErr.message }, { status: 500 });
        }
        
        let userId;
        try {
            userId = await getDataFromToken(request);
            console.log("User Identified:", userId);
        } catch (authErr: any) {
            console.error("Auth Failed:", authErr.message);
            return NextResponse.json({ error: "Authentication Failed", details: authErr.message }, { status: 401 });
        }

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized: No User ID" }, { status: 401 });
        }

        const formData: any = await request.formData();
        const file = formData.get("file") as File;
        const jobDescription = formData.get("jobDescription") as string || "General Software Engineer role";

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        console.log("File Info:", { name: file.name, size: file.size, type: file.type });

        const buffer = Buffer.from(await file.arrayBuffer());
        console.log("Buffer size:", buffer.length);
        
        console.log("Analyze Request:", {
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type || "application/pdf", // fallback
            userId: userId
        });

        // Use Gemini's native multi-modal capability to analyze PDF directly
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
        
        const prompt = `
            Analyze the attached resume against the following job description.
            
            Job Description:
            ${jobDescription}

            Please provide a detailed analysis in JSON format with the following structure:
            {
                "score": (number 0-100),
                "foundKeywords": (array of strings),
                "missingKeywords": (array of strings),
                "formattingFeedback": (array of strings),
                "atsCompatibility": ("Low" | "Medium" | "High"),
                "extractedText": (string - the full text extracted from the PDF)
            }
        `;

        // Determine correct MIME type for Gemini
        let mimeType = file.type;
        if (!mimeType || mimeType === "application/octet-stream") {
            if (file.name.endsWith(".pdf")) mimeType = "application/pdf";
            else if (file.name.endsWith(".docx")) mimeType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
            else mimeType = "text/plain";
        }

        const result = await model.generateContent([
            {
                inlineData: {
                    data: buffer.toString("base64"),
                    mimeType: mimeType
                }
            },
            { text: prompt }
        ]);

        const responseText = result.response.text();
        console.log("Gemini Raw Response:", responseText);

        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error("AI did not return a valid JSON. Response was: " + responseText.substring(0, 500));
        }
        
        const analysis = JSON.parse(jsonMatch[0]);

        // --- NEW: CLOUDINARY UPLOAD ---
        let cloudinaryUrl = "direct_analysis";
        try {
            const uploadResult: any = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        resource_type: "raw",
                        folder: "resumes_ats",
                        public_id: `${Date.now()}-${file.name.replace(/\s+/g, "_")}`,
                    },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
                uploadStream.end(buffer);
            });
            cloudinaryUrl = uploadResult.secure_url;
            console.log("Cloudinary Upload Success:", cloudinaryUrl);
        } catch (uploadErr) {
            console.error("Cloudinary Upload Failed (continuing with analysis):", uploadErr);
        }

        // Normalize enum values for Mongoose validation
        const normalizedAtsCompatibility = (analysis.atsCompatibility || "Low").charAt(0).toUpperCase() + 
                                          (analysis.atsCompatibility || "Low").slice(1).toLowerCase();
        
        const validStatuses = ["Low", "Medium", "High"];
        const finalStatus = validStatuses.includes(normalizedAtsCompatibility) ? normalizedAtsCompatibility : "Low";

        // Save to DB
        const newAnalysis = await ResumeAnalysis.create({
            userId,
            resumeUrl: cloudinaryUrl,
            score: analysis.score || 0,
            foundKeywords: analysis.foundKeywords || [],
            missingKeywords: analysis.missingKeywords || [],
            formattingFeedback: analysis.formattingFeedback || [],
            atsCompatibility: finalStatus
        });

        return NextResponse.json({
            message: "Analysis complete",
            success: true,
            data: newAnalysis,
            rawText: analysis.extractedText || "Text extraction failed"
        });

    } catch (error: any) {
        console.error("Analysis Error:", error);
        return NextResponse.json({ 
            error: "Analysis Failed",
            message: error.message,
            stack: error.stack,
            at: "route.ts"
        }, { status: 500 });
    }
}
