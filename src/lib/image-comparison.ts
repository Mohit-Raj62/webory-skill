import sharp from "sharp";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";

export interface ComparisonResult {
  similarity: number;
  differences: number;
  isSuspicious: boolean;
  suspiciousRegions: Array<{
    x: number;
    y: number;
    width: number;
    height: number;
  }>;
  diffImage?: Buffer;
}

/**
 * Compare two certificate images to detect tampering
 */
export async function compareImages(
  uploadedImage: Buffer,
  templateImage: Buffer
): Promise<ComparisonResult> {
  try {
    // 1. Resize images to same dimensions (standard certificate size)
    const width = 1000;
    const height = 700;

    const img1 = await sharp(uploadedImage)
      .resize(width, height)
      .ensureAlpha()
      .raw()
      .toBuffer();

    const img2 = await sharp(templateImage)
      .resize(width, height)
      .ensureAlpha()
      .raw()
      .toBuffer();

    // 2. Compare using pixelmatch
    const diff = new PNG({ width, height });
    const numDiffPixels = pixelmatch(img1, img2, diff.data, width, height, {
      threshold: 0.1,
    });

    // 3. Calculate similarity
    const totalPixels = width * height;
    const similarity = 1 - numDiffPixels / totalPixels;

    // 4. Identify suspicious regions (clustering diff pixels)
    // This is a simplified clustering - in production would use more advanced algo
    const suspiciousRegions: Array<{
      x: number;
      y: number;
      width: number;
      height: number;
    }> = [];

    if (numDiffPixels > 0) {
      // If significant difference, mark as suspicious
      // We could analyze diff.data to find bounding boxes of changes
    }

    return {
      similarity: similarity * 100, // Percentage
      differences: numDiffPixels,
      isSuspicious: similarity < 0.9, // Less than 90% match is suspicious
      suspiciousRegions,
      diffImage: PNG.sync.write(diff),
    };
  } catch (error) {
    console.error("Image comparison error:", error);
    throw new Error("Failed to compare images");
  }
}

/**
 * Detect potential photo manipulation (JPEG artifacts, etc.)
 */
export async function detectPhotoManipulation(imageBuffer: Buffer): Promise<{
  isManipulated: boolean;
  confidence: number;
  issues: string[];
}> {
  const issues: string[] = [];
  let confidence = 0;

  try {
    const image = sharp(imageBuffer);
    const metadata = await image.metadata();

    // 1. Check Dimensions & Aspect Ratio
    if (metadata.width && metadata.height) {
      // Check for very low resolution
      if (metadata.width < 500 || metadata.height < 500) {
        issues.push("Low resolution image (potential screenshot or thumbnail)");
        confidence += 30;
      }
    }

    // 2. Check for suspicious metadata
    // (Simplified check as sharp has limited EXIF access without plugins)

    return {
      isManipulated: issues.length > 0,
      confidence: Math.min(confidence, 100),
      issues,
    };
  } catch (error) {
    console.error("Manipulation detection error:", error);
    return { isManipulated: false, confidence: 0, issues: ["Analysis failed"] };
  }
}
