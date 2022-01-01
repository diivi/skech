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
	<section>
		<Call {socket} {peer}/>
		<Draw {socket} />
		<Chat {socket} />
	</section>
{:else}
	<p>Loading...</p>
{/if}

<style>
</style>
