<script lang="ts">
	export let name;

	type Message = {
		from: string;
		text: string;
	};
	let message: Message = {
		from: name,
		text: ''
	};
	let messages: Message[] = [];
	export let socket;
	socket.on('message', (message: Message) => {
		messages = [...messages, message];
	});

	const sendMessage = () => {
		socket.emit('message', message);
	};
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
