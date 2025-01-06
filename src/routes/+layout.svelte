<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<div class="mockup-browser border-base-300 border">
	<div class="mockup-browser-toolbar">
		<div class="input border-base-300 border">https://giantanchor.com</div>
	</div>	
	{@render children()}
</div>
