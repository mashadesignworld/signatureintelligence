import { PrismaClient } from "@prisma/client/index";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";


const prismaClientSingleton = () => {
  // Pass the configuration object DIRECTLY to the adapter
  const adapter = new PrismaMariaDb({
    host: 'signatures.freekenya.co.ke',
    port: 3306,
    user: 'freeken1_sign',
    password: 'gr@mmat0n',
    database: 'freeken1_signatures',
    connectionLimit: 1, // Stay at 1 to prevent shared hosting blocks
    connectTimeout: 10000, // 10 seconds to allow for remote handshake
  });

  return new PrismaClient({ 
    adapter,
    log: ['query', 'error', 'warn'] 
  });
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;