const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const publicId = "resumes/1771448358748-real_dummy";
const url = cloudinary.url(publicId, {
  resource_type: "image",
  format: "pdf",
  sign_url: true,
  type: "authenticated", // authenticated type needs signature?
  // actually if it's 'upload' type but restricted, usually standard signature works?
  // Let's try type: 'upload' + sign_url first.
});

console.log("Signed URL (upload):", url);

// Also try authenticated type just in case
const urlAuth = cloudinary.url(publicId, {
  resource_type: "image",
  format: "pdf",
  sign_url: true,
  type: "authenticated",
});
console.log("Signed URL (authenticated):", urlAuth);
