import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Simulator from "@/models/Simulator";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import User from "@/models/User";

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        const userId = await getDataFromToken(request);
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await User.findById(userId);
        if (user.role !== "admin") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const { id } = await context.params;
        const reqBody = await request.json();
        const updatedSimulator = await Simulator.findByIdAndUpdate(id, reqBody, { new: true });

        if (!updatedSimulator) {
            return NextResponse.json({ error: "Simulator not found" }, { status: 404 });
        }

        return NextResponse.json({
            message: "Simulator updated successfully",
            success: true,
            data: updatedSimulator,
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        const userId = await getDataFromToken(request);
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await User.findById(userId);
        if (user.role !== "admin") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const { id } = await context.params;
        const deletedSimulator = await Simulator.findByIdAndDelete(id);

        if (!deletedSimulator) {
            return NextResponse.json({ error: "Simulator not found" }, { status: 404 });
        }

        return NextResponse.json({
            message: "Simulator deleted successfully",
            success: true,
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
