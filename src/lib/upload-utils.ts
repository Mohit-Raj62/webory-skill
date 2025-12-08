export const uploadFile = async (
  file: File,
  url: string,
  onProgress?: (progress: number) => void
): Promise<any> => {
  // Check if we should use direct client-side upload (e.g. for videos to bypass limit)
  if (url.includes("/api/upload/video") || file.type.startsWith("video/")) {
    try {
      // 1. Get Signature from Backend
      const sigRes = await fetch("/api/upload/signature", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ folder: "course-videos" }),
      });

      if (!sigRes.ok) throw new Error("Failed to get upload signature");
      const { signature, timestamp, cloudName, apiKey } = await sigRes.json();

      // 2. Upload directly to Cloudinary
      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", apiKey);
      formData.append("timestamp", timestamp.toString());
      formData.append("signature", signature);
      formData.append("folder", "course-videos");
      formData.append("eager", "w_1920,h_1080,c_limit");
      formData.append("eager_async", "true");

      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open(
          "POST",
          `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`
        );

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable && onProgress) {
            const percentComplete = (event.loaded / event.total) * 100;
            onProgress(percentComplete);
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            const response = JSON.parse(xhr.responseText);
            // Normalize response to match expected format
            resolve({
              url: response.secure_url,
              publicId: response.public_id,
              duration: response.duration,
              format: response.format,
              bytes: response.bytes,
            });
          } else {
            reject(new Error("Cloudinary upload failed"));
          }
        };

        xhr.onerror = () => reject(new Error("Network error during upload"));
        xhr.send(formData);
      });
    } catch (error) {
      console.error(
        "Direct upload failed, falling back to server proxy...",
        error
      );
      // Optional: Fallback to original server upload logic if direct fails
      // return originalUploadLogic(file, url, onProgress);
      throw error;
    }
  }

  // Original Logic for non-video / other uploads
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        const percentComplete = (event.loaded / event.total) * 100;
        onProgress(percentComplete);
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText);
          resolve(response);
        } catch (e) {
          reject(new Error("Invalid response format"));
        }
      } else {
        try {
          const error = JSON.parse(xhr.responseText);
          reject(new Error(error.error || "Upload failed"));
        } catch (e) {
          reject(new Error("Upload failed"));
        }
      }
    };

    xhr.onerror = () => {
      reject(new Error("Network error"));
    };

    const formData = new FormData();
    formData.append("file", file);
    xhr.send(formData);
  });
};

// Upload PDF to Cloudinary
export const uploadPDFToCloudinary = async (
  file: File
): Promise<{
  url: string;
  cloudinaryId: string;
  fileName: string;
  fileSize: number;
}> => {
  // Validate file type
  if (file.type !== "application/pdf") {
    throw new Error("Only PDF files are allowed");
  }

  // Validate file size (100MB max)
  const maxSize = 100 * 1024 * 1024; // 100MB in bytes
  if (file.size > maxSize) {
    throw new Error("File size must be less than 100MB");
  }

  console.log("Uploading PDF via internal API...");

  try {
    // Use the internal API route which uses server-side Cloudinary SDK
    // This avoids issues with unsigned presets having restricted access
    const data = await uploadFile(file, "/api/upload/pdf");

    console.log("Upload successful:", data);

    return {
      url: data.url,
      cloudinaryId: data.cloudinaryId,
      fileName: data.fileName,
      fileSize: data.fileSize,
    };
  } catch (error: any) {
    console.error("PDF upload error:", error);
    throw new Error(error.message || "Failed to upload PDF");
  }
};
