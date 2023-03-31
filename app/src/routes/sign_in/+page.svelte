<script lang="ts">
	import { signInWithEmail } from '$lib/firebase';

	let email = 'test@gmail.com';
	let password = '';

	async function signIn() {
		await signInWithEmail(email, password);
	}
</script>

<div class="p-2 flex flex-col justify-center items-center w-full">
	<h1 class="my-4">Sign in</h1>
	<div class="flex flex-col gap-4 my-4">
		<div />
		<label>
			Email
			<input type="text" placeholder="Email" class="input p-2" bind:value={email} />
		</label>
		<label>
			Password
			<input type="password" placeholder="Password" class="input p-2" bind:value={password} />
		</label>
		<button class="btn variant-filled bg-orange-500" on:click={signIn}>Sign in</button>
	</div>
</div>
