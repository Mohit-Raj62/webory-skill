import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const url = request.nextUrl.clone();
  const hostname = request.headers.get("host") || "";

    // 1. Wildcard Subdomain Logic (Portfolio & Projects)
    const allowedDomains = ["weboryskills.in", "localhost:3000", "webory.app"];
    const mainDomain = allowedDomains.find((domain) => hostname.endsWith(domain));
  
    if (mainDomain) {
      let subdomain = hostname.replace(`.${mainDomain}`, "").replace(mainDomain, "");
      
      if (subdomain && subdomain !== "www") {
        // Distinguish between Portfolio (username) and Project (username-project)
        // Optimization: If subdomain contains a '-', treat as project PoW
        if (subdomain.includes("-")) {
          url.pathname = `/project/${subdomain}${path === "/" ? "" : path}`;
        } else {
          url.pathname = `/portfolio/${subdomain}${path === "/" ? "" : path}`;
        }

        const response = NextResponse.rewrite(url);
        response.headers.set("X-DNS-Prefetch-Control", "on");
        response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
        response.headers.set("X-Content-Type-Options", "nosniff");
        response.headers.set("X-Frame-Options", "SAMEORIGIN");
        return response;
      }
    }

  // 2. Original Auth/Proxy Logic
  if (path.startsWith("/api/")) {
    return NextResponse.next();
  }

  const isPublicPath = path === "/login" || path === "/signup";
  const isAdminPath = path.startsWith("/admin");
  const isTeacherPath = path.startsWith("/teacher");

  const token = request.cookies.get("token")?.value || "";

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

  if (isAdminPath) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.nextUrl));
    }
    const role = getRoleFromToken(token);
    if (role !== "admin") {
      return NextResponse.redirect(new URL("/", request.nextUrl));
    }
  }

  if (isTeacherPath) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.nextUrl));
    }
    const role = getRoleFromToken(token);
    if (role !== "teacher") {
      return NextResponse.redirect(new URL("/", request.nextUrl));
    }
  }

  const response = NextResponse.next();
  response.headers.set("X-DNS-Prefetch-Control", "on");
  response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "SAMEORIGIN");

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
