<script lang="ts">
	import { getAudioSrcFromId, isEnglish, supportedLanguages, type LanguageCode } from '$lib/util';
	import LangSelect from './LangSelect.svelte';
	import { modalStore, type ModalSettings } from '@skeletonlabs/skeleton';
	import type { Podcast, TrialPodcastResult } from '$lib/types';
	import PlayIcon from '$lib/icons/PlayIcon.svelte';
	import axios from 'axios';
	import LoadingSpinner from './LoadingSpinner.svelte';
	import StopPlayIcon from '$lib/icons/StopPlayIcon.svelte';

	const DEFAULT_PROMPT_EN = `Summarize this into a transcript using the following steps:
1. Summarize each topic into a 30 words English pod cast transcript. 
2. Combine them into one string until it reaches 200 bytes.
---
{feedItems}`;

	const DEFAULT_PROMPT_JA = `次のトピックのリストを150文字以内のラジオ原稿に変換してください。以下の手順で実施してください。
1) トピック毎に、25文字以内の「ですます調」のラジオ原稿に変換する。
2) 全てのトピックを結合し、150文字を超えたら処理を終える。
---
{feedItems}`;

	export let parent: any;
	export let formData: Podcast;
	let isPreviewing = false;
	let isPreviewGenerating = false;
	let selectedLanguage: LanguageCode =
		supportedLanguages.find((sl) => sl.code == formData.language) || supportedLanguages[0];

	function setPromptBasedOnLanguage(force = false) {
		if (formData.prompt && !force) {
			return;
		}
		if (isEnglish(selectedLanguage.code)) {
			formData.prompt = DEFAULT_PROMPT_EN;
		} else {
			formData.prompt = DEFAULT_PROMPT_JA;
		}
	}

	setPromptBasedOnLanguage();

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

	function setDefaultTemplate() {
		const ok = confirm('Current prompt will be overwritten. Okay?');
		if (ok) {
			setPromptBasedOnLanguage(true);
		}
	}

	async function onPreview() {
		if (!formData.feedUrl) {
			alert('Provide a feed URL of your favorite website');
			return;
		}
		isPreviewGenerating = true;
		try {
			const resp = await axios.post('/api/podcast/trial', {
				feedUrl: formData.feedUrl,
				prompt: formData.prompt,
				languageCode: selectedLanguage.code,
				isPreview: true
			});
			if (resp.status != 200) {
				alert('import failed from: ' + formData.feedUrl);
				return;
			}
			const result = resp.data.result as TrialPodcastResult;
			const audioSrc = getAudioSrcFromId(result.id);

			const audio = new Audio(audioSrc);
			audio.addEventListener('ended', (ev) => {
				isPreviewing = false;
			});

			await audio.play();
			isPreviewing = true;
		} catch (e) {
			alert('import failed from: ' + formData.feedUrl);
			console.error(e);
		} finally {
			isPreviewGenerating = false;
		}
	}
</script>

<div class="bg-white border p-4 shadow-lg w-full lg:w-[60%] relative flex flex-col">
	<div class="flex flex-col my-4 gap-4">
		<div class="flex flex-col md:flex-row gap-2">
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
		</div>
		<label class="label" for="">
			<span>Podcast Language: </span>
			<LangSelect bind:selectedLanguage />
		</label>
		<label class="label">
			<span>Prompt for your podcast transcript: </span>
			<textarea class="textarea text-sm" rows="5" bind:value={formData.prompt} />
			<div class="flex gap-2 flex-col md:flex-row md:items-center md:justify-between">
				<span class="text-sm text-slate-600 hidden md:block"
					>Note: Prompt must contain {'{'}feedItems{'}'} to embed feed content.</span
				>
				<div class="flex gap-2 flex-col md:flex-row">
					<button
						class="btn btn-sm variant-ringed-primary text-primary-700"
						on:click={setDefaultTemplate}>Set default prompt</button
					>

					<button
						class="btn variant-filled-surface rounded-full text-white flex items-center gap-1"
						on:click={onPreview}
						disabled={isPreviewGenerating}
					>
						{#if isPreviewGenerating}
							<LoadingSpinner size={20} duration="1s" color="#FFFFFF" />
						{:else if isPreviewing}
							<StopPlayIcon />
							Stop
						{:else}
							<PlayIcon />
							Preview
						{/if}
					</button>
				</div>
			</div>
		</label>
	</div>
	<div class="flex-1" />
	<div class="flex justify-between items-center" />

	<div class="mt-4 flex justify-end gap-2 items-end">
		<button class="btn variant-soft" on:click={onCancel}>Cancel</button>
		<button class="btn variant-filled bg-orange-500 text-white" on:click={onSubmit}>Add</button>
	</div>
</div>
