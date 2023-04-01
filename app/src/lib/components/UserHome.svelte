<script lang="ts">
	import { db } from '$lib/firebase';
	import { getAudioSrcFromId } from '$lib/util';
	import { collection, getDocs, Timestamp } from 'firebase/firestore';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import type { Podcast } from '$lib/types';
	import { formatDistance } from 'date-fns';

	interface PodcastItem extends Podcast {
		audioSrc: string;
		lastGenerateDate: string;
	}

	let items: PodcastItem[] = [];

	onMount(() => {
		loadDefaultPlaylist();
	});

	async function loadDefaultPlaylist() {
		const uid = $page.data.userId;
		const playlistRef = collection(db, `playlists/${uid}/default`);
		(await getDocs(playlistRef)).docs.forEach((doc) => {
			const data = doc.data() as PodcastItem;
			console.log(data);
			const podcastId = doc.id;

			// format last generate date
			const lastGenerate = data.lastGenerate?.toDate();
			let lastGenerateDate = '';
			if (lastGenerate) {
				lastGenerateDate = formatDistance(lastGenerate, new Date(), { addSuffix: true });
			}

			const id = `${uid}/${podcastId}`;
			data.audioSrc = getAudioSrcFromId(id);
			data.lastGenerateDate = lastGenerateDate;
			items.push(data);
		});
		items = items;
	}
</script>

<div class="p-4">
	<div class="flex justify-between items-center py-4">
		<h2 class="text-left ">Your podcasts</h2>
		<a
			href="/podcast/add"
			class="btn variant-filled rounded-3xl bg-orange-500 shadow-md text-white"
		>
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
		</a>
	</div>
	<hr class="" />

	<div class="flex flex-col flex-wrap md:flex-row gap-4 py-4">
		{#each items as item}
			<div class="p-4 shadow-md bg-white flex flex-col items-stretch gap-2 min-w-[30vw]">
				<h3 class="">{item.name}</h3>
				<div class="flex text-xs text-slate-500">
					<span class="text-slate-400">Generated: </span>
					<span>{item.lastGenerateDate}</span>
				</div>
				<audio controls class="my-4 w-full">
					<source src={item.audioSrc} type="audio/mpeg" />
					<em>Sorry, your browser doesn't support HTML5 audio.</em>
				</audio>
				<div class="flex justify-end">
					<a
						href={item.websiteUrl}
						target="_blank"
						rel="noreferrer"
						class="flex items-center gap-1"
					>
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
