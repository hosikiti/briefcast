<script lang="ts">
	import { db } from '$lib/firebase';
	import { supportedLanguages, type LanguageCode } from '$lib/util';
	import { addDoc, collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
	import type { PageData } from './$types';
	import type { FeedTemplate, Podcast } from '$lib/types';
	import { onMount } from 'svelte';
	import type { ModalSettings, ModalComponent } from '@skeletonlabs/skeleton';
	import { modalStore } from '@skeletonlabs/skeleton';
	import AddPostModal from '$lib/components/AddPostModal.svelte';

	export let data: PageData;
	let selectedLanguage = supportedLanguages[0];
	let selectedTemplate: FeedTemplate | null = null;

	let templates: FeedTemplate[] = [];

	function handleAdd(tmpl?: FeedTemplate) {
		const data = {} as Podcast;

		if (tmpl) {
			data.feedUrl = tmpl.feedUrl;
			data.name = tmpl.name;
			data.websiteUrl = tmpl.websiteUrl;
			data.prompt = tmpl.prompt;
			const tmplLanguage = supportedLanguages.find((el) => el.code == tmpl.languageCode);
			data.language = tmplLanguage?.code || supportedLanguages[0].code;
		}

		const d: ModalSettings = {
			type: 'component',
			// Pass the component directly:
			component: {
				// Pass a reference to your custom component
				ref: AddPostModal,
				// Add the component properties as key/value pairs
				props: {
					formData: data
				}
			} as ModalComponent,
			response: async (podcast: Podcast | boolean) => {
				if (podcast instanceof Object) {
					await add(podcast);
				}
			}
		};

		modalStore.trigger(d);
	}

	async function add(podcast: Podcast) {
		const userRef = doc(db, `playlists/${data.userId}`);
		const userDoc = await getDoc(userRef);
		if (!userDoc.exists()) {
			setDoc(userRef, {
				default: []
			});
		}
		const ref = collection(db, `playlists/${data.userId}/default`);
		try {
			// set null values for undefined key
			for (const key in podcast) {
				if (podcast[key] === undefined) {
					podcast[key] = null;
				}
			}

			await addDoc(ref, podcast);
		} catch (e) {
			alert('save failed');
			console.error(e);
		}
	}

	async function loadFeedTemplates() {
		const ref = collection(db, `feedTemplates`);
		const querySnapshot = await getDocs(ref);
		querySnapshot.forEach((doc) => {
			const data = doc.data() as FeedTemplate;
			templates.push(data);
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
				<div class="border p-4 w-full lg:w-[30%] h-[12rem] flex flex-col rounded-lg">
					<span class="font-bold text-slate-700 text-lg mb-2">{tmpl.name}</span>
					<div class="flex-1">
						<span class="text-slate-500 text-sm line-clamp-2">{tmpl.description}</span>
					</div>
					<div class="flex justify-end">
						<button class="btn variant-filled rounded-full" on:click={() => handleAdd(tmpl)}
							>Add</button
						>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>
