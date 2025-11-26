import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Define paths that are public (accessible to everyone)
  const isPublicPath = path === "/login" || path === "/signup";

  // Define paths that are for admins only
  const isAdminPath = path.startsWith("/admin");

  // Get the token from the cookies
  const token = request.cookies.get("token")?.value || "";

  // Helper to decode JWT payload safely (without external libs)
  const getRoleFromToken = (token: string) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload).role;
    } catch (e) {
      return null;
    }
  };

  // 1. If user has a token and tries to access public paths (login/signup)
  if (isPublicPath && token) {
    const role = getRoleFromToken(token);
    if (role === 'admin') {
      return NextResponse.redirect(new URL("/admin", request.nextUrl));
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
    if (role !== 'admin') {
      return NextResponse.redirect(new URL("/", request.nextUrl));
    }
  }
}

// Matching paths
export const config = {
  matcher: [
    "/login",
    "/signup",
    "/admin/:path*",
  ],
};
