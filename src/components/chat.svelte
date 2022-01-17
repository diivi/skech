<script lang="ts">
	export let name;

	type Message = {
		from: string;
		text: string;
		type: string;
	};
	let message: Message = {
		from: name,
		text: '',
		type: 'message'
	};
	let messages: Message[] = [];
	export let socket;
	socket.on('message', (message: Message) => {
		messages = [...messages, message];
	});

	const validateMessage = () => {
		message.text = message.text.trim();
		if (message.text == '' || message.text.length > 50) {
			return false;
		} else {
			return true;
		}
	};
	const sendMessage = () => {
		if (validateMessage()) {
			socket.emit('message', message);
			message.text = '';
		} else {
			alert('Enter a valid message');
		}
	};
	const checkKey = (e) => {
		if (e.charCode === 13) {
			sendMessage();
		}
	};
	socket.on('user-connected', (user) => {
		const message = 'has joined the game';
		messages = [...messages, { from: user.name, text: message, type: 'join' }];
	});
	socket.on('user-disconnected', (user) => {
		const message = 'has left the game';
		messages = [...messages, { from: user.name, text: message, type: 'leave' }];
	});
</script>

<section>
	<h1>chat</h1>
	<ul id="chatBox">
		{#each messages as message}
			<li><b>{message.from}</b> {message.text}</li>
		{/each}
	</ul>
	<input
		type="text"
		bind:value={message.text}
		placeholder="Type something here..."
		on:keypress={checkKey}
	/>
	<button on:click={() => sendMessage()}> Send </button>
</section>

<style>
	section {
		height: 50vh;
	}
	ul {
		height: 100%;
		overflow: auto;
	}
</style>
