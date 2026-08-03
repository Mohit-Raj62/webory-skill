import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { convertToHLS } from "../services/ffmpeg.service";
import { uploadFileToR2, uploadDirectoryToR2 } from "../services/r2.service";
import Recording from "../../../src/models/Recording";

const router = Router();

// Configure Multer for temporary storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, "../../uploads");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

router.post("/upload", upload.single("video"), async (req, res) => {
  try {
    const { title, courseId, moduleId } = req.body;
    const file = req.file;

    if (!file) return res.status(400).json({ error: "No video file provided" });

    // 1. Create Recording Record
    const recording = new Recording({
      title,
      courseId,
      moduleId,
      originalFileName: file.originalname,
      r2Bucket: process.env.R2_BUCKET_NAME || "webory-skills-videos",
      r2KeyOriginal: `raw/${file.filename}`,
      status: "uploading",
    });
    await recording.save();

    // Respond immediately, processing continues in background
    res.status(202).json({ message: "Upload started, processing in background", recordingId: recording._id });

    // Background Processing:
    (async () => {
      try {
        // 2. Upload raw MP4 to R2
        await uploadFileToR2(file.path, recording.r2KeyOriginal, "video/mp4");
        
        recording.status = "processing";
        await recording.save();

        // 3. Convert to HLS using FFmpeg
        const hlsOutputDir = path.join(__dirname, `../../uploads/hls-${recording._id}`);
        await convertToHLS(file.path, hlsOutputDir);

        // 4. Upload HLS segments and playlist to R2
        const r2HlsBaseKey = `hls/${recording._id}`;
        await uploadDirectoryToR2(hlsOutputDir, r2HlsBaseKey);

        // 5. Update Database with HLS URL (Cloudflare R2 Public URL)
        // Assuming you have a public domain for your R2 bucket like https://videos.webory.in
        const publicDomain = process.env.R2_PUBLIC_DOMAIN || `https://pub-${process.env.R2_ACCOUNT_ID}.r2.dev`;
        recording.r2KeyHls = r2HlsBaseKey;
        recording.hlsUrl = `${publicDomain}/${r2HlsBaseKey}/index.m3u8`;
        recording.status = "ready";
        await recording.save();

        // Cleanup local files
        fs.unlinkSync(file.path);
        fs.rmSync(hlsOutputDir, { recursive: true, force: true });
        
        console.log(`Successfully processed and uploaded recording ${recording._id}`);
      } catch (err) {
        console.error("Background processing failed:", err);
        recording.status = "failed";
        await recording.save();
      }
    })();
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Failed to upload video" });
  }
});

export default router;
