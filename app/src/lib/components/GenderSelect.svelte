<script lang="ts">
	import { Gender, genders } from '$lib/util';

	export let selectedGender: Gender;
</script>

<select class="select" bind:value={selectedGender}>
	{#each genders as gender}
		<option value={gender.gender}>
			{gender.label}
		</option>
	{/each}
</select>
