<script lang="ts">
	import { io, Socket } from 'socket.io-client';
	import { onMount } from 'svelte';

	import Draw from '../../components/draw.svelte';
	import Chat from '../../components/chat.svelte';
	import Call from '../../components/call.svelte';

	let ready = false;
	let socket: Socket;

	let enableAudio = true;
	let enableVideo = true;
	let start = false;

	onMount(async () => {
		socket = io('http://localhost:5000');
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
		<input type="checkbox" bind:checked={enableAudio} />
		<label for="audio">Audio</label>
		<input type="checkbox" name="video" bind:checked={enableVideo} />
		<label for="video">Video</label>
		<br />
		<button
			on:click={() => {
				start = true;
			}}
		>
			Start
		</button>
	{:else}
		<section>
			<Call {socket} {enableAudio} {enableVideo} />
			<Draw {socket} />
			<Chat {socket} />
		</section>
	{/if}
{:else}
	<p>Loading...</p>
{/if}

<style>
</style>
