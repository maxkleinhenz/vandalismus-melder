<script lang="ts">
	import { Clock, Flag, Plus, Trash2 } from 'lucide-svelte';
	import { Button } from '../ui/button';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Label } from '../ui/label';
	import { Input } from '../ui/input';
	import { Textarea } from '../ui/textarea';
	import { getMetaData, type Metadata } from '../helpers/image-metadata';
	import ImageCanvas from '@/components/image/image-canvas.svelte';
	import { trpc } from '@/trpc/client';
	import { page } from '$app/state';

	let selectedFile = $state<File | undefined>(undefined);
	let metadata = $state<Metadata | undefined>(undefined);
	let finishedImage = $state<string | undefined>(undefined);

	let fileinput: HTMLInputElement;
	// let isDesktop = false;

	async function handleFileChange(event: Event) {
		selectedFile = undefined;
		metadata = undefined;

		const file = (event.target as HTMLInputElement | null)?.files?.[0];
		if (!file) return;

		metadata = await getMetaData(file);
		selectedFile = file;
	}

	async function upload() {
		if (!finishedImage || !metadata?.date || !metadata.address) return;

		const upload = {
			dataUrl: finishedImage,
			date: metadata.date,
			address: metadata.address ?? ''
		};

		await trpc(page).uploadReport.mutate(upload);
	}
</script>

<Button
	onclick={() => fileinput.click()}
	variant="default"
	class="h-14 w-14 rounded-full shadow-lg ring-1 ring-slate-300 [&_svg]:size-6"><Plus /></Button
>
<input
	style="display:none"
	type="file"
	accept="image/*"
	bind:this={fileinput}
	onchange={handleFileChange}
/>

<Dialog.Root open={!!selectedFile}>
	<Dialog.Content class="max-h-dvh rounded-md p-4 sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>Vandalismus melden</Dialog.Title>
			<Dialog.Description>Melde jetzt ein zerstörtes Plakat.</Dialog.Description>
		</Dialog.Header>
		<!-- <ScrollArea class="h-5/6"> -->
		<div class="grid gap-4 overflow-auto">
			{#if selectedFile && metadata}
				<ImageCanvas
					bind:image={selectedFile}
					bind:metadata
					onFinishedImage={(i) => (finishedImage = i)}
				/>
				<!-- <img src={URL.createObjectURL(selectedFile)} alt="Preview" class="" /> -->

				<div class="grid gap-2 px-2">
					<Label for="date" class="">Datum</Label>
					<Input id="date" type="datetime-local" bind:value={metadata.date} />
				</div>
				<div class="grid gap-2 px-2 pb-2">
					<Label for="address" class="">Adresse</Label>
					<Textarea id="address" bind:value={metadata.address} />
				</div>
			{/if}
		</div>
		<Dialog.Footer class="flex flex-wrap gap-2 p-2">
			<Button type="reset" variant="ghost" size="icon"><Trash2 /></Button>
			<Button type="submit" variant="secondary"><Clock /> Später melden</Button>
			<Button type="submit" onclick={upload}><Flag /> Jetzt melden</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
