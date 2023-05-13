<script lang="ts">
	import { getAudioSrcFromId, supportedLanguages, type LanguageCode } from '$lib/util';
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';
	import WhatIsIt from '$lib/components/WhatIsIt.svelte';
	import PlusIcon from '$lib/icons/PlusIcon.svelte';

	export let data: PageData;
	const trialPodcastTitle = data.title;
	const trialPodcastSrc = getAudioSrcFromId(data.id);
</script>

<div class="flex w-full flex-col justify-center">
	<div class="px-8">
		<div class="flex justify-center flex-col md:flex-row md:gap-16">
			<div class="flex flex-col md:w-[50%]">
				<span class="font-sans py-8 md:py-16 text-center font-bold text-xl text-slate-700"
					>Your podcast is generated!</span
				>
				<div class="w-full shadow-md bg-white flex flex-col gap-2">
					<span class="font-sans text-sm font-semibold  p-4 bg-slate-700 text-white">
						{trialPodcastTitle}
					</span>
					<div class="p-4 flex flex-col">
						<audio controls id="trialPodcast" class="w-full mb-4">
							<source src={trialPodcastSrc} type="audio/mpeg" />
							<em>Sorry, your browser doesn't support HTML5 audio.</em>
						</audio>

						<hr class="my-4" />
						<span class="text-md font-semibold text-slate-700 py-2 md:py-8">
							If you sign-up for free, you can add up to 5 websites, including BBC, CNN, New York
							Times, Guardian, NPR, and more.
						</span>
						<div class="my-2 flex justify-center gap-2">
							<button
								class="btn variant-filled bg-orange-500 text-white rounded-xl gap-1"
								on:click={() => goto('/signin')}
							>
								<PlusIcon />
								Generate more</button
							>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div class="mt-8">
		<WhatIsIt />
	</div>
</div>
