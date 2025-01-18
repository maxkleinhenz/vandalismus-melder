<script lang="ts">
	let { file }: { file: File } = $props();
</script>

<div>
	<img src={URL.createObjectURL(file)} alt="Preview" />
	{file.name}
</div>
