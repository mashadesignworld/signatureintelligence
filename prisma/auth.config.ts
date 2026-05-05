import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

// We export this as a plain object WITHOUT the Prisma adapter
export const authConfig = {
  providers: [
    Credentials({
      // We leave authorize empty here because the Middleware doesn't 
      // need to "authorize" users, it just needs to check if a session exists.
      async authorize() {
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth");
      const isLoginPage = nextUrl.pathname === "/login";

      if (isApiAuthRoute) return true;

      if (isLoginPage) {
        if (isLoggedIn) return Response.redirect(new URL("/", nextUrl));
        return true;
      }

      return isLoggedIn;
    },
  },
} satisfies NextAuthConfig;