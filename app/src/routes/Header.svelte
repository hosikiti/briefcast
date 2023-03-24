<script>
	import { page } from '$app/stores';
	import '../lib/firebase';
	import { signInFirebase, signOutFirebase } from '../lib/firebase';
</script>

<header class="h-12 flex justify-between p-2 bg-slate-500 items-center shadow-md">
	<div class="text-white">
		<h2 class="font-bold">BriefCast</h2>
	</div>

	<div class="">
		{#if $page.data.isLoggedIn}
			<button type="button" class="btn variant-soft btn-sm text-slate-50" on:click={signOutFirebase}
				>Sign out</button
			>
		{:else}
			<button
				type="button"
				class="btn variant-filled btn-sm"
				on:click={() => signInFirebase('google')}>Sign in</button
			>
		{/if}
	</div>
</header>
