<script>
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { v4 as uuid } from 'uuid';
	onMount(() => {
		goto(`/play/${uuid()}`);
	});
</script>

