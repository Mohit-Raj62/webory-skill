import type { NextConfig } from "next";
import withPWA from "@ducanh2912/next-pwa";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  serverExternalPackages: [
    "tesseract.js",
    "pyodide",
    "pdfjs-dist",
    "mongoose",
    "canvas",
    "sharp",
  ],
  experimental: {
    serverActions: {
      bodySizeLimit: "50mb",
    },
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

export default withPWA({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  disable: false,
  workboxOptions: {
    disableDevLogs: true,
  },
})(nextConfig);
