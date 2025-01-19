<script lang="ts">
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Textarea } from '$lib/components/ui/textarea';
	import { onMount } from 'svelte';
	import type { Metadata } from './helpers/image-metadata';

	let { image, metadata }: { image: File; address?: string; metadata: Metadata } = $props();
	let canvas = $state<HTMLCanvasElement>();
	let ctx = $state<CanvasRenderingContext2D | null>();
	let bitmap = $state<ImageBitmap>();
	let fontSize = $state<number>(0);
	let lineheight = $state<number>(0);

	onMount(async () => {
		if (!canvas) return;

		ctx = canvas.getContext('2d');
		bitmap = await createImageBitmap(image);
		const width = bitmap.width;
		const height = bitmap.height;

		canvas.width = width;
		canvas.height = height;
		if (!ctx) return;

		console.log(metadata);
		const defaultFontsize = 1.5 * (isNaN(metadata.resolution.x) ? 72 : metadata.resolution.x);
		const fontRatio = defaultFontsize / width;
		fontSize = width * fontRatio;
		lineheight = fontSize * 1.5;
	});

	$effect(() => {
		if (!ctx) return;

		const width = ctx.canvas.width;
		const height = ctx.canvas.height;

		ctx.clearRect(0, 0, width, height);

		if (bitmap) {
			ctx.drawImage(bitmap, 0, 0, width, height);
		}

		const addressArr = metadata.address ? metadata.address.split('\n') : undefined;
		console.log(metadata.address);
		const lines = 1 + (addressArr?.length ?? 0);
		const yStart = height - lines * lineheight;

		console.log(fontSize, lines, lines * lineheight);

		ctx.fillStyle = 'black';
		ctx.beginPath();
		ctx.rect(0, yStart, width, height);
		ctx.fill();

		const xTextStart = 0.3 * lineheight;
		const yTextStart = yStart + lineheight;
		ctx.textAlign = 'start';
		ctx.textBaseline = 'bottom';
		ctx.font = fontSize + 'px serif';
		ctx.fillStyle = 'white';
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
	});
</script>

<canvas bind:this={canvas} id="canvas" class="w-full"></canvas>
<!-- <img src={URL.createObjectURL(selectedFile)} alt="Preview" class="" /> -->

<div class="grid gap-2 px-2">
	<Label for="date" class="">Datum</Label>
	<Input id="date" type="datetime-local" bind:value={metadata.date} />
</div>
<div class="grid gap-2 px-2 pb-2">
	<Label for="address" class="">Adresse</Label>
	<Textarea id="address" bind:value={metadata.address} />
</div>
