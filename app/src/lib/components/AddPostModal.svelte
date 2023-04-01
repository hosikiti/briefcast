<script lang="ts">
	import { supportedLanguages, type LanguageCode } from '$lib/util';
	import LangSelect from './LangSelect.svelte';
	import { modalStore } from '@skeletonlabs/skeleton';
	import type { Podcast } from '$lib/types';

	export let parent: any;
	export let formData: Podcast;
	let selectedLanguage: LanguageCode =
		supportedLanguages.find((sl) => sl.code == formData.language) || supportedLanguages[0];

	function onSubmit(): void {
		if (!formData.feedUrl || !formData.name) {
			alert('set feed url and title');
			return;
		}

		formData.language = selectedLanguage.code;

		if ($modalStore[0].response) $modalStore[0].response(formData);
		modalStore.close();
	}

	function onCancel() {
		parent.onClose();
	}
</script>

<div class="bg-white border p-4 shadow-lg  lg:w-[60%] w-[80%] relative flex flex-col">
	<h2>{formData.name || 'New podcast'}</h2>
	<div class="flex flex-col my-4 gap-4">
		<label class="label">
			<span>Name: </span>
			<input type="text" class="input p-2" placeholder="Feed title" bind:value={formData.name} />
		</label>
		<label class="label">
			<span>Feed URL: </span>
			<input
				type="url"
				class="input p-2"
				placeholder="RSS/Atom feed URL"
				bind:value={formData.feedUrl}
			/>
		</label>
		<label class="label" for="">
			<span>Podcast Language: </span>
			<LangSelect bind:selectedLanguage />
		</label>
		<label class="label">
			<span>Prompt for your podcast transcript: </span>
			<textarea class="textarea" rows="5" />
		</label>
	</div>
	<div class="flex-1" />
	<div class="flex justify-end gap-2 items-end">
		<button class="btn variant-filled bg-orange-500 text-white" on:click={onSubmit}>Add</button>
		<button class="btn variant-soft" on:click={onCancel}>Cancel</button>
	</div>
</div>

<!-- <div
	class="absolute z-[999] top-0 left-0 w-screen h-main bg-black bg-opacity-40 flex justify-center"
>
</div> -->
