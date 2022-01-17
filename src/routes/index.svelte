<script lang="ts">
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
	const validateName = () => {
		name = name.trim();
		if (name == '' || name.length > 12) {
			return false;
		} else {
			return true;
		}
	};

	function play() {
		goto(`/play/${roomId}`);
	}

	const checkKey = (e) => {
		if (e.charCode === 13) {
			if (validateName()) {
				user.set({ name, roomId });
				play();
			} else {
				alert('Enter a valid name');
			}
		}
	};
</script>

<input type="text" placeholder="enter name" bind:value={name} on:keypress={checkKey} />
<button
	on:click={() => {
		if (validateName()) {
			user.set({ name, roomId });
			play();
		} else {
			alert('Enter a valid name');
			name = '';
		}
	}}
>
	Start
</button>
