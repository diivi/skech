<script>
	export let socket;
	export let peer;
	let localStream;
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
			.getUserMedia({ video: true, audio: true })
			.then((stream) => {
				localStream = stream;
				addVideoStream(video,localStream);
				peer.on('call', (call) => {
					call.answer(localStream);
					const video = document.createElement('video');
					call.on('stream', (remoteStream) => {
						addVideoStream(video,remoteStream);
					});
				});
				socket.on('user-connected', (userId) => {
					connectToNewUser(userId);
				});
			})
			.catch((err) => {
				console.log(err);
			});
	}
	function addVideoStream(video,stream) {
		video.srcObject = stream;
		video.addEventListener('loadedmetadata', () => {
			video.play();
		});
		const videoGrid = document.getElementById('video-grid');
		videoGrid.append(video);
	}
	function connectToNewUser(userId) {
		let call = peer.call(userId, localStream);
		const video  = document.createElement('video');
		call.on('stream', (remoteStream) => {
			addVideoStream(video,remoteStream);
		});
		call.on('close', () => {
			video.remove();
		});
	}
</script>

<section>
	<div id="video-grid">
		<h1>Call</h1>
		<button on:click={start}>Start</button>
		<button on:click={stop}>Stop</button>
	</div>
</section>
