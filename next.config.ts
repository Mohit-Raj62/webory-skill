import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  experimental: {
    serverActions: {
      bodySizeLimit: "50mb",
    },
    serverComponentsExternalPackages: [
      "tesseract.js",
      "pyodide",
      "pdfjs-dist",
      "mongoose",
      "canvas",
      "sharp",
    ],
  },
  outputFileTracingExcludes: {
    "api/**/*": [
      "**/node_modules/tesseract.js/**/*",
      "**/node_modules/pyodide/**/*",
      "**/node_modules/pdfjs-dist/**/*",
    ],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;
