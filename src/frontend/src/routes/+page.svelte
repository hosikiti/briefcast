<script lang="ts">
	import { dev } from '$app/environment';
	import { collection, getDocs, query, where, addDoc } from 'firebase/firestore';
	import axios from 'axios';
	import { Jumper } from 'svelte-loading-spinners';
	const languages: LanguageCode[] = [
		{ code: 'en-US', title: 'English (US)' },
		{ code: 'ja-JP', title: '日本語' }
	];

	let trialPodcastSrc = '';
	let trialGenerating = false;
	let selectedLanguage: LanguageCode = languages[0];

	interface LanguageCode {
		code: string;
		title: string;
	}

	interface CreatePodCastParam {
		feedUrl: string;
		title: string;
	}

	const apiHost = dev ? 'http://localhost:8088' : '';

	let createPodCastParam: CreatePodCastParam = {
		feedUrl: '',
		title: ''
	};

	const getAudioSrcFromId = (id: string): string => {
		return apiHost + '/media?id=' + id;
	};

	interface BriefCastItem {
		id: string;
		title: string;
		audioSrc: string;
		sourceUrl: string;
	}

	const items: BriefCastItem[] = [
		{ id: 'nhk', title: 'NHK', sourceUrl: 'http://www3.nhk.or.jp/news/' },
		{
			id: 'cnn',
			title: 'CNN in simple English',
			sourceUrl: 'https://edition.cnn.com/'
		}
	].map((item) => {
		return {
			id: item.id,
			title: item.title,
			sourceUrl: item.sourceUrl,
			audioSrc: getAudioSrcFromId(item.id)
		};
	});

	const createTrialPodCast = async () => {
		if (!createPodCastParam.feedUrl) {
			alert('Provide a feed URL of your favorite website');
			return;
		}
		trialGenerating = true;
		try {
			const resp = await axios.post(apiHost + '/podcast/trial/generate', {
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

<section>
	<h1>BriefCast</h1>

	<h2>Stay on top of the news in seconds</h2>

	<div class="trial">
		<h2>Generate Your Podcast from ...</h2>
		<div class="url-area">
			<input
				class="trial-url"
				type="text"
				bind:value={createPodCastParam.feedUrl}
				placeholder="Input RSS or Atom feed URL here!"
				disabled={trialGenerating}
			/>
			<select bind:value={selectedLanguage}>
				{#each languages as lang}
					<option value={lang}>
						{lang.title}
					</option>
				{/each}
			</select>
			<input
				class="btn btn-generate"
				type="button"
				on:click={createTrialPodCast}
				value="Generate"
				disabled={trialGenerating}
			/>
		</div>
		{#if trialGenerating}
			<div class="generating-status">
				<h2>Generating your original podcast ...</h2>
				<Jumper size="60" color="#FF3E00" unit="px" duration="1s" />
			</div>
		{/if}
		{#if trialPodcastSrc != '' && !trialGenerating}
			<div class="audio-area">
				<h2>Your podcast is ready! Let's listen to it.</h2>
				<audio controls id="trialPodcast">
					<source src={trialPodcastSrc} type="audio/mpeg" />
					<em>Sorry, your browser doesn't support HTML5 audio.</em>
				</audio>
			</div>
		{/if}
	</div>

	{#each items as item}
		<div class="item">
			<h3>{item.title}</h3>
			<audio controls>
				<source src={item.audioSrc} type="audio/mpeg" />
				<em>Sorry, your browser doesn't support HTML5 audio.</em>
			</audio>
			<div class="additional">
				<a class="original-source" href={item.sourceUrl} target="_blank" rel="noreferrer"
					>Visit website</a
				>
			</div>
		</div>
	{/each}
</section>

<style lang="scss">
	section {
		display: flex;
		flex-direction: column;
		justify-content: top;
		align-items: center;
		flex: 0.6;
	}

	h1 {
		width: 100%;
		font-size: 300%;
		font-family: serif;
		margin: 1rem 0;
	}

	h2 {
		font-size: 130%;
	}

	h2,
	h3 {
		font-family: serif;
	}

	.item {
		margin-top: 1rem;
		margin-bottom: 2rem;
	}

	.additional {
		display: flex;
		justify-content: right;
	}
	.original-source {
		right: 0;
		display: block;
		font-size: 80%;
	}

	input.btn {
		background-color: var(--color-theme-1);
		color: white;
		border: none;
		padding: 0.5rem 1rem;

		&:disabled {
			background-color: #ccc;
		}
	}

	.trial {
		background-color: white;
		width: 100%;
		margin: 1rem 0;
		padding: 1.5rem 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		box-shadow: 0px 7px 18px -9px rgba(0, 0, 0, 0.6);

		.url-area {
			display: flex;
			flex-wrap: wrap;
			justify-content: center;
			width: 80%;

			> h2 {
				align-self: flex-start;
			}

			.trial-url {
				flex: 2;
			}

			.btn-generate {
				flex: 1;
			}
		}

		.audio-area {
			width: 80%;
			justify-content: center;
		}

		.generating-status {
			align-items: center;
			display: flex;
			flex-direction: column;
			padding: 0 1rem;
		}
	}
</style>
