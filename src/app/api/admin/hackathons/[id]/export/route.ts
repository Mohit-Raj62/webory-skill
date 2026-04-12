import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Hackathon from "@/models/Hackathon";
import User from "@/models/User";
import { getDataFromToken } from "@/helpers/getDataFromToken";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    
    // Auth Check
    const userId = await getDataFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const admin = await User.findById(userId);
    if (!admin || admin.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const hackathon = await Hackathon.findById(id).populate("registeredUsers.user", "firstName lastName email phone xp");

    if (!hackathon) {
      return NextResponse.json({ error: "Hackathon not found" }, { status: 404 });
    }

    // Generate CSV
    const headers = [
      "Name", 
      "Email", 
      "Phone", 
      "College", 
      "Course", 
      "Branch", 
      "Year", 
      "XP", 
      "Selected Domain", 
      "Registration Date"
    ];
    
    const rows = (hackathon.registeredUsers || []).map((item: any) => [
      item.name || `${item.user?.firstName || ""} ${item.user?.lastName || ""}`.trim() || "N/A",
      item.email || item.user?.email || "N/A",
      item.phone || item.user?.phone || "N/A",
      item.college || "N/A",
      item.course || "N/A",
      item.branch || "N/A",
      item.year || "N/A",
      item.user?.xp || 0,
      item.domain || "Default",
      item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "N/A"
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row: string[]) => row.map((cell: any) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    ].join("\n");

    // Return CSV Response
    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="${hackathon.title.replace(/[^a-z0-9]/gi, '_')}_registrations.csv"`,
      },
    });

  } catch (error: any) {
    console.error("HACKATHON_EXPORT_ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
