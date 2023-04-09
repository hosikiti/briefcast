<script lang="ts">
	import type { FeedTemplate, TrialPodcastResult } from '$lib/types';
	import { getAudioSrcFromId, supportedLanguages, type LanguageCode } from '$lib/util';
	import axios from 'axios';
	import { Jumper } from 'svelte-loading-spinners';
	import LangSelect from './LangSelect.svelte';
	import LoadingSpinner from './LoadingSpinner.svelte';
	import { goto } from '$app/navigation';

	let trialPodcastTitle = 'xxx';
	let trialPodcastSrc = 'xxx';
	let trialGenerating = false;
	let selectedLanguage: LanguageCode = supportedLanguages[0];

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
		const langCode = selectedLanguage.code;

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
		} finally {
			trialGenerating = false;
		}
	};
</script>

<div class="flex w-full flex-col justify-center items-center">
	<div class="p-4">
		{#if trialPodcastSrc == ''}
			<div class="flex flex-col">
				<div class="font-serif flex-1 text-6xl py-16 pr-8">Less news, more life</div>
				<div>
					<div class="shadow-md mb-16 p-8 bg-slate-100 flex flex-col gap-2">
						<h3 class="mb-4">Choose website and generate your podcast.</h3>
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
							readonly={feedGroup.name != 'Custom'}
							bind:value={feedGroup.feedUrl}
							placeholder="RSS or Atom feed URL"
							disabled={trialGenerating}
						/>
						{#if feedGroup.name == 'Custom'}
							<label class="label my-2" for="">
								<span>Podcast Language: </span>
								<LangSelect bind:selectedLanguage />
							</label>
						{/if}
						<button
							class="mt-4 btn variant-filled bg-orange-500 text-white"
							on:click={createTrialPodCast}
							disabled={trialGenerating}>Generate</button
						>
						{#if trialGenerating}
							<div class="flex justify-center flex-col items-center p-4 text-slate-800">
								<h3>Generating your podcast ...</h3>
								<LoadingSpinner />
							</div>
						{/if}
					</div>
				</div>
			</div>
		{/if}
		{#if trialPodcastSrc != '' && !trialGenerating}
			<div class="">
				<div class="flex justify-center flex-col md:flex-row md:gap-16">
					<div class="flex flex-col">
						<h1 class="py-8 md:py-16">Your podcast is ready!</h1>
						<div class="w-full shadow-md p-4 bg-white flex flex-col gap-2">
							<p class="font-serif font-bold text-slate-700 py-4">{trialPodcastTitle}</p>
							<audio controls id="trialPodcast" class="w-full mb-4">
								<source src={trialPodcastSrc} type="audio/mpeg" />
								<em>Sorry, your browser doesn't support HTML5 audio.</em>
							</audio>

							<div class="flex justify-center gap-2">
								<button class="btn variant-soft-primary" on:click={() => (trialPodcastSrc = '')}>
									Try Again</button
								>
								<button
									class="btn variant-filled bg-orange-500 text-white"
									on:click={() => goto('/signin')}
								>
									Sign In</button
								>
							</div>
						</div>
					</div>
					<div class="flex flex-col w-full md:w-[30%]">
						<h2 class="mt-12 mb-4">What is BriefCast?</h2>
						<p>
							BriefCast is an AI-powered podcast generator that creates a podcast from a RSS feed.
						</p>
						<h3 class="mt-16 mb-4">Features</h3>
						<ul>
							<li>Generate podcasts from any website.</li>
							<li>Automatically update podcasts.</li>
							<li>Add multiple podcasts.</li>
							<li>Customize podcast content.</li>
							<li>Compatible with iOS, Android, and PC browsers.</li>
							<li>Completely free.</li>
						</ul>
						<h3 class="mt-16 mb-4">Join us today</h3>
						<p>
							Staying informed shouldn't take hours of your day. Join us today and start enjoying
							the "brief" podcasts that keep you informed and up-to-date without sacrificing your
							life.
						</p>
						<div class="w-full flex justify-center my-8">
							<button
								class="btn variant-filled bg-orange-500 text-white"
								on:click={() => goto('/signin')}
							>
								Sign In</button
							>
						</div>
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>

<style lang="scss">
	li {
		list-style-type: disc;
		margin-left: 1rem;
	}
</style>
