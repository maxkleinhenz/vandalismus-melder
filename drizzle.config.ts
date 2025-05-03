import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./app/lib/server/db/schema.ts",
  out: "./migrations",
  dialect: "postgresql",
  tablesFilter: ["vand_*"],
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
