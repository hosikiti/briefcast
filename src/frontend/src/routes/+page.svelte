<script lang="ts">
	import UserHome from '$lib/components/UserHome.svelte';
	import Welcome from '$lib/components/Welcome.svelte';
	import type { PageData } from './$types';
	export let data: PageData;
</script>

{#if data.isLoggedIn}
	<UserHome />
{:else}
	<Welcome />
{/if}
