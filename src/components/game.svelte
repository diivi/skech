<script>
	import Draw from './draw.svelte';
	import Chat from './chat.svelte';
	import { onMount } from 'svelte';
	export let socket;
	export let name;
	export let room;
	onMount(() => {
		socket.emit('join-room', {
			roomId: room,
			name: name,
			userId: socket.id
		});
	});
</script>

<section>
	<Draw {socket} />
	<Chat {name} {socket} />
</section>
