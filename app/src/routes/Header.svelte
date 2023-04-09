<script>
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { showConfirm } from '$lib/modal';
	import '../lib/firebase';
	import { signOutFirebase } from '../lib/firebase';
	import { globalStore } from './store';

	async function signOut() {
		const yes = await showConfirm('Sign out from BriefCast');
		if (yes) {
			signOutFirebase();
		}
	}
</script>

<header class="h-12 flex justify-between p-2 px-4 bg-slate-500 items-center shadow-md">
	<div class="text-white">
		<button class="no-underlin font-serif text-3xl font-bold" on:click={() => goto('/')}
			>BriefCast</button
		>
	</div>

	{#if $globalStore.showSignInNav}
		<div class="">
			{#if $page.data.isLoggedIn}
				<button type="button" class="btn variant-soft btn-sm text-slate-50" on:click={signOut}
					>Sign out</button
				>
			{:else}
				<button type="button" class="btn variant-filled btn-sm" on:click={() => goto('/signin')}
					>Sign in</button
				>
			{/if}
		</div>
	{/if}
</header>
