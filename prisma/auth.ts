// auth.ts
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // Prisma looks at the 'dashboard_admins' table because of your @@map
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        // If no user found or password field is empty (safety check)
        if (!user || !user.password) return null;

        // Compare the plain text password with the hashed one in MariaDB
        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isPasswordValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  // Use JWT because Prisma adapters with MariaDB can sometimes be 
  // finicky with session persistence in serverless environments
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login", // Custom login page route
  },
});