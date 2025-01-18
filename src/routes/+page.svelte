<script lang="ts">
	import HighscoreBadge from '@/components/common/highscore-badge.svelte';
	import ImageSelector from '@/components/common/image-selector.svelte';
	import ImageUploader from '@/components/common/image-uploader.svelte';

	let files = $state([] as File[]);

	// const loadData = async () => {
	// 	loading = true;
	// 	greeting = await trpc(page).greeting.query();
	// 	loading = false;
	// };
</script>

<HighscoreBadge />

<div>
	{#each files as item}
		<ImageUploader file={item} />
	{/each}
</div>

<div class="fixed bottom-0 right-0 p-4">
	<ImageSelector onFile={(file) => files.unshift(file)} />
</div>
