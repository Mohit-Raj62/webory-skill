import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Skip middleware for API routes - they handle their own auth
  if (path.startsWith("/api/")) {
    return NextResponse.next();
  }

  // Define paths that are public (accessible to everyone)
  const isPublicPath = path === "/login" || path === "/signup";

  // Define paths that are for admins only
  const isAdminPath = path.startsWith("/admin");

  // Define paths that are for teachers only
  const isTeacherPath = path.startsWith("/teacher");

  // Get the token from the cookies
  const token = request.cookies.get("token")?.value || "";

  // Helper to decode JWT payload safely (without external libs)
  const getRoleFromToken = (token: string) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map(function (c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join("")
      );
      return JSON.parse(jsonPayload).role;
    } catch (e) {
      return null;
    }
  };

  // 1. If user has a token and tries to access public paths (login/signup)
  if (isPublicPath && token) {
    const role = getRoleFromToken(token);
    if (role === "admin") {
      return NextResponse.redirect(new URL("/admin", request.nextUrl));
    } else if (role === "teacher") {
      return NextResponse.redirect(new URL("/teacher", request.nextUrl));
    } else {
      return NextResponse.redirect(new URL("/profile", request.nextUrl));
    }
  }

  // 2. If user tries to access admin paths
  if (isAdminPath) {
    // If no token, redirect to login
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.nextUrl));
    }

    // If token exists but not admin, redirect to home
    const role = getRoleFromToken(token);
    if (role !== "admin") {
      return NextResponse.redirect(new URL("/", request.nextUrl));
    }
  }

  // 3. If user tries to access teacher paths
  if (isTeacherPath) {
    // If no token, redirect to login
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.nextUrl));
    }

    // If token exists but not teacher, redirect to home
    const role = getRoleFromToken(token);
    if (role !== "teacher") {
      return NextResponse.redirect(new URL("/", request.nextUrl));
    }
  }

  // Allow the request to continue
  // Allow the request to continue with security headers
  const response = NextResponse.next();

  // Add security headers
  response.headers.set("X-DNS-Prefetch-Control", "on");
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload"
  );
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  // response.headers.set("X-XSS-Protection", "1; mode=block"); // Optional, modern browsers handle this

  return response;
}

// Matching paths - match all paths except API routes and static files
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
