import { NextResponse } from "next/server";

// Simple in-memory rate limiter
const rateLimit = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 10;

// Judge0 Language ID mapping
const LANGUAGE_MAP: Record<string, number> = {
  javascript: 63,
  python: 71,
  java: 62,
  cpp: 54,
  c: 50,
  csharp: 51,
  ruby: 72,
  go: 60,
  rust: 73,
  php: 68,
  typescript: 74,
  kotlin: 78,
  swift: 83,
};

// Glot.io language mapping (alternative service)
const GLOT_LANGUAGE_MAP: Record<string, string> = {
  javascript: "javascript",
  python: "python",
  java: "java",
  cpp: "cpp",
  c: "c",
  csharp: "csharp",
  ruby: "ruby",
  go: "go",
  rust: "rust",
  php: "php",
  typescript: "typescript",
  kotlin: "kotlin",
  swift: "swift",
};

// Try Glot.io as alternative
async function tryGlotIO(language: string, code: string): Promise<any> {
  const glotLang = GLOT_LANGUAGE_MAP[language.toLowerCase()];
  if (!glotLang) return null;

  try {
    const response = await fetch(
      "https://glot.io/api/run/" + glotLang + "/latest",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          files: [
            {
              name:
                "main." +
                (glotLang === "python"
                  ? "py"
                  : glotLang === "javascript"
                    ? "js"
                    : glotLang),
              content: code,
            },
          ],
        }),
      },
    );

    if (response.ok) {
      const result = await response.json();
      return {
        run: {
          stdout: result.stdout || "",
          stderr: result.stderr || "",
          code: result.stderr ? 1 : 0,
          signal: null,
          output: result.stdout || result.stderr || "",
        },
        language: language,
        version: "glot.io",
      };
    }
  } catch (error) {
    console.error("Glot.io failed:", error);
  }
  return null;
}

// Development mock for when all services fail
function getMockResponse(language: string, code: string): any {
  // Simple mock responses for common test cases
  let output = "";

  if (code.includes("print") || code.includes("console.log")) {
    if (language === "python") {
      output =
        "Hello from Mock!\n(Code execution services are currently unavailable)\n";
    } else if (language === "javascript") {
      output =
        "Hello from Mock!\n(Code execution services are currently unavailable)\n";
    } else {
      output =
        "Mock output\n(Code execution services are currently unavailable)\n";
    }
  } else {
    output =
      "Code compiled successfully (mock)\n(Code execution services are currently unavailable)\n";
  }

  return {
    run: {
      stdout: output,
      stderr: "",
      code: 0,
      signal: null,
      output: output,
    },
    language: language,
    version: "mock (development mode)",
    isMock: true,
  };
}

// Try Judge0 with polling
async function tryJudge0(
  languageId: number,
  code: string,
  apiUrl: string,
): Promise<any> {
  try {
    // Submit code
    const submissionRes = await fetch(
      `${apiUrl}/submissions?base64_encoded=false&wait=false`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language_id: languageId,
          source_code: code,
          stdin: "",
        }),
      },
    );

    if (!submissionRes.ok) return null;

    const submission = await submissionRes.json();
    if (!submission.token) return null;

    // Poll for result (max 5 attempts = 2.5 seconds)
    for (let i = 0; i < 5; i++) {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const resultRes = await fetch(
        `${apiUrl}/submissions/${submission.token}?base64_encoded=false`,
      );
      if (!resultRes.ok) continue;

      const result = await resultRes.json();
      if (result.status?.id > 2) {
        return {
          run: {
            stdout: result.stdout || "",
            stderr: result.stderr || result.compile_output || "",
            code: result.status?.id === 3 ? 0 : 1,
            signal: null,
            output:
              result.stdout || result.stderr || result.compile_output || "",
          },
          language: "",
          version: result.status?.description || "unknown",
        };
      }
    }
  } catch (error) {
    console.error(`Judge0 (${apiUrl}) failed:`, error);
  }
  return null;
}

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "unknown";

    // Rate Limiting
    const now = Date.now();
    const windowStart = now - RATE_LIMIT_WINDOW;
    let requests = rateLimit.get(ip) || [];
    requests = requests.filter((timestamp) => timestamp > windowStart);

    if (requests.length >= MAX_REQUESTS_PER_WINDOW) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please wait a moment." },
        { status: 429 },
      );
    }

    requests.push(now);
    rateLimit.set(ip, requests);

    const body = await req.json();
    const { language, content } = body;

    if (!language || !content) {
      return NextResponse.json(
        { error: "Language and content are required." },
        { status: 400 },
      );
    }

    const languageId = LANGUAGE_MAP[language.toLowerCase()];
    if (!languageId) {
      return NextResponse.json(
        { error: `Unsupported language: ${language}` },
        { status: 400 },
      );
    }

    // Try multiple services in order
    const judge0Instances = ["https://judge0.com", "https://ce.judge0.com"];

    // Try Judge0 instances
    for (const apiUrl of judge0Instances) {
      const result = await tryJudge0(languageId, content, apiUrl);
      if (result) {
        result.language = language;
        return NextResponse.json(result);
      }
    }

    // Try Glot.io as fallback
    const glotResult = await tryGlotIO(language, content);
    if (glotResult) {
      return NextResponse.json(glotResult);
    }

    // All services failed - return mock for development
    console.warn(
      "All code execution services unavailable, using mock response",
    );
    const mockResult = getMockResponse(language, content);
    return NextResponse.json(mockResult);
  } catch (error: any) {
    console.error("Code execution failed:", error);
    return NextResponse.json(
      { error: error.message || "Failed to execute code." },
      { status: 500 },
    );
  }
}
