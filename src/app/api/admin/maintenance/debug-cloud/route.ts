import cloudinary from "@/lib/cloudinary";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const rootFolders: any = await cloudinary.api.root_folders();
    // Also list resources in the root folder (no prefix)
    const rootResources: any = await cloudinary.api.resources({
      type: "upload",
      max_results: 50, // Increased limit
    });

    // List subfolders of known folders if they exist
    let details: any = {};
    if (rootFolders.folders) {
      for (const f of rootFolders.folders) {
        try {
          const sub = await cloudinary.api.resources({
            type: "upload",
            prefix: f.name,
            max_results: 50, // Increased limit
          });
          details[f.name] = sub.resources;
        } catch (e) {}
      }
    }

    return NextResponse.json({
      rootFolders: rootFolders,
      rootResources: rootResources.resources, // Send all details
      details,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
