<script>
	import P5 from '@macfja/svelte-p5';
	export let socket;
	let sketch = {
		setup: (p5) => {
			p5.createCanvas(720, 400);
			p5.background(0);
            socket.on('draw', (data) => {
				p5.strokeWeight(10);
				p5.stroke('red');
				p5.line(data.x, data.y, data.px, data.py);
			});
		},
		draw: (p5) => {

		},
		touchMoved: (p5) => {
			p5.strokeWeight(10);
			p5.stroke('red');
			p5.line(p5.mouseX, p5.mouseY, p5.pmouseX, p5.pmouseY);
			let data = {
				x: p5.mouseX,
				y: p5.mouseY,
				px: p5.pmouseX,
				py: p5.pmouseY
			};
			socket.emit('draw', data);
		}
	};
</script>

<h1>draw</h1>
<P5 {...sketch} />

<style>
</style>
