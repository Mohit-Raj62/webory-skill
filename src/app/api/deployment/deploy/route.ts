import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import CodeSnippet from "@/models/CodeSnippet";
import User from "@/models/User";
import { getDataFromToken } from "@/helpers/getDataFromToken";

export async function POST(req: Request) {
    try {
        await dbConnect();
        const userId = await getDataFromToken(req);
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { codeId, title, code, language } = await req.json();

        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Generate Subdomain: username-title (slugified)
        const username = user.firstName.toLowerCase().replace(/[^a-z0-9]/g, "");
        const projectSlug = title.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-");
        const subdomain = `${username}-${projectSlug}`;

        // Update or Create Deployment
        const updatedSnippet = await CodeSnippet.findByIdAndUpdate(
            codeId,
            {
                isDeployed: true,
                subdomain,
                deploymentUrl: `https://${subdomain}.weboryskills.in`,
                code,
                language,
                isPublic: true
            },
            { new: true }
        );

        return NextResponse.json({
            success: true,
            message: "Project deployed successfully!",
            deploymentUrl: updatedSnippet.deploymentUrl,
            subdomain: updatedSnippet.subdomain
        });

    } catch (error: any) {
        console.error("Deployment Error:", error);
        return NextResponse.json({ error: error.message || "Deployment failed" }, { status: 500 });
    }
}
