<script>
	import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';
	import { onMount, onDestroy } from 'svelte';
	import { globalStore } from '../../store';
	onMount(() => {
		globalStore.update((v) => {
			v.showSignInNav = false;
			return v;
		});
	});

	onDestroy(() => {
		globalStore.update((v) => {
			v.showSignInNav = true;
			return v;
		});
	});
</script>

<div class="w-full flex gap-8 flex-col h-[80vh] items-center justify-center">
	<div>Signing in ...</div>
	<LoadingSpinner />
	<a href="/signin" class="py-8">Go back</a>
</div>
