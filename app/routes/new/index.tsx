import ImageCanvas from "@/components/report/image-canvas";
import { getMetaData } from "@/components/report/useMetadata";
import useUserId from "@/components/report/useUserId";
import { Button } from "@/components/ui/button";
import { insertReport } from "@/lib/server/db/queries/reports";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Navigate, Router } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { format, set } from "date-fns";
import { useState } from "react";
import sanitize from "sanitize-filename";
import { z } from "zod";
import { zfd } from "zod-form-data";

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg"]; // 'image/jpeg', 'image/png', 'image/webp'

const uploadSchema = zfd.formData({
  userId: zfd.text(),
  dataUrl: zfd.text().refine((dataUrl) => {
    const type = dataUrl.substring(
      dataUrl.indexOf(":") + 1,
      dataUrl.indexOf(";")
    );
    // const size = Buffer.from(dataUrl.split(',')[1], 'base64');

    // const base64Response = await fetch(dataUrl);
    // const blob = await base64Response.blob();
    // const file = new File([blob], 'file');
    // console.log('file', file.type);
    return ACCEPTED_IMAGE_TYPES.includes(type);
  }),
  date: zfd.text().pipe(z.coerce.date()),
  address: zfd.text().optional(),
});

export const uploadImage = createServerFn({
  method: "POST",
  response: "data",
})
  .validator((data) => {
    return uploadSchema.parse(data);
  })
  .handler(async ({ data: { userId, dataUrl, date, address } }) => {
    const resp = await fetch(dataUrl);
    const blob = await resp.blob();

    const file = new File([blob], "file");
    const filename = sanitize(
      `${format(date, "yyyy-MM-dd_HH-mm-ss")}_${address}.jpg`
    );

    const response = await fetch(
      `https://cloud.rote.tools/public.php/webdav/${filename}`,
      {
        method: "PUT",
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          Authorization: `Basic ${btoa(process.env.FILE_DROP_KEY + ":")}`,
        },
        body: file,
      }
    );

    console.log("response", response.ok);
    if (response.ok) {
      insertReport(userId);
    }

    return response.status;
  });

export const Route = createFileRoute("/new/")({
  component: RouteComponent,
  loader: async ({ location }) => {
    const file = location.state.file;
    if (!file) {
      throw new Error("No file provided");
    }
    const metadata = await getMetaData(file);
    return {
      file: file,
      metadata: metadata,
    };
  },
  errorComponent: () => Navigate({ to: "/" }),
  pendingComponent: () => <div>Loading...</div>,
});

function RouteComponent() {
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const data = Route.useLoaderData();
  const queryClient = useQueryClient();

  const userId = useUserId();

  const mutation = useMutation({
    mutationFn: async (formdata: FormData) => {
      const resp = await uploadImage({ data: formdata });
      return resp;
    },
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: ["reports"],
      });
    },
    mutationKey: ["reports"],
  });

  return (
    <div className="max-w-[300px] mx-auto">
      <ImageCanvas
        file={data.file}
        metadata={data.metadata}
        onFinishedImage={(i) => setDataUrl(i)}
      />
      <Button
        onClick={async () => {
          if (!dataUrl) {
            return;
          }
          const formData = new FormData();
          formData.append("userId", userId);
          formData.append("dataUrl", dataUrl);
          formData.append("date", data.metadata.date.toString());
          formData.append("address", data.metadata.address || "");
          mutation.mutate(formData);
        }}
      >
        Upload
      </Button>
      {mutation.isPending && <div>Loading...</div>}
      {mutation.isSuccess && (
        <div>
          <div>Success!</div>
          <div>{mutation.data}</div>
        </div>
      )}
    </div>
  );
}
