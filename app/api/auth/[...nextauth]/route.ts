// app/api/auth/[...nextauth]/route.ts
import { handlers } from "@/prisma/auth";
export const { GET, POST } = handlers;