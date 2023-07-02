<script lang="ts">
	import LangSelect from '$lib/components/LangSelect.svelte';
	import { db } from '$lib/firebase';
	import { getFeed } from '$lib/repository/feed.repository';
	import { showToast } from '$lib/toast';
	import type { FeedData, FeedTemplate } from '$lib/types';
	import { supportedLanguages } from '$lib/util';
	import axios from 'axios';
	import { addDoc, collection } from 'firebase/firestore';

	let name = '';
	let description = '';
	let feedUrl = '';
	let websiteUrl = '';
	let prompt = '';
	let selectedLangage = supportedLanguages[0];

	async function add() {
		const ref = collection(db, `feedTemplates`);
		try {
			await addDoc(ref, {
				feedUrl,
				websiteUrl,
				description,
				name,
				prompt,
				languageCode: selectedLangage.code,
				language: selectedLangage.code.split('-')[1]
			} as FeedTemplate);
		} catch (e) {
			alert('save failed');
			console.error(e);
		} finally {
			alert('save done');
		}
	}

	async function getInfo() {
		try {
			const feed = await getFeed(feedUrl);
			if (!feed) {
				throw 'get feed failed';
			}
			websiteUrl = feed.link || '';
			name = feed.title || '';
			description = feed.description || '';
			showToast('Get info done');
		} catch (e) {
			showToast('Get info failed!');
		}
	}
</script>

<div class="p-2 w-full flex flex-col items-center">
	<div class="w-full md:w-[50%]">
		<h1 class="my-8 text-center">Add feed template</h1>
		<div class="flex flex-col gap-2 py-4">
			<div class="flex gap-2">
				<input class="input p-2" type="text" placeholder="feed URL" bind:value={feedUrl} />
				<button class="btn variant-filled-secondary" on:click={getInfo}>Get Info</button>
			</div>
			<label>
				<span>Name</span>
				<input class="input p-2" type="text" placeholder="name" bind:value={name} />
			</label>
			<label>
				<span>Description</span>
				<input class="input p-2" type="text" placeholder="description" bind:value={description} />
			</label>
			<label>
				<span>Prompt</span>
				<input class="input p-2" type="text" placeholder="prompt" bind:value={prompt} />
			</label>
			<input class="input p-2" type="text" placeholder="website URL" bind:value={websiteUrl} />
			<LangSelect bind:selectedLanguage={selectedLangage} />
			<button class="variant-filled p-2 text-white" on:click={add}>Add</button>
		</div>
	</div>
</div>
