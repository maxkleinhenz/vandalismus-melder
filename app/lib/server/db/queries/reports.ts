import { desc, eq } from "drizzle-orm";
import { db } from "../index";
import { reportTable } from "../schema";

export async function insertReport(userId: string) {
  await db.insert(reportTable).values({
    user: userId,
  });
}

export async function getReports(
  userId: string,
  limit: number,
  offset: number
) {
  const reports = await db
    .select()
    .from(reportTable)
    .where(eq(reportTable.user, userId))
    .orderBy(desc(reportTable.createdAt))
    .limit(limit)
    .offset(offset);
  return reports;
}

export async function getCountReports(userId: string) {
  const count = await db.$count(reportTable, eq(reportTable.user, userId));
  return count;
}
