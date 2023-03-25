<script lang="ts">
	import { getAudioSrcFromId, supportedLanguages, type LanguageCode } from '$lib/util';
	import axios from 'axios';
	import { Jumper } from 'svelte-loading-spinners';

	let trialPodcastSrc = '';
	let trialGenerating = false;
	let selectedLanguage: LanguageCode = supportedLanguages[0];

	interface CreatePodCastParam {
		feedUrl: string;
		title: string;
	}

	let createPodCastParam: CreatePodCastParam = {
		feedUrl: '',
		title: ''
	};

	const createTrialPodCast = async () => {
		if (!createPodCastParam.feedUrl) {
			alert('Provide a feed URL of your favorite website');
			return;
		}
		trialGenerating = true;
		try {
			const resp = await axios.post('/podcast/trial/generate', {
				feedUrl: createPodCastParam.feedUrl,
				languageCode: selectedLanguage.code
			});
			if (resp.status != 200) {
				alert('import failed from: ' + createPodCastParam.feedUrl);
				return;
			}
			const mediaId = resp.data['id'];
			trialPodcastSrc = getAudioSrcFromId(mediaId);
			const el = document.querySelector('#trialPodcast');
			if (el instanceof HTMLAudioElement) {
				el.load();
			}
		} catch (e) {
			alert('import failed from: ' + createPodCastParam.feedUrl);
			console.error(e);
		}
		trialGenerating = false;
	};
</script>

<div class="flex flex-col justify-center items-center overflow-scroll">
	<div class="font-serif text-6xl py-16 px-8">Less news, more life</div>
	<div class="p-4">
		<h3 class="p-4">Try generate your Podcast with <b>BriefCast</b></h3>
		<div class="shadow-md p-8 bg-slate-100 flex flex-col gap-2">
			<span class="font-bold">Choose from famous news websites: </span>
			<div class="flex gap-4">
				<label class="flex items-center space-x-2">
					<input class="radio" type="radio" checked name="radio-direct" value="1" />
					<p>CNN</p>
				</label>
				<label class="flex items-center space-x-2">
					<input class="radio" type="radio" checked name="radio-direct" value="1" />
					<p>NHK</p>
				</label>
				<label class="flex items-center space-x-2">
					<input class="radio" type="radio" checked name="radio-direct" value="1" />
					<p>Your source</p>
				</label>
			</div>
			<span>or input your favorite website's feed URL</span>
			<input
				class="input p-2"
				type="text"
				bind:value={createPodCastParam.feedUrl}
				placeholder="RSS or Atom feed URL"
				disabled={trialGenerating}
			/>
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
			<button
				class="btn variant-filled bg-orange-500 text-white"
				on:click={createTrialPodCast}
				disabled={trialGenerating}>Generate</button
			>
		</div>
		{#if trialGenerating}
			<div class="">
				<h2>Generating your original podcast ...</h2>
				<Jumper size="60" color="#FF3E00" unit="px" duration="1s" />
			</div>
		{/if}
		{#if trialPodcastSrc != '' && !trialGenerating}
			<div class="">
				<h2>Your podcast is ready! Let's listen to it.</h2>
				<audio controls id="trialPodcast">
					<source src={trialPodcastSrc} type="audio/mpeg" />
					<em>Sorry, your browser doesn't support HTML5 audio.</em>
				</audio>
			</div>
		{/if}
	</div>
</div>
