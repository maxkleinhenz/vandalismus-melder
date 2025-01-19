<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Clock, Flag, Plus, Trash2 } from 'lucide-svelte';
	import { getMetaData, type Metadata } from '../helpers/image-metadata';
	import { Button } from '../ui/button';

	let { onFile }: { onFile: (file: File) => void } = $props();

	let selectedFile = $state<File | undefined>(undefined);
	let metadata = $state<Metadata>({});

	let fileinput: HTMLInputElement;
	// let isDesktop = false;

	async function handleFileChange(event: Event) {
		selectedFile = undefined;
		metadata = {};

		const file = (event.target as HTMLInputElement | null)?.files?.[0];
		if (!file) return;

		// onFile(file);

		metadata = await getMetaData(file);
		selectedFile = file;
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

{#if !!selectedFile}
	<!-- {#if isDesktop} -->
	<Dialog.Root open={true}>
		<Dialog.Content class="m-2 max-h-dvh rounded-md p-4 sm:max-w-[425px]">
			<Dialog.Header>
				<Dialog.Title>Vandalismus melden</Dialog.Title>
				<Dialog.Description>Melde jetzt ein zerstörtes Plakat.</Dialog.Description>
			</Dialog.Header>
			<!-- <ScrollArea class="h-5/6"> -->
			<div class="grid gap-4 overflow-auto p-2">
				<img src={URL.createObjectURL(selectedFile)} alt="Preview" class="" />

				<div class="grid gap-2">
					<Label for="date" class="">Datum</Label>
					<Input id="date" type="datetime-local" bind:value={metadata.date} />
				</div>
				<div class="grid gap-2">
					<Label for="address" class="">Adresse</Label>
					<Textarea id="address" bind:value={metadata.address} />
				</div>
			</div>
			<!-- </ScrollArea> -->
			<Dialog.Footer class="flex flex-wrap gap-2 p-2">
				<Button type="reset" variant="ghost" size="icon"><Trash2 /></Button>
				<Button type="submit" variant="secondary"><Clock /> Später melden</Button>
				<Button type="submit"><Flag /> Jetzt melden</Button>
			</Dialog.Footer>
		</Dialog.Content>
	</Dialog.Root>
	<!-- {:else}
		<Drawer.Root open={true}>
			<Drawer.Content>
				<Drawer.Header>
					<Drawer.Title>Vandalismus melden</Drawer.Title>
					<Drawer.Description>
						Make changes to your profile here. Click save when you're done.
					</Drawer.Description>
				</Drawer.Header>
				<div class="grid gap-4 py-4">
					<img src={URL.createObjectURL(selectedFile)} alt="Preview" />

					<div class="grid gap-2">
						<Label for="date" class="">Datum</Label>
						<Input id="date" type="datetime-local" bind:value={metadata.date} />
					</div>
					<div class="grid gap-2">
						<Label for="address" class="">Adresse</Label>
						<Input id="address" bind:value={metadata.address} />
					</div>
				</div>
				<Drawer.Footer class="pt-2">
					<Drawer.Close>Cancel</Drawer.Close>
				</Drawer.Footer>
			</Drawer.Content>
		</Drawer.Root>
	{/if} -->
{/if}
