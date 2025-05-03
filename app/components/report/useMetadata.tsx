import ExifReader from "exifreader";
import { format } from "date-fns";
import { useEffect, useState } from "react";

type NominatimResponse = {
  address: {
    house_number?: string;
    road: string;
    neighbourhood?: string;
    suburb?: string;
    city_district?: string;
    village?: string;
    municipality?: string;
    city?: string;
    county?: string;
    postcode: string;
  };
};

export type Metadata = {
  date?: string;
  address?: string;
  resolution: {
    x: number;
    y: number;
  };
};

function getDateTime(exifDate?: string) {
  if (!exifDate) {
    const now = new Date();
    const date = format(now, "yyyy-MM-dd");
    const time = format(now, "HH:mm:ss");
    return `${date}T${time}`;
  }

  const dateTime = exifDate.split(" ");
  const regex = new RegExp(":", "g");
  dateTime[0] = dateTime[0].replace(regex, "-");

  return `${dateTime[0]}T${dateTime[1]}`;
}

async function getAddress(lat?: string, lon?: string) {
  if (!lat || !lon) {
    return "";
  }

  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
  );
  const nominatimResponse = (await response.json()) as NominatimResponse;

  let road = nominatimResponse.address.road;
  if (nominatimResponse.address.house_number != null) {
    road = road + " " + nominatimResponse.address.house_number;
  }

  let city =
    nominatimResponse.address.village ??
    nominatimResponse.address.city ??
    nominatimResponse.address.municipality ??
    nominatimResponse.address.county;

  city = nominatimResponse.address.postcode + " " + city;

  return road + ", " + city;
}

export async function getMetaData(file: File) {
  const tags = await ExifReader.load(file);

  const exifDate = tags.DateTimeOriginal?.description;
  const date = getDateTime(exifDate);

  const lat = tags.GPSLatitude?.description;
  const lon = tags.GPSLongitude?.description;

  const address = await getAddress(lat, lon);
  return {
    date: date,
    address: address,
    resolution: {
      x: Number(tags.XResolution?.description),
      y: Number(tags.YResolution?.description),
    },
  };
}

export default function useMetadata(image?: File) {
  const [metadata, setMetadata] = useState<Metadata>();

  useEffect(() => {
    setMetadata(undefined);
    if (!image) {
      return;
    }

    getMetaData(image).then((metadata) => {
      console.log(metadata);
      setMetadata(metadata);
    });
  }, [image]);

  return { metadata };
}
