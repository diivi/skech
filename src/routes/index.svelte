<script lang="ts">
	import { io, Socket } from 'socket.io-client';
	import { onMount } from 'svelte';
	let socket: Socket;
	let text = 'Type Something Here...';
	let messages = [];

	onMount(() => {
		socket = io('http://localhost:5000');
		socket.on('connect_error', (err) => {
			console.log(`connect_error due to ${err.message}`);
		});
		socket.on('message', (message: string) => {
			messages = [...messages, message];
		});
	});

	const sendMessage = (message: string) => {
		socket.emit('message', message);
	};
</script>

<main>
	<ul>
		{#each messages as message}
			<li>{message}</li>
		{/each}
		<input type="text" bind:value={text} />
		<button on:click={() => sendMessage(text)}> Send </button>
	</ul>
</main>

<style>
</style>
