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
	let name = '';
	let owner = false;

	let start = false;

	onMount(() => {
		if (!$user.name) {
			user.set({ name: '', roomId });
			goto('/');
		} else {
			const server_url = import.meta.env.VITE_SERVER_URL as string;
			socket = io(server_url);
			socket.emit('join-room', {
				roomId,
				name,
				userId: socket.id
			});
			socket.on('connect_error', (err) => {
				console.log(`connect_error due to ${err.message}`);
			});
			socket.on('start-game', (data) => {
				console.log(data, 'start-game');
				start = true;
			});
			socket.on('room-not-found', () => {
				owner = true;
				socket.emit('create-room', {
					roomId,
					name,
					userId: socket.id
				});
			});
			name = $user.name;
			ready = true;
		}
	});
</script>

{#if ready}
	{#if !start}
		<h1>Options</h1>
		{#if owner}
			<p>u r owner</p>
			<button
				on:click={() => {
					start = true;
					console.log('started game');
					socket.emit('start-game', {
						roomId,
						userId: socket.id
					});
				}}
			>
				Start
			</button>
		{/if}
	{:else}
		<Game {socket} {name} room={roomId} />
	{/if}
{:else}
	<p>Loading...</p>
{/if}

<style>
</style>
