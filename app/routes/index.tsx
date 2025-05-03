import ImageSelector from "@/components/report/image-selector";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <div>
      <div className="fixed bottom-0 right-0 p-4">
        <ImageSelector />
      </div>
    </div>
  );
}
