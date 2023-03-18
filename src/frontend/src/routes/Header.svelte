<script>
	import { page } from '$app/stores';
	import { signInWithPopup, signOut } from 'firebase/auth';
	import '../helpers/firebase';
	import { auth, provider } from '../helpers/firebase';
	import { authStore } from '../store';

	async function signInFirebase() {
		await signInWithPopup(auth, provider).catch((e) => console.error(e));
	}

	async function signOutFirebase() {
		await signOut(auth).catch((e) => console.error(e));
	}
</script>

<header class="h-12 flex justify-between p-2 bg-slate-500 items-center shadow-md">
	<div class="text-white">
		<h2 class="font-bold">BriefCast</h2>
	</div>

	<!-- <nav>
		<ul>
			<li aria-current={$page.url.pathname === '/' ? 'page' : undefined}>
				<a href="/">Home</a>
			</li>
			<li aria-current={$page.url.pathname === '/about' ? 'page' : undefined}>
				<a href="/about">About</a>
			</li>
		</ul>
	</nav> -->

	<div class="">
		{#if $authStore.loggedIn}
			<button type="button" class="btn variant-filled btn-sm" on:click={signOutFirebase}
				>Sign out</button
			>
		{:else}
			<button type="button" class="btn variant-filled btn-sm" on:click={signInFirebase}
				>Sign in</button
			>
		{/if}
	</div>
</header>
