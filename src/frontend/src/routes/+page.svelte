<script lang="ts">
	import UserHome from '$lib/components/UserHome.svelte';
	import Welcome from '$lib/components/Welcome.svelte';
	import { authStore } from '../store';
</script>

{#if $authStore.loggedIn}
	<UserHome />
{:else}
	<Welcome />
{/if}
