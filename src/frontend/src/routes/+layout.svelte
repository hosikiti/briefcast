<script lang="ts">
	import '@skeletonlabs/skeleton/themes/theme-hamlindigo.css';

	import '@skeletonlabs/skeleton/styles/all.css';

	import '../app.postcss';
	import Header from './Header.svelte';
</script>

<div class="app">
	<Header />

	<main>
		<slot />
	</main>

	<footer class="flex flex-col w-screen bg-slate-300 h-[8rem] p-2 pt-4 pb-8">
		<span class="block font-bold font-serif text-xl">BriefCast</span>
		<span class="block font-serif text-slate-500">Less news, more life.</span>
		<span class="flex-1" />
		<span class="text-slate-500 text-xs">© 2023 Kei Oikawa.</span>
	</footer>

	<!-- <footer class="flex w-screen justify-center p-2">
		<span class="text-slate-600 text-xs">(C) 2023 Kei Oikawa.</span>
	</footer> -->
</div>
