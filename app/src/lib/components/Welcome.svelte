<script lang="ts">
	import type { FeedTemplate } from '$lib/types';
	import { getAudioSrcFromId, supportedLanguages, type LanguageCode } from '$lib/util';
	import axios from 'axios';
	import { Jumper } from 'svelte-loading-spinners';

	let trialPodcastTitle = '';
	let trialPodcastSrc = '';
	let trialGenerating = false;
	let selectedLanguage: LanguageCode = supportedLanguages[0];

	interface TrialPodcastResult {
		id: string;
		title: string;
	}

	const feedTemplates: FeedTemplate[] = [
		{
			name: 'CNN',
			description: 'CNN World News',
			feedUrl: 'http://rss.cnn.com/rss/edition.rss',
			languageCode: 'en-US',
			websiteUrl: '',
			language: ''
		},
		{
			name: 'NHK',
			description: 'NHKニュース',
			feedUrl: 'https://www.nhk.or.jp/rss/news/cat0.xml',
			languageCode: 'ja-JP',
			websiteUrl: '',
			language: ''
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
	let feedGroup = feedTemplates[0];

	const createTrialPodCast = async () => {
		const feedUrl = feedGroup.feedUrl;
		const langCode = feedGroup.languageCode;

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
			if (resp.status != 200) {
				alert('import failed from: ' + feedUrl);
				return;
			}
			const result = resp.data.result as TrialPodcastResult;
			trialPodcastSrc = getAudioSrcFromId(result.id);
			trialPodcastTitle = result.title;
			const el = document.querySelector('#trialPodcast');
			if (el instanceof HTMLAudioElement) {
				el.load();
			}
		} catch (e) {
			alert('import failed from: ' + feedUrl);
			console.error(e);
		}
		trialGenerating = false;
	};
</script>

<div class="flex flex-col justify-center items-center overflow-scroll">
	<div class="font-serif text-6xl py-8 px-8">Less news, more life</div>
	<div class="p-4">
		{#if trialPodcastSrc == ''}
			<h3 class="p-4"><b>BriefCast</b> generates a short podcast from any website.</h3>
			<div class="shadow-md p-8 bg-slate-100 flex flex-col gap-2">
				<span class="font-bold">Choose from news websites: </span>
				<div class="flex gap-4">
					{#each feedTemplates as tmpl}
						<label class="flex items-center space-x-2">
							<input
								class="radio"
								type="radio"
								bind:group={feedGroup}
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
					readonly={feedGroup.feedUrl != ''}
					bind:value={feedGroup.feedUrl}
					placeholder="RSS or Atom feed URL"
					disabled={trialGenerating}
				/>
				{#if feedGroup.feedUrl == '-'}
					<span class="mt-8">Options</span>
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
				{/if}
				<button
					class="btn variant-filled bg-orange-500 text-white"
					on:click={createTrialPodCast}
					disabled={trialGenerating}>Generate</button
				>
			</div>
			{#if trialGenerating}
				<div class="flex justify-center flex-col items-center p-4 text-slate-800">
					<h3>Generating your podcast ...</h3>
					<Jumper size="60" color="#FF3E00" unit="px" duration="2s" />
				</div>
			{/if}
		{/if}
		{#if trialPodcastSrc != '' && !trialGenerating}
			<h3 class="p-4">Your podcast is ready! Let's listen.</h3>
			<div class="shadow-md p-4 bg-white flex flex-col gap-2">
				<p class="font-serif font-bold">{trialPodcastTitle}</p>
				<audio controls id="trialPodcast" class="w-full mb-4">
					<source src={trialPodcastSrc} type="audio/mpeg" />
					<em>Sorry, your browser doesn't support HTML5 audio.</em>
				</audio>

				<div class="flex justify-center">
					<button
						class="btn variant-filled bg-slate-500 text-white"
						on:click={() => (trialPodcastSrc = '')}
					>
						Try Again</button
					>
				</div>
			</div>
		{/if}
	</div>
</div>
