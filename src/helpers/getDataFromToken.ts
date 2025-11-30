import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/models/User";
import dbConnect from "@/lib/db";

export const getDataFromToken = async (request: Request) => {
    try {
        const token = (request as NextRequest).cookies.get("token")?.value || "";
        
        if (!token) {
            return null;
        }

        const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET!);
        
        // Verify session against database
        await dbConnect();
        const user = await User.findById(decodedToken.userId);
        
        if (!user) {
            throw new Error("User not found");
        }

        if (decodedToken.sessionId && user.currentSessionId !== decodedToken.sessionId) {
            throw new Error("Session expired. Please login again.");
        }

        return decodedToken.userId;
    } catch (error: any) {
        throw new Error(error.message);
    }
};
