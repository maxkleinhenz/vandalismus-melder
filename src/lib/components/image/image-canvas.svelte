<script lang="ts">
	import { type Metadata } from '../helpers/image-metadata';
	import { onMount } from 'svelte';

	const maxHeight = 1600;
	const maxWidth = 1200;
	const defaultFontsize = 48;

	let {
		image = $bindable(),
		metadata = $bindable(),
		onFinishedImage
	}: {
		image: File;
		metadata: Metadata;
		onFinishedImage: (dataUrl: string) => void;
	} = $props();

	let canvas = $state<HTMLCanvasElement>();
	let ctx = $state<CanvasRenderingContext2D | null>();
	let bitmap = $state<ImageBitmap | undefined>();
	let bitmapSize = $derived.by(() => {
		if (!bitmap) return { width: 0, height: 0 };

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

		// const width = bitmap.width;
		// const height = bitmap.height;

		// if (width <= maxWidth && height <= maxHeight) {
		// 	return { width, height };
		// }

		// const ratio = Math.min(maxWidth / width, maxHeight / height);
		// return { width: width * ratio, height: height * ratio };
	});

	onMount(() => {
		if (!canvas) return;
		ctx = canvas.getContext('2d', { alpha: false });
	});

	$effect(() => {
		if (!ctx) return;

		createImageBitmap(image).then((b) => {
			bitmap = b;
		});
	});

	$effect(() => {
		if (!ctx || !bitmap || !metadata) return;

		ctx!.canvas.width = bitmapSize.width;
		ctx!.canvas.height = bitmapSize.height;

		ctx.clearRect(0, 0, bitmapSize.width, bitmapSize.height);

		ctx.drawImage(bitmap, 0, 0, bitmapSize.width, bitmapSize.height);

		const fontRatio = defaultFontsize / bitmapSize.width;
		const fontSize = bitmapSize.width * fontRatio;
		const lineheight = fontSize * 1.5;

		const addressArr = metadata.address ? metadata.address.split('\n') : undefined;
		const lines = 1 + (addressArr?.length ?? 0);
		const yStart = bitmapSize.height - lines * lineheight;

		ctx.fillStyle = 'white';
		ctx.beginPath();
		ctx.rect(0, yStart, bitmapSize.width, bitmapSize.height);
		ctx.fill();

		const xTextStart = 0.3 * lineheight;
		const yTextStart = yStart + lineheight;
		ctx.textAlign = 'start';
		ctx.textBaseline = 'bottom';
		ctx.font = fontSize + 'px serif';
		ctx.fillStyle = 'black';
		if (metadata.date) {
			const date = new Date(Date.parse(metadata.date)).toLocaleDateString('de-DE', {
				day: '2-digit',
				month: '2-digit',
				year: 'numeric',
				hour: '2-digit',
				minute: '2-digit'
			});
			ctx.fillText(date, xTextStart, yTextStart);
		}

		addressArr?.forEach((line, i) => {
			ctx?.fillText(line, xTextStart, yTextStart + (i + 1) * lineheight);
		});

		onFinishedImage(ctx.canvas.toDataURL('image/jpeg', 1));
	});
</script>

<canvas bind:this={canvas} id="canvas" class="w-full"></canvas>
