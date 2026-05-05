import NextAuth from "next-auth";
import { authConfig } from "@/prisma/auth.config";

// Use the lightweight config for the Edge Runtime
export default NextAuth(authConfig).auth;

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|logo.png).*)"],
};