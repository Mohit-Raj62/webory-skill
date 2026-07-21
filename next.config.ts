import type { NextConfig } from "next";
import withPWA from "@ducanh2912/next-pwa";

const nextConfig: NextConfig = {
  /* config options here */
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
  turbopack: {},
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
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  webpack: (config) => {
    // Suppress Webpack warnings from Sentry/OpenTelemetry dynamic requires
    config.ignoreWarnings = [
      ...(config.ignoreWarnings || []),
      { module: /node_modules\/@opentelemetry\/instrumentation/ },
      { module: /node_modules\/@sentry/ },
      /Critical dependency: the request of a dependency is an expression/
    ];
    return config;
  },
};

export default withPWA({
  dest: "public",
  register: true,
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  disable: false,
  workboxOptions: {
    disableDevLogs: true,
    skipWaiting: true,
    clientsClaim: true,
    cleanupOutdatedCaches: true,
    importScripts: ["/custom-sw.js"],
  },
})(nextConfig);
