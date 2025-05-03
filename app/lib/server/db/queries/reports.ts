import { eq } from "drizzle-orm";
import { db } from "../index";
import { reportTable } from "../schema";

export async function insertReport(userId: string) {
  await db.insert(reportTable).values({
    user: userId,
  });
}

export async function getCountReports(userId: string) {
  const count = await db.$count(reportTable, eq(reportTable.user, userId));
  return count;
}
