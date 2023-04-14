<script lang="ts">
	import { getAudioSrcFromId, supportedLanguages, type LanguageCode } from '$lib/util';
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';
	import WhatIsIt from '$lib/components/WhatIsIt.svelte';

	export let data: PageData;
	const trialPodcastTitle = data.title;
	const trialPodcastSrc = getAudioSrcFromId(data.id);
</script>

<div class="flex w-full flex-col justify-center">
	<div class="px-8">
		<div class="flex justify-center flex-col md:flex-row md:gap-16">
			<div class="flex flex-col">
				<span class="font-sans py-8 md:py-16 text-center font-bold text-xl text-slate-700"
					>Your podcast is ready!</span
				>
				<div class="w-full shadow-md p-4 bg-white flex flex-col gap-2">
					<p class="font-sans  text-slate-700 py-4">
						Listen to a podcast generated from "{trialPodcastTitle}".
					</p>
					<audio controls id="trialPodcast" class="w-full mb-4">
						<source src={trialPodcastSrc} type="audio/mpeg" />
						<em>Sorry, your browser doesn't support HTML5 audio.</em>
					</audio>

					<div class="flex justify-center gap-2">
						<button class="btn variant-soft-primary rounded-xl" on:click={() => goto('/')}>
							Try Again</button
						>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div class="mt-8">
		<WhatIsIt />
	</div>
</div>
