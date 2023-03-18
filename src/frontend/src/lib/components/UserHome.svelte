<script lang="ts">
	import { getAudioSrcFromId } from '$lib/util';

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
</script>

<h2 class="text-left mt-8 mb-8">Your podcasts</h2>
<hr class="" />

<div class="flex flex-col md:flex-row gap-4 py-4">
	{#each items as item}
		<div class="p-4 shadow-md bg-slate-300">
			<h3 class="mb-4">{item.title}</h3>
			<audio controls class="my-4">
				<source src={item.audioSrc} type="audio/mpeg" />
				<em>Sorry, your browser doesn't support HTML5 audio.</em>
			</audio>
			<div class="flex justify-end">
				<a class="" href={item.sourceUrl} target="_blank" rel="noreferrer">Visit website</a>
			</div>
		</div>
	{/each}
</div>
