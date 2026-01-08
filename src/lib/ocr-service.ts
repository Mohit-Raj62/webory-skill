// OCR Service for certificate verification
import { createWorker } from "tesseract.js";

export interface ExtractedCertificateData {
  studentName: string | null;
  certificateId: string | null;
  courseName: string | null;
  issueDate: string | null;
  institutionName: string | null;
  grade: string | null;
  confidence: number;
  rawText: string;
}

/**
 * Extract text from PDF buffer
 */
export async function extractTextFromPDF(pdfBuffer: Buffer): Promise<string> {
  try {
    console.log("[OCR Service] Parsing PDF...");

    // Polyfill DOMMatrix for newer pdfjs-dist versions in Node.js
    if (!global.DOMMatrix) {
      // @ts-ignore
      global.DOMMatrix = class DOMMatrix {
        a = 1;
        b = 0;
        c = 0;
        d = 1;
        e = 0;
        f = 0;
        constructor() {}
      };
    }

    // @ts-ignore
    const pdfLib = require("pdf-parse"); // Revert to standard package import

    // Robustly find the function whether it's CJS, ESM, or nested default
    let pdf = pdfLib;
    if (typeof pdf !== "function") {
      if (pdfLib.default) pdf = pdfLib.default;
      if (typeof pdf !== "function" && pdf && pdf.default) pdf = pdf.default;
    }

    if (typeof pdf !== "function") {
      const debugInfo = {
        type: typeof pdfLib,
        keys: Object.keys(pdfLib),
        isDefaultFn: pdfLib.default ? typeof pdfLib.default : "undefined",
      };
      console.error("[OCR Service] Debug:", debugInfo);
      throw new Error(
        `pdf-parse import failed. Lib keys: ${JSON.stringify(
          Object.keys(pdfLib)
        )}`
      );
    }

    const data = await pdf(pdfBuffer);
    console.log("[OCR Service] PDF Parsed. Text length:", data.text.length);
    return data.text;
  } catch (error) {
    console.error("PDF extraction error:", error);
    throw new Error(
      "Failed to extract text from PDF: " +
        (error instanceof Error ? error.message : String(error))
    );
  }
}

/**
 * Extract text from certificate image using OCR
 */
export async function extractTextFromImage(
  imageBuffer: Buffer | string
): Promise<string> {
  let worker: any = null;

  // Timeout promise
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(
      () => reject(new Error("OCR Operation timed out after 30s")),
      30000
    );
  });

  try {
    // Optimization: Pre-process image with sharp if it's a buffer
    let processedBuffer = imageBuffer;
    if (Buffer.isBuffer(imageBuffer)) {
      try {
        console.log("[OCR Service] Optimizing image with Sharp...");
        const sharp = require("sharp");
        processedBuffer = await sharp(imageBuffer)
          .resize(1800, 1800, { fit: "inside", withoutEnlargement: true }) // Limit size
          .grayscale() // Enhance text contrast
          .normalize() // Improve brightness/contrast
          .toBuffer();
        console.log("[OCR Service] Image optimized successfully.");
      } catch (sharpError) {
        console.error(
          "[OCR Service] Sharp optimization failed/skipped:",
          sharpError
        );
        // Fallback to original buffer
        processedBuffer = imageBuffer;
      }
    }

    console.log("[OCR Service] Creating Tesseract worker...");
    worker = await createWorker("eng");

    console.log("[OCR Service] Worker created. Recognizing text...");

    // Race between recognition and timeout
    const recognizePromise = worker.recognize(processedBuffer);
    const result: any = await Promise.race([recognizePromise, timeoutPromise]);

    const { data } = result;

    console.log("[OCR Service] Text recognized. Length:", data.text.length);
    console.log("[OCR Service] Text preview:", data.text.substring(0, 200));

    await worker.terminate();
    console.log("[OCR Service] Worker terminated.");

    return data.text;
  } catch (error) {
    console.error("OCR extraction error:", error);
    if (worker) {
      try {
        await worker.terminate();
      } catch (e) {
        console.error("Failed to terminate worker:", e);
      }
    }
    throw new Error(
      "Failed to extract text: " +
        (error instanceof Error ? error.message : String(error))
    );
  }
}

