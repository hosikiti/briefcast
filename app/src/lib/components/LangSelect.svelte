<script lang="ts">
	import { supportedLanguages, type LanguageCode } from '$lib/util';

	type SelectLanguageEvent = (lang: LanguageCode) => void;

	export let useShortName = false;
	export let selectedLanguage: LanguageCode;
	export let onChange: SelectLanguageEvent | undefined = undefined;
	function _onChange(e: Event) {
		if (onChange) {
			onChange(selectedLanguage);
		}
	}
</script>

<select class="select" bind:value={selectedLanguage} on:change={_onChange}>
	{#each supportedLanguages as lang}
		<option value={lang}>
			{useShortName ? lang.languageShortName : lang.title}
		</option>
	{/each}
</select>
