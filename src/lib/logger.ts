import ActivityLog from "@/models/ActivityLog";
import dbConnect from "@/lib/db";

export const logActivity = async (
  userId: string,
  action: string,
  details: string = "",
  ip: string = "unknown"
) => {
  try {
    await dbConnect(); // Ensure DB connection
    await ActivityLog.create({
      user: userId,
      action,
      details,
      ip,
    });
    console.log(`[ACTIVITY LOG] Saved: ${action} by ${userId}`);
  } catch (error) {
    console.error("[ACTIVITY LOG] Failed to log activity:", error);
    // Don't throw error to avoid breaking main flow
  }
};
