<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';

	export let socket;
	export let enableAudio;
	export let enableVideo;
	export let name;

	const peers = {};
	let peer;
	let localStream;
	let fakeMediaStream;

	function fakeStart() {
		localStream = fakeMediaStream;
	}
	function stop() {
		localStream.getTracks().forEach((track) => {
			track.stop();
		});
		let video = document.getElementById('localVideo');
		video.parentNode.removeChild(video);
	}
	function start() {
		let originalVideo = document.getElementById('localVideo');
		if (originalVideo) {
			return;
		}
		let video = document.createElement('video');
		video.id = 'localVideo';
		video.muted = true;
		navigator.mediaDevices
			.getUserMedia({ video: enableVideo, audio: enableAudio })
			.then((stream) => {
				localStream = stream;
				addVideoStream(video, localStream);
			})
			.catch((err) => {
				console.log(err);
			});
	}
	function addVideoStream(video, stream) {
		console.log('addVideoStream');
		video.srcObject = stream;
		video.addEventListener('loadedmetadata', () => {
			video.play();
		});
		const videoGrid = document.getElementById('video-grid');
		videoGrid.append(video);
	}
	function connectToNewUser(userId, stream) {
		console.log('connectToNewUser');
		let call = peer.call(userId, stream);
		const video = document.createElement('video');
		call.on('stream', (remoteStream) => {
			addVideoStream(video, remoteStream);
		});
		call.on('close', () => {
			video.remove();
		});
		peers[userId] = call;
	}
	onMount(async () => {
		fakeMediaStream = await import('../utils/fakeMediaStream.js');
		let Peer = (await import('peerjs')).default;
		//@ts-ignore
		peer = new Peer({
			host: 'skech-peer-server.herokuapp.com',
			path: '/peerjs',
			port: 443,
			secure: true,
			debug: 3,
			config: {
				iceServers: [
					{
						url: 'stun:stun.l.google.com:19302'
					},
					{
						url: 'turn:numb.viagenie.ca',
						username: import.meta.env.VITE_TURN_USERNAME as string,
						credential: import.meta.env.VITE_TURN_PASSWORD as string
					}
				]
			}
		});
		peer.on('open', (id) => {
			socket.emit('join-room', {
				roomId: $page.params.room,
				userId: id,
				name: name
			});
		});
		if (enableAudio || enableVideo) {
			start();
		} else {
			fakeStart();
		}
		socket.on('user-connected', (userId) => {
			console.log('userId', userId);
			connectToNewUser(userId, localStream);
		});
		socket.on('user-disconnected', (userId) => {
			if (peers[userId]) {
				peers[userId].close();
			}
		});
		peer.on('call', (call) => {
			call.answer(localStream);
			const video = document.createElement('video');
			call.on('stream', (remoteStream) => {
				addVideoStream(video, remoteStream);
			});
			call.on('close', () => {
				video.remove();
			});
		});
});
</script>

<section>
	<div id="video-grid">
		<h1>Hi {name}</h1>
		<h1>Join Call</h1>
		<button on:click={stop}>Stop Video</button>
		<button on:click={start}>Start Video</button>
		<button>Mute</button>
	</div>
</section>
