import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
export const reportTable = pgTable("vand_report", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at").defaultNow(),
  user: text("user").notNull(),
});

export type InsertReport = typeof reportTable.$inferInsert;
export type SelectReport = typeof reportTable.$inferSelect;
