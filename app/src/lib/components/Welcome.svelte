<script lang="ts">
	import type { FeedTemplate, TrialPodcastResult } from '$lib/types';
	import { getAudioSrcFromId, supportedLanguages, type LanguageCode } from '$lib/util';
	import axios, { HttpStatusCode } from 'axios';
	import LangSelect from './LangSelect.svelte';
	import LoadingSpinner from './LoadingSpinner.svelte';
	import { goto } from '$app/navigation';
	import WhatIsIt from './WhatIsIt.svelte';
	import { MetaTags } from 'svelte-meta-tags';

	let trialGenerating = false;
	let selectedLanguage: LanguageCode = supportedLanguages[0];

	const feedTemplates: FeedTemplate[] = [
		{
			name: 'New York Times(English)',
			description: 'New York Times World News',
			feedUrl: 'https://rss.nytimes.com/services/xml/rss/nyt/World.xml',
			languageCode: 'en-US',
			websiteUrl: '',
			language: 'en'
		},
		{
			name: 'BBC(English)',
			description: 'BBC World News',
			feedUrl: 'http://feeds.bbci.co.uk/news/world/rss.xml',
			languageCode: 'en-US',
			websiteUrl: '',
			language: 'en'
		},
		{
			name: 'NHK(Japanese)',
			description: 'NHKニュース',
			feedUrl: 'https://www.nhk.or.jp/rss/news/cat0.xml',
			languageCode: 'ja-JP',
			websiteUrl: '',
			language: 'ja'
		},
		{
			name: 'Custom',
			description: '',
			feedUrl: '',
			languageCode: '',
			language: '',
			websiteUrl: ''
		}
	];
	let feed = feedTemplates[0];

	const createTrialPodCast = async () => {
		const feedUrl = feed.feedUrl;
		const langCode = feed.languageCode || selectedLanguage.code;

		if (!feedUrl) {
			alert('Provide a feed URL of your favorite website');
			return;
		}
		trialGenerating = true;
		try {
			const resp = await axios.post('/api/podcast/trial', {
				feedUrl: feedUrl,
				languageCode: langCode
			});
			if (resp.status != HttpStatusCode.Ok) {
				alert('import failed from: ' + feedUrl);
				return;
			}
			const result = resp.data.result as TrialPodcastResult;

			goto(
				`/trial/ready?id=${encodeURIComponent(result.id)}&title=${encodeURIComponent(result.title)}`
			);
		} catch (e) {
			alert('import failed from: ' + feedUrl);
			console.error(e);
		} finally {
			trialGenerating = false;
		}
	};
</script>

<MetaTags title="BriefCast: Less news, more life" />

<div class="flex w-full flex-col justify-center items-center">
	<div class="p-4">
		<div class="flex flex-col md:items-center">
			<div class="font-sans text-center font-bold flex-1 text-6xl pt-10 md:pt-16 mb-8">
				Less news, more life
			</div>
			<div class="font-sans font-semibold text-slate-600 flex-1 text-xl pb-10 md:pb-16 text-center">
				Spend many hours on the news every day? BriefCast saves you.
			</div>
			<div>
				<div class="shadow-md mb-8 p-8 bg-slate-100 flex flex-col gap-2">
					<span class="mb-4">Choose a website and generate a short podcast.</span>
					<div class="flex gap-4 flex-wrap">
						{#each feedTemplates as tmpl}
							<label class="flex items-center space-x-2">
								<input
									class="radio"
									type="radio"
									bind:group={feed}
									name="radio-direct"
									value={tmpl}
								/>
								<p>{tmpl.name}</p>
							</label>
						{/each}
					</div>
					<input
						class="input p-2"
						type="text"
						readonly={feed.name != 'Custom'}
						bind:value={feed.feedUrl}
						placeholder="RSS or Atom feed URL"
						disabled={trialGenerating}
					/>
					{#if feed.name == 'Custom'}
						<label class="label my-2" for="">
							<span>Podcast Language: </span>
							<LangSelect bind:selectedLanguage />
						</label>
					{/if}
					<button
						class="mt-4 btn rounded-xl variant-filled bg-orange-500 text-white flex items-center gap-1"
						on:click={createTrialPodCast}
						disabled={trialGenerating}
					>
						<LoadingSpinner show={trialGenerating} color="white" size={20} duration="1000ms" />
						{trialGenerating ? 'Generating...' : 'Generate'}
					</button>
				</div>
			</div>
		</div>
	</div>
	<WhatIsIt />
</div>
