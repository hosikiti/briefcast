<script lang="ts">
	import LangSelect from '$lib/components/LangSelect.svelte';
	import { db } from '$lib/firebase';
	import type { FeedTemplate } from '$lib/types';
	import { supportedLanguages } from '$lib/util';
	import { addDoc, collection } from 'firebase/firestore';

	let name = '';
	let description = '';
	let feedUrl = '';
	let selectedLangage = supportedLanguages[0];

	async function add() {
		const ref = collection(db, `feedTemplates`);
		try {
			await addDoc(ref, {
				feedUrl: feedUrl,
				description: description,
				name: name,
				languageCode: selectedLangage.code
			} as FeedTemplate);
		} catch (e) {
			alert('save failed');
			console.error(e);
		} finally {
			alert('save done');
		}
	}
</script>

<div class="p-2">
	<h1>Add feed template</h1>
	<div class="flex flex-col gap-2 py-4">
		<input type="text" placeholder="name" bind:value={name} />
		<input type="text" placeholder="description" bind:value={description} />
		<input type="text" placeholder="feed URL" bind:value={feedUrl} />
		<LangSelect bind:selectedLanguage={selectedLangage} />
		<button class="variant-filled p-2 text-white" on:click={add}>Add</button>
	</div>
</div>
