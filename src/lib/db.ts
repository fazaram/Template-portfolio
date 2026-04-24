import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

// In Next.js, process.env is automatically populated from .env files.
const connectionString = `${process.env.DATABASE_URL}`;

const pool = new pg.Pool({ 
  connectionString,
  // Supabase and other cloud providers often require SSL.
  // rejectUnauthorized: false is common for self-signed or non-standard certs.
  ssl: connectionString.includes("supabase.co") ? { rejectUnauthorized: false } : undefined
});

const adapter = new PrismaPg(pool);

const prismaClientSingleton = () => {
  return new PrismaClient({
    adapter,
    log: ["query"],
  });
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;