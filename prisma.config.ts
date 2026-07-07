import { config } from "dotenv";
import { defineConfig, env } from "prisma/config";

config({ path: ".env.local" });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // If the provider needs a separate non-pooled connection for migrations
    // (e.g. Neon), point DIRECT_URL at it and set this to env("DIRECT_URL").
    url: env("DATABASE_URL"),
  },
});
