<script>
	import Draw from './draw.svelte';
	import Chat from './chat.svelte';
	import { onMount } from 'svelte';
	export let socket;
	export let name;
	export let room;
</script>

<section>
	<div class="chat-draw">
		<Draw {socket} />
		<Chat {name} {socket} />
	</div>
</section>
<style>
.chat-draw{
	display: flex;
}
</style>
