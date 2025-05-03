import { getCountReports } from "@/lib/server/db/queries/reports";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { Trophy } from "lucide-react";
import { z } from "zod";
import useUserId from "../report/useUserId";
import { Button } from "../ui/button";

const highscoreSchema = z.object({
  userId: z.string(),
});

const fetchHighscore = createServerFn({ method: "GET" })
  .validator((data) => {
    console.log("data", data);
    return highscoreSchema.parse(data);
  })
  .handler(async ({ data: { userId } }) => {
    return await getCountReports(userId);
  });

export const highscoreQueryOptions = (userId: string) =>
  queryOptions({
    queryKey: ["highscore", userId],
    queryFn: () => fetchHighscore({ data: { userId } }),
  });

export default function Highscore() {
  const userId = useUserId();
  const highscoreQuery = useSuspenseQuery(highscoreQueryOptions(userId));

  return (
    <Button
      variant="secondary"
      className="rounded-full bg-opacity-70 bg-clip-padding ring-1 ring-slate-600 backdrop-blur-sm backdrop-filter"
    >
      <Trophy /> {highscoreQuery.data}
    </Button>
  );
}
