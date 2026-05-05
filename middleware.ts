import { auth } from "@/prisma/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth");
  const isLoginPage = nextUrl.pathname === "/login";

  // 1. Allow API Auth routes to pass through always
  if (isApiAuthRoute) return NextResponse.next();

  // 2. Handle Login Page Logic
  if (isLoginPage) {
    if (isLoggedIn) {
      // If logged in, don't let them see /login, send to dashboard
      return NextResponse.redirect(new URL("/", nextUrl));
    }
    return NextResponse.next();
  }

  // 3. Protect all other routes
  if (!isLoggedIn) {
    // Force absolute URL for Vercel production environment
    const loginUrl = new URL("/login", nextUrl.origin);
    return NextResponse.next(NextResponse.redirect(loginUrl));
  }

  return NextResponse.next();
});

export const config = {
  /*
   * Match all request paths except for the ones starting with:
   * - api (API routes)
   * - _next/static (static files)
   * - _next/image (image optimization files)
   * - favicon.ico, logo.png (public files)
   */
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|logo.png).*)"],
};