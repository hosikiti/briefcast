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

<div class="p-2">
	<div class="flex justify-between items-center py-4">
		<h2 class="text-left ">Your podcasts</h2>
		<button type="button" class="btn variant-filled rounded-3xl bg-orange-500 shadow-md text-white">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 20 20"
				fill="currentColor"
				class="w-5 h-5"
			>
				<path
					d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z"
				/>
			</svg>

			<span>Add site</span>
		</button>
	</div>
	<hr class="" />

	<div class="flex flex-col md:flex-row gap-4 py-4">
		{#each items as item}
			<div class="p-4 shadow-md  bg-white flex flex-col items-stretch gap-2">
				<h3 class="">{item.title}</h3>
				<audio controls class="my-4 w-full">
					<source src={item.audioSrc} type="audio/mpeg" />
					<em>Sorry, your browser doesn't support HTML5 audio.</em>
				</audio>
				<div class="flex justify-end">
					<a href={item.sourceUrl} target="_blank" rel="noreferrer" class="flex items-center gap-1">
						Visit website
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 20 20"
							fill="currentColor"
							class="w-5 h-5"
						>
							<path
								fill-rule="evenodd"
								d="M10 18a8 8 0 100-16 8 8 0 000 16zM6.75 9.25a.75.75 0 000 1.5h4.59l-2.1 1.95a.75.75 0 001.02 1.1l3.5-3.25a.75.75 0 000-1.1l-3.5-3.25a.75.75 0 10-1.02 1.1l2.1 1.95H6.75z"
								clip-rule="evenodd"
							/>
						</svg>
					</a>
				</div>
			</div>
		{/each}
	</div>
</div>
