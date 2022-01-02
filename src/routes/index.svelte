<script>
	import { goto } from '$app/navigation';
	function play() {
		goto('/play');
	}
</script>

<button on:click={() => play()}>Play</button>
