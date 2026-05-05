// app/seed.ts
import { prisma } from "../lib/prisma"; // IMPORT your existing instance
import bcrypt from "bcryptjs";

async function main() {
  const hashedPassword = await bcrypt.hash("bob2026", 10);
  
  console.log("Connecting to signatures.freekenya.co.ke...");

  const admin = await prisma.user.upsert({
    where: { email: "admin@signatures.com" },
    update: {},
    create: {
      email: "admin@signatures.com",
      name: "Admin User",
      password: hashedPassword,
    },
  });

  console.log("Admin user created successfully:", admin.email);
}

main()
  .catch((e) => {
    console.error("Seeding Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });