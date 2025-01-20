<script lang="ts">
	import HighscoreBadge from '@/components/highscore/highscore-badge.svelte';
	import ImageSelector from '@/components/image/image-selector.svelte';

	let files = $state([] as File[]);

	// const loadData = async () => {
	// 	loading = true;
	// 	greeting = await trpc(page).greeting.query();
	// 	loading = false;
	// };
</script>

<div class="fixed inset-x-0 top-0 flex justify-center p-4">
	<HighscoreBadge />
</div>

<div class="fixed bottom-0 right-0 p-4">
	<ImageSelector />
</div>
