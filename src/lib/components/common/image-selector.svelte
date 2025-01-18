<script lang="ts">
	import { Plus } from 'lucide-svelte';
	import { Button } from '../ui/button';

	let { onFile }: { onFile: (file: File) => void } = $props();

	let fileinput: HTMLInputElement;

	function handleFileChange(event: Event) {
		const file = (event.target as HTMLInputElement | null)?.files?.[0];
		if (!file) return;

		readFile(file);
	}

	function readFile(file: File) {
		onFile(file);

		const reader = new FileReader();
		// reader.onload = (e: ProgressEvent<FileReader>) => {
		// 	if (!e.target) return;

		// 	const dataUrl = e.target.result;
		// 	dispatch('imageLoaded', { dataUrl });
		// };
		// reader.readAsDataURL(file);
	}
</script>

<Button
	onclick={() => fileinput.click()}
	variant="default"
	class="h-14 w-14 rounded-full shadow-md [&_svg]:size-6"><Plus /></Button
>
<input
	style="display:none"
	type="file"
	accept="image/*"
	bind:this={fileinput}
	onchange={handleFileChange}
/>
