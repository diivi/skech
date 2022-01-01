<script lang="ts">
	let text = '';
	let messages = [];
	export let socket;
	socket.on('message', (message: string) => {
		messages = [...messages, message];
	});

	const sendMessage = (message: string) => {
		socket.emit('message', message);
	};
</script>

<ul>
	{#each messages as message}
		<li>{message}</li>
	{/each}
	<input type="text" bind:value={text} placeholder="Type something here..." />
	<button on:click={() => sendMessage(text)}> Send </button>
</ul>
