<script lang="ts">
	import { db } from '$lib/firebase';
	import {
		supportedLanguages,
		type LanguageCode,
		languageShortNameMap,
		getBrowserLanguage,
		isJapaneseBrowser
	} from '$lib/util';
	import {
		addDoc,
		collection,
		doc,
		getDoc,
		getDocs,
		orderBy,
		query,
		setDoc,
		where
	} from 'firebase/firestore';
	import type { PageData } from './$types';
	import type { FeedTemplate, Podcast } from '$lib/types';
	import { onMount } from 'svelte';
	import { modalStore, type ModalComponent, type ModalSettings } from '@skeletonlabs/skeleton';
	import AddEditPodcastModal from '$lib/components/AddEditPodcastModal.svelte';
	import { showToast } from '$lib/toast';
	import { MAX_PODCAST_PER_PLAYLIST } from '$lib/constant';
	import { showAlert, showCustomModel } from '$lib/modal';
	import LangSelect from '$lib/components/LangSelect.svelte';
	import { updatePodcast } from '$lib/repository/podcast.repository';

	export let data: PageData;

	let templates: FeedTemplate[] = [];
	let canAdd = false;
	let selectedLanguage = supportedLanguages[0];

	function handleAdd(tmpl?: FeedTemplate) {
		if (!canAdd) {
			showAlert('You can add up to 5 podcasts. Remove one.');
			return;
		}
		const podcast = {} as Podcast;

		if (tmpl) {
			podcast.feedUrl = tmpl.feedUrl;
			podcast.name = tmpl.name;
			podcast.websiteUrl = tmpl.websiteUrl;
			podcast.prompt = tmpl.prompt;
			const tmplLanguage = supportedLanguages.find((el) => el.code == tmpl.languageCode);
			podcast.language = tmplLanguage?.code || supportedLanguages[0].code;
		}

		showCustomModel(
			AddEditPodcastModal,
			{
				formData: podcast
			},
			async (podcast: Podcast | boolean) => {
				if (podcast instanceof Object) {
					await add(podcast);
				}
			}
		);
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

			const snapshot = await addDoc(ref, podcast);
			// generate podcast
			const docId = snapshot.id;
			updatePodcast(data.userId, docId);
			await updateCanAdd();

			showToast('Added!');
		} catch (e) {
			showAlert('Save failed for unknown error');
			console.error(e);
		}
	}

	async function loadFeedTemplates() {
		templates = [];
		const ref = collection(db, `feedTemplates`);
		const q = query(ref, orderBy('name'), where('languageCode', '==', selectedLanguage.code));
		const querySnapshot = await getDocs(q);
		querySnapshot.forEach((doc) => {
			const data = doc.data() as FeedTemplate;
			templates.push(data);
		});
		templates = templates;

		await updateCanAdd();
	}

	async function updateCanAdd() {
		const playlistRef = collection(db, `playlists/${data.userId}/default`);
		const docs = await getDocs(playlistRef);
		canAdd = docs.size < MAX_PODCAST_PER_PLAYLIST;
	}

	onMount(async () => {
		isJapaneseBrowser() ? supportedLanguages[1] : supportedLanguages[0];
		await loadFeedTemplates();
	});

	function onLanguageChanged(lang: LanguageCode) {
		selectedLanguage = lang;
		loadFeedTemplates();
	}
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
		<div class="flex justify-between items-center">
			<div>
				<h3 class="mt-8 mb-4">Explore</h3>
			</div>
			<div>
				<LangSelect useShortName {selectedLanguage} onChange={onLanguageChanged} />
			</div>
		</div>
		<div class="flex flex-wrap gap-2 items-center flex-col md:flex-row">
			{#each templates as tmpl}
				<div class="border p-4 w-full lg:w-[30%] h-[14rem] flex flex-col rounded-lg">
					<div class="flex gap-2 items-center mb-2">
						<span class="font-bold text-slate-700 text-lg">{tmpl.name}</span>
					</div>
					<div class="mb-2">
						<span class="p-1 text-xs text-white bg-slate-400"
							>{languageShortNameMap[tmpl.languageCode]}</span
						>
					</div>
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
