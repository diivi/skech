<script lang="ts">
	import { io, Socket } from 'socket.io-client';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	import Draw from '../../components/draw.svelte';
	import Chat from '../../components/chat.svelte';
	import Call from '../../components/call.svelte';

	let ready = false;
	let socket: Socket;
	let peer;

	let enableAudio = true;
	let enableVideo = true;
	let start = false;

	onMount(async () => {
		let Peer = (await import('peerjs')).default;

		socket = io('http://localhost:5000');
		socket.on('connect_error', (err) => {
			console.log(`connect_error due to ${err.message}`);
		});

		peer = new Peer();
		peer.on('open', (id) => {
			socket.emit('join-room', {
				roomId: $page.params.room,
				userId: id
			});
		});

		socket.on('user-connected', (user) => {
			console.log(`user ${user} connected`);
		});
		ready = true;
	});
</script>

{#if ready}
	<!-- {#if !start}
		<h1>Settings</h1>
		<label for="video">
			<input type="checkbox" name="video" bind:checked={enableVideo} />
			<p>Video</p>
		</label>
		<label for="audio">
			<input type="checkbox" name="audio" bind:checked={enableAudio} />
			<p>Audio</p>
		</label>
		<br />
		<button
			on:click={() => {
				start = true;
			}}>Start</button
		>
	{:else} -->
	<section>
		<Call {socket} {peer} {enableAudio} {enableVideo} />
		<Draw {socket} />
		<Chat {socket} />
	</section>
	<!-- {/if} -->
{:else}
	<p>Loading...</p>
{/if}

<style>
</style>
