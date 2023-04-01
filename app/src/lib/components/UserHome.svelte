<script lang="ts">
	import { db } from '$lib/firebase';
	import { getAudioSrcFromId } from '$lib/util';
	import { collection, getDocs, Timestamp } from 'firebase/firestore';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import type { Podcast } from '$lib/types';
	import { formatDistance } from 'date-fns';
	import { ListBox, ListBoxItem, popup, type PopupSettings } from '@skeletonlabs/skeleton';
	import { computePosition, flip, shift, offset, hide } from '@floating-ui/dom';

	let menuValue: string = '';
	let selectedItem: PodcastItem;

	function editSelectedItem() {}

	function deleteSelectedItem() {
		console.log('delete', selectedItem.name);
	}

	function openMenu(ev: Event, podcast: PodcastItem) {
		const popup = document.querySelector('#popup') as HTMLButtonElement;
		const el = ev.target as HTMLElement;
		menuValue = '';

		computePosition(el, popup, {
			placement: 'bottom-start',
			middleware: [flip(), shift({ padding: 5 })]
		}).then(({ x, y, middlewareData }) => {
			popup.style.left = `${x}px`;
			popup.style.top = `${y}px`;
			popup.style.visibility = 'visible';

			selectedItem = podcast;

			setTimeout(() => {
				document.body.addEventListener(
					'click',
					(docEvent) => {
						if (docEvent.target != ev.target) {
							popup.style.visibility = 'hidden';
						}
					},
					{ once: true }
				);
			});
		});
	}

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
				<div class="flex items-center justify-between">
					<h3 class="">{item.name}</h3>
					<button class="btn btn-sm p-0 text-slate-500" on:click={(ev) => openMenu(ev, item)}
						><svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="w-6 h-6"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
					</button>
				</div>
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
	<div id="popup" class="popup card shadow-md py-2 bg-white">
		<!-- Listbox -->
		<ListBox rounded="rounded-none">
			<ListBoxItem bind:group={menuValue} name="" value="edit" on:click={editSelectedItem}
				>Edit</ListBoxItem
			>
			<ListBoxItem bind:group={menuValue} name="" value="delete" on:click={deleteSelectedItem}
				>Delete</ListBoxItem
			>
		</ListBox>
	</div>
</div>

<style lang="scss">
	.popup {
		position: absolute;
		width: max-content;
		top: 0;
		left: 0;
		visibility: hidden;
	}
</style>
