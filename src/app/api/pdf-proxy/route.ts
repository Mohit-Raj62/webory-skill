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
    const response = await fetch(url);

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch PDF: ${response.statusText}` },
        { status: response.status }
      );
    }

    const contentType =
      response.headers.get("content-type") || "application/pdf";
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
