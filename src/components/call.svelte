<script>
	import { onMount } from 'svelte';

	export let socket;
	export let peer;
	export let enableAudio;
	export let enableVideo;
	const peers = {};
	let localStream;
	import { fakeMediaStream } from '../utils/fakeMediaStream.js';

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
		video.srcObject = stream;
		video.addEventListener('loadedmetadata', () => {
			video.play();
		});
		const videoGrid = document.getElementById('video-grid');
		videoGrid.append(video);
	}
	function connectToNewUser(userId, stream) {
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
	onMount(() => {
		if (enableAudio || enableVideo) {
			start();
		} else {
			fakeStart();
		}
		socket.on('user-connected', (userId) => {
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
		<h1>Join Call</h1>
		<button on:click={stop}>Stop Video</button>
		<button on:click={start}>Start Video</button>
		<button>Mute</button>
	</div>
</section>
