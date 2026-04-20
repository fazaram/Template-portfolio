import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Provide a random fallback URL for the generation step on Vercel
    url: process.env.DATABASE_URL || "postgresql://postgres:password@localhost:5432/postgres",
  },
});
