"use server"

import "server-only";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client/index"; // Import Prisma types

export async function getLiveSignatures() {
  try {
    const signatures = await prisma.signature.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    return signatures.map(sig => ({
      id: Number(sig.id),
      name: sig.name || "Unknown",
      email: sig.email || "",
      mobile: sig.mobile || "",
      idnumber: sig.idnumber || "",
      county: sig.county || "",
      constituency: sig.constituency || "",
      ward: sig.ward || "",
      signature: sig.signature || "", 
      createdAt: sig.createdAt ? sig.createdAt.toISOString() : new Date().toISOString()
    }));
  } catch (error: unknown) {
    // 1. Log the raw error to the server console
    console.error("--- PRISMA DEBUG START ---");
    
    // 2. Safely check if it's a Prisma-specific error
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error("Prisma Error Code:", error.code);
      console.error("Prisma Error Message:", error.message);
      console.error("Prisma Error Meta:", error.meta);
    } else if (error instanceof Error) {
      console.error("Standard Error Message:", error.message);
      console.error("Stack Trace:", error.stack);
    } else {
      console.error("Unknown Error Type:", error);
    }
    
    console.error("--- PRISMA DEBUG END ---");

    throw new Error("Could not connect to the remote database.");
  }
}

export async function deleteSignature(id: number) {
  try {
    await prisma.signature.delete({
      where: { id }
    });
    revalidatePath('/'); 
    return { success: true };
  } catch (error: unknown) {
    console.error("Delete Error:", error instanceof Error ? error.message : "Unknown error");
    return { success: false, error: "Failed to delete record" };
  }
}