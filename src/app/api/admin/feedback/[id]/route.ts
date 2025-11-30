import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Feedback from "@/models/Feedback";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import User from "@/models/User";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        const { id } = await params;
        const userId = await getDataFromToken(req);
        const user = await User.findById(userId);

        if (!user || user.role !== 'admin') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const { isPublic } = await req.json();
        
        const feedback = await Feedback.findByIdAndUpdate(
            id,
            { isPublic },
            { new: true }
        );

        if (!feedback) {
            return NextResponse.json({ error: "Feedback not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Feedback updated", feedback });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        console.log("DELETE request received for ID:", id);
        await dbConnect();
        const userId = await getDataFromToken(req);
        console.log("User ID from token:", userId);
        
        const user = await User.findById(userId);
        console.log("User found:", user ? user.email : "No user", "Role:", user?.role);

        if (!user || user.role !== 'admin') {
            console.log("Unauthorized access attempt");
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const feedback = await Feedback.findByIdAndDelete(id);
        console.log("Feedback deletion result:", feedback);

        if (!feedback) {
            return NextResponse.json({ error: "Feedback not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Feedback deleted" });

    } catch (error: any) {
        console.error("Delete error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
