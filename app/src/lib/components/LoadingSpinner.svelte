<script lang="ts">
	import { Jumper } from 'svelte-loading-spinners';

	export let size = 60;
	export let duration = '2s';
	export let color = '#FF3E00';
</script>

<Jumper {size} {color} unit="px" {duration} />
