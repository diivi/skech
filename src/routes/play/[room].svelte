<script lang="ts">
	import { page } from '$app/stores';

	import { io, Socket } from 'socket.io-client';
	import { onMount } from 'svelte';
	import { user } from '../../stores/stores';

	import Game from '../../components/game.svelte';
	import { goto } from '$app/navigation';

	let ready = false;
	let socket: Socket;
	let roomId = $page.params.room;

	let start = false;

	onMount(() => {
		if (!$user.name) {
			user.set({ name: '', roomId });
			goto('/');
		} else {
			const server_url = import.meta.env.VITE_SERVER_URL as string;
			socket = io(server_url);
			socket.on('connect_error', (err) => {
				console.log(`connect_error due to ${err.message}`);
			});
			ready = true;
		}
	});
</script>

{#if ready}
	{#if !start}
		<button
			on:click={() => {
				start = true;
			}}
		>
			Start
		</button>
	{:else}
		<Game {socket} {name} room={roomId} />
	{/if}
{:else}
	<p>Loading...</p>
{/if}

<style>
</style>
