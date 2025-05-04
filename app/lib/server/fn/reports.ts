import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getCountReports, getReports } from "../db/queries/reports";

const getHighscoreSchema = z.object({
  userId: z.string(),
});

export const fetchHighscore = createServerFn({ method: "GET" })
  .validator((data) => {
    return getHighscoreSchema.parse(data);
  })
  .handler(async ({ data: { userId } }) => {
    return await getCountReports(userId);
  });

export const highscoreQueryOptions = (userId: string) =>
  queryOptions({
    queryKey: ["reports", "highscore", userId],
    queryFn: () => fetchHighscore({ data: { userId } }),
  });

const getReportsSchema = z.object({
  userId: z.string(),
});

export const fetchReports = createServerFn({ method: "GET" })
  .validator((data) => {
    return getReportsSchema.parse(data);
  })
  .handler(async ({ data: { userId } }) => {
    return await getReports(userId, 10, 0);
  });

export const reportsQueryOptions = (userId: string) =>
  queryOptions({
    queryKey: ["reports", userId],
    queryFn: () => fetchReports({ data: { userId } }),
  });
