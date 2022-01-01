<script lang="ts">
	import { io, Socket } from 'socket.io-client';
	import { onMount } from 'svelte';
	import Draw from '../components/draw.svelte';
	import Chat from '../components/chat.svelte';
	let ready = false;
	let socket: Socket;
	onMount(() => {
		socket = io('http://localhost:5000');
		socket.on('connect_error', (err) => {
			console.log(`connect_error due to ${err.message}`);
		});
		ready = true;
	});
</script>

{#if ready}
	<section>
		<Draw {socket} />
		<Chat {socket} />
	</section>
{:else}
	<p>Loading...</p>
{/if}

<style>
</style>
