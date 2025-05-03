import { useEffect, useRef } from "react";
import { Metadata } from "./useMetadata";

const maxHeight = 1600;
const maxWidth = 1200;
const defaultFontsize = 48;

export type ImageCanvasProps = {
  file: File;
  metadata: Metadata;
  onFinishedImage: (dataUrl: string) => void;
};

function bitmapSize(bitmap: ImageBitmap) {
  var width = bitmap.width;
  var height = bitmap.height;
  // Calculate the new dimensions, maintaining the aspect ratio
  if (width > height) {
    if (width > maxWidth) {
      height *= maxWidth / width;
      width = maxWidth;
    }
  } else {
    if (height > maxHeight) {
      width *= maxHeight / height;
      height = maxHeight;
    }
  }

  return { width, height };
}

export default function ImageCanvas(props: ImageCanvasProps) {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const ctx = canvas.current?.getContext("2d");
    if (!ctx) {
      return;
    }
    createImageBitmap(props.file).then((bitmap) => {
      const size = bitmapSize(bitmap);

      ctx!.canvas.width = size.width;
      ctx!.canvas.height = size.height;

      ctx.clearRect(0, 0, size.width, size.height);

      ctx.drawImage(bitmap, 0, 0, size.width, size.height);

      const fontRatio = defaultFontsize / size.width;
      const fontSize = size.width * fontRatio;
      const lineheight = fontSize * 1.5;

      const addressArr = props.metadata.address
        ? props.metadata.address.split("\n")
        : undefined;
      const lines = 1 + (addressArr?.length ?? 0);
      const yStart = size.height - lines * lineheight;

      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.rect(0, yStart, size.width, size.height);
      ctx.fill();

      const xTextStart = 0.3 * lineheight;
      const yTextStart = yStart + lineheight;
      ctx.textAlign = "start";
      ctx.textBaseline = "bottom";
      ctx.font = fontSize + "px serif";
      ctx.fillStyle = "black";
      if (props.metadata.date) {
        const date = new Date(
          Date.parse(props.metadata.date)
        ).toLocaleDateString("de-DE", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
        ctx.fillText(date, xTextStart, yTextStart);
      }

      addressArr?.forEach((line, i) => {
        ctx?.fillText(line, xTextStart, yTextStart + (i + 1) * lineheight);
      });

      props.onFinishedImage(ctx.canvas.toDataURL("image/jpeg", 1));
    });
  }, [canvas, props.file]);

  return <canvas ref={canvas} id="canvas" className="w-full"></canvas>;
}
