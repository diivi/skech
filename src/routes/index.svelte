<script>
	import { goto } from '$app/navigation';
	import { user } from '../stores/stores';
	import { v4 as uuid } from 'uuid';
	let name = '';
	let roomId = $user.roomId;
	if (!roomId) {
		roomId = uuid();
		$user.roomId = roomId;
		console.log('roomId', roomId);
	}
	function play() {
		goto(`/play/${roomId}`);
	}
</script>

<input type="text" placeholder="enter name" bind:value={name} />
<button
	on:click={() => {
		user.set({ name, roomId });
		play();
	}}
>
	Start
</button>
