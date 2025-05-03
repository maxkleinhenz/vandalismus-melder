import { Button } from "../ui/button";
import { Trophy } from "lucide-react";

export default function Highscore() {
  return (
    <Button
      variant="secondary"
      className="rounded-full bg-opacity-70 bg-clip-padding ring-1 ring-slate-600 backdrop-blur-sm backdrop-filter"
    >
      <Trophy /> 42
    </Button>
  );
}
