<script lang="ts">
	import { getAudioSrcFromId, supportedLanguages, type LanguageCode } from '$lib/util';
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';

	export let data: PageData;
	const trialPodcastTitle = data.title;
	const trialPodcastSrc = getAudioSrcFromId(data.id);
</script>

<div class="flex w-full flex-col justify-center items-center">
	<div class="p-4">
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
							<button class="btn variant-soft-primary rounded-xl" on:click={() => goto('/')}>
								Try Again</button
							>
							<button
								class="btn variant-filled bg-orange-500 text-white rounded-xl"
								on:click={() => goto('/signin')}
							>
								Get started</button
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
						Staying informed shouldn't take hours of your day. Join us today and start enjoying the
						"brief" podcasts that keep you informed and up-to-date without sacrificing your life.
					</p>
					<div class="w-full flex justify-center my-8">
						<button
							class="btn variant-filled bg-orange-500 text-white rounded-xl"
							on:click={() => goto('/signin')}
						>
							Get started</button
						>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<style lang="scss">
	li {
		list-style-type: disc;
		margin-left: 1rem;
	}
</style>
