<script lang="ts">
	import { getAudioSrcFromId, supportedLanguages, type LanguageCode } from '$lib/util';
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';

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
	<div class="bg-slate-50 mt-8 flex flex-col md:items-center">
		<div class="flex flex-col w-full md:w-[60%] text-center items-center">
			<span class="mt-8 p-4 font-semibold text-3xl md:text-4xl">
				BriefCast turns any website into a tiny podcast with the help of AI.
			</span>
			<span class="py-8 px-8 md:px-16">
				Staying informed shouldn't take hours of your day. Join us today and start enjoying the
				"brief" podcasts that keep you informed and up-to-date without sacrificing your life.
			</span>

			<div class="my-8 px-8 md:w-[240px] flex-col flex">
				<button
					class="btn variant-filled bg-orange-500 text-white rounded-xl"
					on:click={() => goto('/signin')}
				>
					Get started</button
				>
				<span class="py-4 text-center text-slate-600 font-semibold text-sm"
					>No credit card required</span
				>
			</div>
		</div>
	</div>
	<div class="bg-slate-700 text-white flex flex-col md:items-center">
		<div class="flex flex-col w-ful md:w-[60%] items-start md:items-center px-8">
			<span class="my-8 font-bold text-slate-50">Sign-up for free, and:</span>
			<div class="text-left md:px-16">
				<ul>
					<li>You can create multiple podcasts from news and blog or whatever website you like.</li>
					<li>Your podcasts are saved in a playlist.</li>
					<li>Your podcasts are customizable and updated automatically.</li>
				</ul>
			</div>
		</div>
		<div class="my-8 px-8 flex-col flex">
			<button
				class="btn variant-filled bg-orange-500 text-white rounded-xl"
				on:click={() => goto('/signin')}
			>
				Get started</button
			>
			<span class="py-4 text-center text-slate-400 font-semibold text-sm"
				>No credit card required</span
			>
		</div>
	</div>
</div>

<style lang="scss">
	li {
		list-style-type: disc;
		margin-left: 1rem;
	}
</style>
