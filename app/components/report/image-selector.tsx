import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import { useRef } from "react";
import { useNavigate } from "@tanstack/react-router";

export default function ImageSelector() {
  const navigate = useNavigate();
  const fileinput = useRef<HTMLInputElement>(null);

  return (
    <>
      <Button
        onClick={() => fileinput.current?.click()}
        variant="default"
        className="h-14 w-14 rounded-full shadow-lg ring-1 [&_svg]:size-6"
      >
        <Plus />
      </Button>

      <input
        className="hidden"
        ref={fileinput}
        type="file"
        onChange={() =>
          fileinput.current?.files?.[0]
            ? navigate({
                to: "/new",
                state: { file: fileinput.current?.files?.[0] },
              })
            : null
        }
      />
    </>
  );
}
