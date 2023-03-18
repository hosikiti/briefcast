<script lang="ts">
	import '@skeletonlabs/skeleton/themes/theme-hamlindigo.css';

	import '@skeletonlabs/skeleton/styles/all.css';

	import '../app.postcss';
	import Header from './Header.svelte';
</script>

<div class="app">
	<Header />

	<main class="h-[calc(100vh-12rem)]">
		<slot />
	</main>

	<footer class="fixed bottom-0 flex w-screen justify-center p-4">
		<span class="text-slate-600 text-xs">(C) 2023 Kei Oikawa.</span>
	</footer>
</div>
