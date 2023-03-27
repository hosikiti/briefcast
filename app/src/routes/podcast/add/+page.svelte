<script lang="ts">
	import { db } from '$lib/firebase';
	import { supportedLanguages, type LanguageCode } from '$lib/util';
	import { addDoc, collection, getDocs } from 'firebase/firestore';
	import type { PageData } from './$types';
	import type { FeedTemplate } from '$lib/types';
	import { onMount } from 'svelte';

	export let data: PageData;
	let isModalOpen = false;
	let selectedLanguage = supportedLanguages[0];
	let selectedTemplate: FeedTemplate | null = null;

	let feedUrl = '';
	let name = '';

	let templates: FeedTemplate[] = [];

	function handleAdd(tmpl?: FeedTemplate) {
		isModalOpen = true;
		feedUrl = '';
		name = '';
		if (tmpl) {
			selectedTemplate = tmpl;
			feedUrl = tmpl.feedUrl;
			name = tmpl.name;
		}
	}

	async function add() {
		if (!feedUrl || !name) {
			alert('set feed url and title');
			return;
		}
		const ref = collection(db, `playlists/${data.userId}/default`);
		try {
			await addDoc(ref, {
				name: name,
				feedUrl: feedUrl,
				language: selectedLanguage.code
			});
		} catch (e) {
			alert('save failed');
			console.error(e);
		} finally {
			handleClose();
		}
	}

	function handleClose() {
		isModalOpen = false;
	}

	async function loadFeedTemplates() {
		const ref = collection(db, `feedTemplates`);
		const querySnapshot = await getDocs(ref);
		querySnapshot.forEach((doc) => {
			const data = doc.data();
			templates.push({
				name: data.name,
				feedUrl: data.feedUrl,
				description: data.description,
				languageCode: data.languageCode
			});
		});
		templates = templates;
	}

	onMount(async () => {
		await loadFeedTemplates();
	});
</script>

<div class="p-4 flex justify-center relative">
	<div class="shadow-md p-4 bg-white md:w-[80vw] w-full">
		<h2 class="mb-8">Add podcast</h2>
		<div class="flex gap-2 mb-4">
			<button class="btn variant-filled bg-orange-500 text-white" on:click={() => handleAdd()}
				>Add by Feed URL</button
			>
		</div>
		<hr />
		<h3 class="mt-8 mb-4">Explore</h3>
		<div class="flex flex-wrap gap-2 items-center flex-col md:flex-row">
			{#each templates as tmpl}
				<div class="border p-4 w-full md:w-[30%] h-[10rem] flex flex-col rounded-lg">
					<span class="font-bold text-slate-700 text-lg">{tmpl.name}</span>
					<span class="block text-slate-500 text-sm flex-1">{tmpl.description}</span>
					<div class="flex justify-end">
						<button class="btn variant-filled rounded-full" on:click={() => handleAdd(tmpl)}
							>Add</button
						>
					</div>
				</div>
			{/each}
		</div>
	</div>
	{#if isModalOpen}
		<div
			class="absolute z-[999] top-0 left-0 w-screen h-main bg-black bg-opacity-40 flex justify-center"
		>
			<div
				class="bg-white border p-4 shadow-lg m-8 lg:w-[60%] w-[80%] h-[60%] relative flex flex-col"
			>
				<h2>{name || 'New podcast'}</h2>
				<div class="flex flex-col my-4 gap-4">
					<label class="label">
						<span>Name: </span>
						<input type="url" class="input p-2" placeholder="Feed title" bind:value={name} />
					</label>
					<label class="label">
						<span>Feed URL: </span>
						<input
							type="url"
							class="input p-2"
							placeholder="RSS/Atom feed URL"
							bind:value={feedUrl}
						/>
					</label>
					<label class="label">
						<span>Podcast Language: </span>
						<select class="select" bind:value={selectedLanguage}>
							{#each supportedLanguages as lang}
								<option value={lang}>
									{lang.title}
								</option>
							{/each}
						</select>
					</label>
				</div>
				<div class="flex-1" />
				<div class="flex justify-end gap-2 items-end">
					<button class="btn variant-filled bg-orange-500 text-white" on:click={add}>Add</button>
					<button class="btn variant-soft" on:click={handleClose}>Cancel</button>
				</div>
			</div>
		</div>
	{/if}
</div>
