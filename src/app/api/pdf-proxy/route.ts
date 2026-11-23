import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");
  const isDownload = searchParams.get("download") === "true";
  const filename = searchParams.get("filename") || "curriculum.pdf";

  if (!url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  try {
    let fetchUrl = url;
    if (fetchUrl.startsWith("/")) {
      const host = req.headers.get("host") || "localhost:3000";
      const protocol = req.headers.get("x-forwarded-proto") || "http";
      fetchUrl = `${protocol}://${host}${fetchUrl}`;
    }

    const response = await fetch(fetchUrl);

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch PDF: ${response.statusText}` },
        { status: response.status }
      );
    }

    const buffer = await response.arrayBuffer();

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/pdf", // Force PDF type
        "Content-Disposition": isDownload ? `attachment; filename="${filename.replace(/"/g, '')}"` : "inline",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error: any) {
    console.error("PDF Proxy Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
