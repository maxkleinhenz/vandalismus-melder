<script lang="ts">
	import { page } from '$app/state';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import ImageCanvas from '@/components/image/image-canvas.svelte';
	import { trpc } from '@/trpc/client';
	import { Clock, Flag, Plus, Trash2 } from 'lucide-svelte';
	import { defaults, superForm } from 'sveltekit-superforms';
	import { zod, zodClient } from 'sveltekit-superforms/adapters';
	import { z } from 'zod';
	import { getMetaData, type Metadata } from '../helpers/image-metadata';
	import { Button } from '../ui/button';
	import { Input } from '../ui/input';
	import { Label } from '../ui/label';
	import { Textarea } from '../ui/textarea';

	let selectedFile = $state<File | undefined>(undefined);
	let metadata = $state<unkown | undefined>(undefined);

	let fileinput: HTMLInputElement;

	const formSchema = z.object({
		dataUrl: z.string().url({ message: 'Bitte wähle ein Bild aus.' }),
		dateTime: z.string({ message: 'Bitte wähle ein Datum aus.' }),
		address: z
			.string()
			.min(3, { message: 'Bitte gib eine Adresse ein.' })
			.max(100, { message: 'Die Adresse darf maximal 100 Zeichen lang sein.' })
	});
	const form = superForm(defaults(zod(formSchema)), {
		SPA: true,
		validators: zodClient(formSchema),
		resetForm: false
	});
	const { form: formData, enhance, validateForm, errors } = form;

	async function handleFileChange(event: Event) {
		selectedFile = undefined;
		metadata = undefined;

		const file = (event.target as HTMLInputElement | null)?.files?.[0];
		if (!file) return;

		metadata = await getMetaData(file);
		// formData.set({ dataUrl: '', dateTime: metadata.date ?? '', address: metadata.address ?? '' });
		// formData.subscribe((v) => {
		// 	if (!metadata) return;
		// 	metadata.date = v.dateTime;
		// 	metadata.address = v.address;
		// });

		selectedFile = file;
	}

	async function upload() {
		const result = await validateForm();

		if (!result.valid) {
			errors.update((v) => {
				return {
					...v,
					dataUrl: result.errors.dataUrl,
					dateTime: result.errors.dateTime,
					address: result.errors.address
				};
			});

			return;
		}

		const upload = {
			dataUrl: result.data.dataUrl,
			date: result.data.dateTime,
			address: result.data.address
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
	<form method="POST" use:enhance>
		<Dialog.Content class="max-h-dvh rounded-md p-4 sm:max-w-[425px]">
			<Dialog.Header>
				<Dialog.Title>Vandalismus melden</Dialog.Title>
				<Dialog.Description>Melde jetzt ein zerstörtes Plakat.</Dialog.Description>
			</Dialog.Header>
			<!-- <ScrollArea class="h-5/6"> -->
			<div class="grid gap-4 overflow-auto">
				<!-- <Form.Field {form} name="dataUrl">
					<Form.Control>
						{#snippet children({ props })}
							{#if selectedFile && metadata}
								<ImageCanvas
									bind:image={selectedFile}
									bind:metadata
									onFinishedImage={(i) => ($formData.dataUrl = i)}
								/>
							{/if}
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field> -->
				<pre>{JSON.stringify(metadata, null, 2)}</pre>

				<!-- <Form.Field {form} name="dateTime" class="px-2">
					<Form.Control>
						{#snippet children({ props })}
							<Label for="date" class="">Datum</Label>
							<Input {...props} type="datetime-local" bind:value={$formData.dateTime} />
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field {form} name="address" class="px-2 pb-2">
					<Form.Control>
						{#snippet children({ props })}
							<Label for="address" class="">Adresse</Label>
							<Textarea {...props} id="address" bind:value={$formData.address} />
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field> -->

				<!-- {#if selectedFile && metadata}
				<ImageCanvas
					bind:image={selectedFile}
					bind:metadata
					onFinishedImage={(i) => (finishedImage = i)}
				/>
				<img src={URL.createObjectURL(selectedFile)} alt="Preview" class="" />

				<div class="grid gap-2 px-2"></div>
				<div class="grid gap-2 px-2 pb-2">
					<Label for="address" class="">Adresse</Label>
					<Textarea id="address" bind:value={metadata.address} />
				</div>
			{/if} -->
			</div>
			<Dialog.Footer class="flex flex-wrap gap-2 p-2">
				<Form.Button type="reset" variant="ghost" size="icon"><Trash2 /></Form.Button>
				<Form.Button type="submit" variant="secondary"><Clock /> Später melden</Form.Button>
				<Form.Button type="submit" onclick={upload}><Flag /> Jetzt melden</Form.Button>
			</Dialog.Footer>
		</Dialog.Content>
	</form>
</Dialog.Root>
