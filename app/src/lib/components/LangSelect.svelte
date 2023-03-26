<script lang="ts">
	import { supportedLanguages, type LanguageCode } from '$lib/util';

	export let selectedLanguage: LanguageCode;
</script>

<select class="select" bind:value={selectedLanguage}>
	{#each supportedLanguages as lang}
		<option value={lang}>
			{lang.title}
		</option>
	{/each}
</select>
