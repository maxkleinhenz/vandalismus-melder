import { highscoreQueryOptions } from "@/lib/server/fn/reports";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Trophy } from "lucide-react";
import useUserId from "../report/useUserId";
import { Button } from "../ui/button";

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
