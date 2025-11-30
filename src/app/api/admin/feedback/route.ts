import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Feedback from "@/models/Feedback";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import User from "@/models/User";

export async function GET(req: Request) {
    try {
        await dbConnect();
        const userId = await getDataFromToken(req);
        const user = await User.findById(userId);

        if (!user || user.role !== 'admin') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const feedbacks = await Feedback.find({})
            .sort({ createdAt: -1 })
            .populate('user', 'firstName lastName email');

        return NextResponse.json({ feedbacks });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
