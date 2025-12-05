export const uploadFile = (
  file: File,
  url: string,
  onProgress?: (progress: number) => void
): Promise<any> => {
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
