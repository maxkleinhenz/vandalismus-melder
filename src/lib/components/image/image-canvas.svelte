<script lang="ts">
	import { type Metadata } from '../helpers/image-metadata';
	import { onMount } from 'svelte';

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
	let bitmapWidth = $derived(bitmap?.width ?? 0);
	let bitmapHeight = $derived(bitmap?.height ?? 0);

	onMount(() => {
		if (!canvas) return;
		ctx = canvas.getContext('2d');
	});

	$effect(() => {
		if (!ctx) return;

		createImageBitmap(image).then((b) => {
			bitmap = b;
			const width = bitmap?.width;
			const height = bitmap?.height;
			ctx!.canvas.width = width;
			ctx!.canvas.height = height;
		});
	});

	$effect(() => {
		if (!ctx || !bitmap || !metadata) return;

		ctx.clearRect(0, 0, bitmapWidth, bitmapHeight);

		ctx.drawImage(bitmap, 0, 0, bitmapWidth, bitmapHeight);

		const defaultFontsize = 1.5 * (isNaN(metadata.resolution.x) ? 72 : metadata.resolution.x);
		const fontRatio = defaultFontsize / bitmapWidth;
		const fontSize = bitmapWidth * fontRatio;
		const lineheight = fontSize * 1.5;

		const addressArr = metadata.address ? metadata.address.split('\n') : undefined;
		const lines = 1 + (addressArr?.length ?? 0);
		const yStart = bitmapHeight - lines * lineheight;

		ctx.fillStyle = 'white';
		ctx.beginPath();
		ctx.rect(0, yStart, bitmapWidth, bitmapHeight);
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
