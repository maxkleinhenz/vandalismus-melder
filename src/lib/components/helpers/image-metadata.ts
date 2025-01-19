import ExifReader from 'exifreader';
import { format } from 'date-fns';

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

export async function getMetaData(image: File): Promise<Metadata> {
	const tags = await ExifReader.load(image);

	console.log(tags);

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
			y: Number(tags.YResolution?.description)
		}
	};
}

function getDateTime(exifDate?: string) {
	if (!exifDate) {
		return format(new Date(), 'yyyy-MM-ddTHH:mm:ss');
	}

	const dateTime = exifDate.split(' ');
	const regex = new RegExp(':', 'g');
	dateTime[0] = dateTime[0].replace(regex, '-');

	return `${dateTime[0]}T${dateTime[1]}`;
	// const date = new Date(Date.parse(`${dateTime[0]}T${dateTime[1]}`));
	// return date.toLocaleDateString(navigator.language, {
	// 	year: 'numeric',
	// 	month: 'numeric',
	// 	day: 'numeric',
	// 	hour: '2-digit',
	// 	minute: '2-digit',
	// 	second: '2-digit'
	// });
}

async function getAddress(lat?: string, lon?: string) {
	if (!lat || !lon) {
		return '';
	}

	const response = await fetch(
		`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
	);
	const nominatimResponse = (await response.json()) as NominatimResponse;

	let road = nominatimResponse.address.road;
	if (nominatimResponse.address.house_number != null) {
		road = road + ' ' + nominatimResponse.address.house_number;
	}

	let city =
		nominatimResponse.address.village ??
		nominatimResponse.address.city ??
		nominatimResponse.address.municipality ??
		nominatimResponse.address.county;

	city = nominatimResponse.address.postcode + ' ' + city;

	return road + ', ' + city;
}
