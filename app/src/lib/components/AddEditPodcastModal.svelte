<script lang="ts">
	import { isEnglish, supportedLanguages, type LanguageCode } from '$lib/util';
	import LangSelect from './LangSelect.svelte';
	import { modalStore, type ModalSettings } from '@skeletonlabs/skeleton';
	import type { Podcast } from '$lib/types';
	import { onMount } from 'svelte';

	const DEFAULT_PROMPT_EN = `Summarize this into a transcript using the following steps:
1. Summarize each topic into a 30 words simple English pod cast transcript. 
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
		const ok = confirm('Current template will be overwritten. Okay?');
		if (ok) {
			setPromptBasedOnLanguage(true);
		}
	}
</script>

<div class="bg-white border p-4 shadow-lg w-full lg:w-[60%] relative flex flex-col">
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
			<textarea class="textarea text-sm" rows="5" bind:value={formData.prompt} />
			<div class="flex items-center gap-2">
				<button class="btn btn-sm variant-filled-primary" on:click={setDefaultTemplate}
					>Set default template</button
				>
				<span class="text-sm text-slate-600"
					>Note: a prompt must contain {'{'}feedItems{'}'} to embed feed content.</span
				>
			</div>
		</label>
	</div>
	<div class="flex-1" />
	<div class="flex justify-end gap-2 items-end">
		<button class="btn variant-filled bg-orange-500 text-white" on:click={onSubmit}>Add</button>
		<button class="btn variant-soft" on:click={onCancel}>Cancel</button>
	</div>
</div>
