import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Hackathon from "@/models/Hackathon";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

async function isAdmin(request: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;
        if (!token) return false;
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
        return decoded.role === "admin";
    } catch {
        return false;
    }
}

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await params;

        if (!(await isAdmin(req))) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const data = await req.json();
        const updatedHackathon = await Hackathon.findByIdAndUpdate(
            id,
            { ...data },
            { new: true, runValidators: true }
        );

        if (!updatedHackathon) {
            return NextResponse.json({ error: "Hackathon not found" }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: "Hackathon updated successfully",
            data: updatedHackathon
        });
    } catch (error: any) {
        console.error("ADMIN_HACKATHON_UPDATE_ERROR:", error);
        return NextResponse.json(
            { error: "Internal Server Error", message: error.message },
            { status: 500 }
        );
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await params;

        if (!(await isAdmin(req))) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const deletedHackathon = await Hackathon.findByIdAndDelete(id);

        if (!deletedHackathon) {
            return NextResponse.json({ error: "Hackathon not found" }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: "Hackathon deleted successfully"
        });
    } catch (error: any) {
        console.error("ADMIN_HACKATHON_DELETE_ERROR:", error);
        return NextResponse.json(
            { error: "Internal Server Error", message: error.message },
            { status: 500 }
        );
    }
}
