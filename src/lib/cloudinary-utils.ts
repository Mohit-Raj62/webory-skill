import cloudinary from "./cloudinary";

/**
 * Extracts the public ID from a Cloudinary URL.
 * Handles URLs with or without version segments and folders.
 *
 * Example:
 * Input: https://res.cloudinary.com/demo/video/upload/v12345678/folder/my_video.mp4
 * Output: folder/my_video
 */
export const extractPublicId = (url: string): string | null => {
  try {
    if (!url || !url.includes("cloudinary.com")) return null;

    // Split by /upload/
    const parts = url.split("/upload/");
    if (parts.length < 2) return null;

    let path = parts[1];

    // Remove version prefix if present (e.g., v123546/)
    if (path.startsWith("v") && /^[vV]\d+\//.test(path)) {
      path = path.replace(/^[vV]\d+\//, "");
    }

    // Remove extension
    const lastDotIndex = path.lastIndexOf(".");
    if (lastDotIndex !== -1) {
      path = path.substring(0, lastDotIndex);
    }

    return path;
  } catch (error) {
    console.error("Error extracting public ID:", error);
    return null;
  }
};

/**
 * Deletes multiple assets from Cloudinary.
 * @param urls Array of full Cloudinary URLs
 * @param resourceType 'image' | 'video' | 'raw'
 */
export const deleteFromCloudinary = async (
  urls: string[],
  resourceType: "image" | "video" | "raw" = "image"
) => {
  try {
    if (!urls || urls.length === 0) return;

    const publicIds = urls
      .map((url) => extractPublicId(url))
      .filter((id) => id !== null) as string[];

    if (publicIds.length === 0) return;

    console.log(
      `Deleting ${publicIds.length} ${resourceType}s from Cloudinary...`,
      publicIds
    );

    // API supports deleting up to 100 resources at once
    const result = await cloudinary.api.delete_resources(publicIds, {
      resource_type: resourceType,
    });

    console.log("Cloudinary deletion result:", result);
    return result;
  } catch (error) {
    console.error("Failed to delete resources from Cloudinary:", error);
    // We generally don't want to throw here to prevent blocking the main operation
  }
};
