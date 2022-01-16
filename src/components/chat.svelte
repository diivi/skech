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
	const sendMessage = () => {
		socket.emit('message', message);
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
	<ul>
		<h1>chat</h1>
		{#each messages as message}
			<li><b>{message.from}</b> {message.text}</li>
		{/each}
		<input type="text" bind:value={message.text} placeholder="Type something here..." />
		<button on:click={() => sendMessage()}> Send </button>
	</ul>
</section>
