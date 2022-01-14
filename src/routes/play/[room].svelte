<script lang="ts">
	import { io, Socket } from 'socket.io-client';
	import { onMount } from 'svelte';

	import Draw from '../../components/draw.svelte';
	import Chat from '../../components/chat.svelte';

	let ready = false;
	let socket: Socket;
	let name = '';
	let start = false;

	onMount(() => {
		const server_url = import.meta.env.VITE_SERVER_URL as string;
		socket = io(server_url);
		socket.on('connect_error', (err) => {
			console.log(`connect_error due to ${err.message}`);
		});

		socket.on('user-connected', (user) => {
			console.log(`user ${user} connected`);
		});
		ready = true;
	});
</script>

{#if ready}
	{#if !start}
		<input type="text" placeholder="enter name" bind:value={name} />
		<button
			on:click={() => {
				start = true;
			}}
		>
			Start
		</button>
	{:else}
		<section>
			<Draw {socket} />
			<Chat {name} {socket} />
		</section>
	{/if}
{:else}
	<p>Loading...</p>
{/if}

<style>
</style>