/**
 * Parse extracted text to find certificate details
 */
export function parseCertificateData(text: string): ExtractedCertificateData {
  const lines = text
    .split("\\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  let studentName: string | null = null;
  let certificateId: string | null = null;
  let courseName: string | null = null;
  let issueDate: string | null = null;
  let institutionName: string | null = null;
  let grade: string | null = null;

  // Pattern matching for common certificate fields
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lowerLine = line.toLowerCase();

    // Certificate ID patterns - VERY FLEXIBLE
    if (!certificateId) {
      console.log("[OCR] Searching for Certificate ID in line:", line);

      // Pattern 1: Look for explicit labels (Certificate, ID, No, etc.)
      const labelMatch = line.match(
        /(?:certificate|cert|credential|ref|reference|registration|reg|id|no|number|code|num)\s*[:#-]?\s*([A-Z0-9]{3,}[-_/\s]?[A-Z0-9]{2,}[-_/\s]?[A-Z0-9]*)/i
      );
      if (labelMatch && labelMatch[1]) {
        certificateId = labelMatch[1].trim();
        console.log("[OCR] Found ID with label:", certificateId);
      } else {
        // Pattern 2: Look for standalone alphanumeric strings with separators
        // Matches: ABC-123, 123-ABC-456, A1B2C3, etc.
        const standaloneMatch = line.match(
          /\b([A-Z0-9]{2,}[-_/\s][A-Z0-9]{2,}(?:[-_/\s][A-Z0-9]{2,})?)\b/i
        );
        if (standaloneMatch && standaloneMatch[1]) {
          const candidate = standaloneMatch[1].trim();
          // Must have at least one number and be at least 6 characters
          if (/\d/.test(candidate) && candidate.length >= 6) {
            certificateId = candidate;
            console.log("[OCR] Found standalone ID:", certificateId);
          }
        } else {
          // Pattern 3: Very broad - any long alphanumeric string
          const broadMatch = line.match(/\b([A-Z0-9]{8,})\b/i);
          if (broadMatch && broadMatch[1]) {
            const candidate = broadMatch[1].trim();
            // Must have both letters and numbers
            if (/[A-Z]/i.test(candidate) && /\d/.test(candidate)) {
              certificateId = candidate;
              console.log("[OCR] Found broad match ID:", certificateId);
            }
          }
        }
      }
    }

    // Student name patterns
    if (
      !studentName &&
      (lowerLine.includes("certify") ||
        lowerLine.includes("awarded to") ||
        lowerLine.includes("presented to"))
    ) {
      // Next line usually contains the name
      if (i + 1 < lines.length) {
        const nextLine = lines[i + 1];
        // Name should be 2-50 characters, mostly letters
        if (
          nextLine.length >= 2 &&
          nextLine.length <= 50 &&
          /^[A-Za-z\s.]+$/.test(nextLine)
        ) {
          studentName = nextLine;
        }
      }
    }

    // Course/Program name
    if (
      !courseName &&
      (lowerLine.includes("completion of") ||
        lowerLine.includes("successfully completed"))
    ) {
      if (i + 1 < lines.length) {
        const nextLine = lines[i + 1];
        if (nextLine.length >= 5 && nextLine.length <= 100) {
          courseName = nextLine;
        }
      }
    }

    // Date patterns
    if (!issueDate) {
      // Match various date formats
      const dateMatch = line.match(
        /(\d{1,2}[-/]\d{1,2}[-/]\d{2,4}|\d{4}[-/]\d{1,2}[-/]\d{1,2}|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{1,2},?\s+\d{4})/i
      );
      if (dateMatch) {
        issueDate = dateMatch[1];
      }
    }

    // Institution name (usually at top or bottom)
    if (!institutionName && i < 5) {
      // Top lines often contain institution name
      if (
        line.length >= 5 &&
        line.length <= 80 &&
        /^[A-Za-z\s&.,-]+$/.test(line)
      ) {
        institutionName = line;
      }
    }

    // Grade/Score patterns
    if (!grade) {
      const gradeMatch = line.match(
        /(?:grade|score|marks|cgpa)[\s:]*([A-F][\+\-]?|\d+(?:\.\d+)?)/i
      );
      if (gradeMatch) {
        grade = gradeMatch[1];
      }
    }
  }

  // Calculate confidence based on how many fields were found
  const fieldsFound = [
    studentName,
    certificateId,
    courseName,
    issueDate,
  ].filter((f) => f !== null).length;
  const confidence = (fieldsFound / 4) * 100;

  return {
    studentName,
    certificateId,
    courseName,
    issueDate,
    institutionName,
    grade,
    confidence,
    rawText: text,
  };
}

/**
 * Main function to extract and parse certificate data
 */
export async function extractCertificateData(
  imageBuffer: Buffer | string
): Promise<ExtractedCertificateData> {
  const text = await extractTextFromImage(imageBuffer);
  return parseCertificateData(text);
}

/**
 * Validate extracted data against database
 */
export interface ValidationResult {
  isValid: boolean;
  matchedFields: string[];
  mismatchedFields: string[];
  confidence: number;
  warnings: string[];
}

export function validateExtractedData(
  extracted: ExtractedCertificateData,
  dbData: {
    studentName: string;
    certificateId: string;
    courseName: string;
    issueDate: string;
  }
): ValidationResult {
  const matchedFields: string[] = [];
  const mismatchedFields: string[] = [];
  const warnings: string[] = [];

  // Helper function to normalize strings for comparison
  const normalize = (str: string | null) =>
    str ? str.toLowerCase().replace(/[^a-z0-9]/g, "") : "";

  // Check Certificate ID (most important)
  if (extracted.certificateId) {
    if (
      normalize(extracted.certificateId) === normalize(dbData.certificateId)
    ) {
      matchedFields.push("certificateId");
    } else {
      mismatchedFields.push("certificateId");
      warnings.push("Certificate ID does not match database");
    }
  }

  // Check Student Name
  if (extracted.studentName) {
    const extractedName = normalize(extracted.studentName);
    const dbName = normalize(dbData.studentName);

    // Allow partial match (at least 70% similarity)
    const similarity = calculateSimilarity(extractedName, dbName);
    if (similarity >= 0.7) {
      matchedFields.push("studentName");
    } else {
      mismatchedFields.push("studentName");
      warnings.push(
        `Student name mismatch: OCR found "${extracted.studentName}", DB has "${dbData.studentName}"`
      );
    }
  }

  // Check Course Name
  if (extracted.courseName) {
    const similarity = calculateSimilarity(
      normalize(extracted.courseName),
      normalize(dbData.courseName)
    );
    if (similarity >= 0.6) {
      matchedFields.push("courseName");
    } else {
      mismatchedFields.push("courseName");
      warnings.push("Course name does not match");
    }
  }

  // Check Date
  if (extracted.issueDate) {
    const extractedDate = normalizeDate(extracted.issueDate);
    const dbDate = normalizeDate(dbData.issueDate);
    if (extractedDate === dbDate) {
      matchedFields.push("issueDate");
    } else {
      mismatchedFields.push("issueDate");
      warnings.push("Issue date does not match");
    }
  }

  const isValid = mismatchedFields.length === 0 && matchedFields.length >= 2;
  const confidence = (matchedFields.length / 4) * 100;

  return {
    isValid,
    matchedFields,
    mismatchedFields,
    confidence,
    warnings,
  };
}

// Helper: Calculate string similarity (Levenshtein distance)
function calculateSimilarity(str1: string, str2: string): number {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;

  if (longer.length === 0) return 1.0;

  const editDistance = levenshteinDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
}

function levenshteinDistance(str1: string, str2: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[str2.length][str1.length];
}

// Helper: Normalize date strings
function normalizeDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return date.toISOString().split("T")[0];
  } catch {
    return dateStr;
  }
}
