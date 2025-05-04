import ImageSelector from "@/components/report/image-selector";
import useUserId from "@/components/report/useUserId";
import { reportsQueryOptions } from "@/lib/server/fn/reports";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Home,
});

const dateFormatter = new Intl.DateTimeFormat(navigator.language, {
  dateStyle: "short",
  timeStyle: "short",
});

function Home() {
  const userId = useUserId();
  const highscoreQuery = useSuspenseQuery(reportsQueryOptions(userId));

  return (
    <div>
      <div className="grid gap-4 p-4">
        {highscoreQuery.data.map((report) => (
          <div key={report.id} className="p-4 bg-white rounded-lg shadow-md">
            Meldung am {dateFormatter.format(report.createdAt)}
          </div>
        ))}
      </div>
      <div className="fixed bottom-0 right-0 p-4">
        <ImageSelector />
      </div>
    </div>
  );
}
