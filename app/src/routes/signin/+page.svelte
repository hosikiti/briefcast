<script lang="ts">
	import { signInFirebase, signInWithEmail } from '$lib/firebase';
	import { onDestroy, onMount } from 'svelte';
	import { globalStore } from '../store';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';

	let email = 'test@gmail.com';
	let password = '';
	let errorWithEmail = '';
	let isProcessing = false;
	let showEmailSignIn = false;

	onMount(() => {
		globalStore.update((v) => {
			v.showSignInNav = false;
			return v;
		});
		if (browser) {
			showEmailSignIn = location.href.includes('email=true');
		}
	});

	onDestroy(() => {
		globalStore.update((v) => {
			v.showSignInNav = true;
			return v;
		});
	});

	async function signInWithGoogle() {
		goto('/signin/processing');
		try {
			await signInFirebase('google');
			// redirect to top page
			setTimeout(() => {
				goto('/');
			}, 500);
		} catch (e) {
			// if cancelled, go back to the sign-in page again.
			goto('/signin');
		}
	}

	async function signIn() {
		try {
			isProcessing = true;
			errorWithEmail = '';
			if (email == '' || password == '') {
				errorWithEmail = 'Email and password are both required.';
				return;
			}

			const result = await signInWithEmail(email, password);
		} catch (e) {
			let message = 'Invalid Email or Password';
			if (e instanceof Error) {
				if (e.message.includes('auth/wrong-password')) {
					message = 'Invalid password';
				} else if (e.message.includes('auth/user-not-found')) {
					message = 'No user is found';
				} else {
					message = 'Invalid input';
				}
			}
			errorWithEmail = message;
		} finally {
			isProcessing = false;
		}
	}
</script>

<div class="p-2 flex flex-col justify-center items-center w-full">
	<h1 class="mt-12">Sign in</h1>
	<div class="flex flex-col gap-4 my-4">
		<button
			class="rounded-xl mt-8 min-w-[20rem] p-2 variant-ringed bg-white flex items-center justify-center w-full w-[320px] shadow-md"
			on:click={signInWithGoogle}
		>
			<svg
				viewBox="0 0 20 20"
				class="googleLogo"
				style="width: 14px; height: 14px; display: block; fill: inherit; flex-shrink: 0; backface-visibility: hidden; margin-right: 6px;"
				><g
					><path
						d="M19.9996 10.2297C19.9996 9.54995 19.9434 8.8665 19.8234 8.19775H10.2002V12.0486H15.711C15.4823 13.2905 14.7475 14.3892 13.6716 15.0873V17.586H16.9593C18.89 15.8443 19.9996 13.2722 19.9996 10.2297Z"
						fill="#4285F4"
					/><path
						d="M10.2002 20.0003C12.9518 20.0003 15.2723 19.1147 16.963 17.5862L13.6753 15.0875C12.7606 15.6975 11.5797 16.0429 10.2039 16.0429C7.54224 16.0429 5.28544 14.2828 4.4757 11.9165H1.08301V14.4923C2.81497 17.8691 6.34261 20.0003 10.2002 20.0003Z"
						fill="#34A853"
					/><path
						d="M4.47227 11.9163C4.04491 10.6743 4.04491 9.32947 4.47227 8.0875V5.51172H1.08333C-0.363715 8.33737 -0.363715 11.6664 1.08333 14.4921L4.47227 11.9163Z"
						fill="#FBBC04"
					/><path
						d="M10.2002 3.95756C11.6547 3.93552 13.0605 4.47198 14.1139 5.45674L17.0268 2.60169C15.1824 0.904099 12.7344 -0.0292099 10.2002 0.000185607C6.34261 0.000185607 2.81497 2.13136 1.08301 5.51185L4.47195 8.08764C5.27795 5.71762 7.53849 3.95756 10.2002 3.95756Z"
						fill="#EA4335"
					/></g
				></svg
			>
			Continue with Google</button
		>
		<hr class="my-8" />
		{#if showEmailSignIn}
			<label class="text-sm ">
				Email
				<input type="text" placeholder="Email" class="input p-2" bind:value={email} />
			</label>
			<label class="text-sm">
				Password
				<input type="password" placeholder="Password" class="input p-2" bind:value={password} />
			</label>
			{#if errorWithEmail}
				<span class="p-2 text-red-700 variant-ringed-error">{errorWithEmail}</span>
			{/if}

			<button
				class="btn variant-ringed bg-white shadow-md flex items-center gap-2"
				on:click={signIn}
				disabled={isProcessing}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="w-6 h-6"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
					/>
				</svg>

				Continue with Email</button
			>
		{/if}
	</div>
	<div class="p-2 mb-12 w-full md:w-[50%] text-sm text-slate-600">
		By clicking "Continue with Google" above, you acknowledge that you have read and understood, and
		agree to BriefCast's <a href="/user_terms">Terms & Conditions</a> and
		<a href="/privacy_policy">Privacy Policy</a>.
	</div>
</div>
