<script lang="ts">
	import { Toast, toastStore } from '@skeletonlabs/skeleton';
	import { Modal } from '@skeletonlabs/skeleton';
	import '@skeletonlabs/skeleton/themes/theme-hamlindigo.css';

	import '@skeletonlabs/skeleton/styles/all.css';

	import '../app.postcss';
	import Header from './Header.svelte';
	import { browser } from '$app/environment';
	import { analytics, initializeFirebase, logScreenView } from '$lib/firebase';
	import { navigating } from '$app/stores';

	$: if ($navigating) {
		// record new screen when navigating to new route
		logScreenView($navigating.to?.url.pathname || '');
	}

	if (browser) {
		try {
			initializeFirebase();

			const currentUrl = new URL(location.href).pathname;
			logScreenView(currentUrl);
		} catch (e) {
			console.error(e);
		}
	}
</script>

<div class="app">
	<Header />

	<main>
		<slot />
	</main>

	<footer class="flex flex-col w-screen bg-slate-300 h-[8rem] px-4 pt-4 pb-8">
		<span class="block font-bold font-serif text-xl">BriefCast</span>
		<span class="block font-serif text-slate-500">Less news, more life.</span>
		<span class="flex-1" />
		<span class="text-slate-500 text-xs">© 2023 Kei Oikawa.</span>
	</footer>
	<Modal />
	<Toast />
</div>
