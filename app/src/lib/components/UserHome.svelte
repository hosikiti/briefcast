<script lang="ts">
	import { db } from '$lib/firebase';
	import { getAudioSrcFromId, sleep } from '$lib/util';
	import { collection, deleteDoc, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import type { AudioPlayerItem, Podcast } from '$lib/types';
	import { showAlert, showConfirm } from '$lib/modal';
	import { formatDistance } from 'date-fns';
	import {
		ListBox,
		ListBoxItem,
		modalStore,
		type ModalComponent,
		type ModalSettings,
		type PopupSettings
	} from '@skeletonlabs/skeleton';
	import { computePosition, flip, shift, offset, hide } from '@floating-ui/dom';
	import AddEditPodcastModal from './AddEditPodcastModal.svelte';
	import PlusIcon from '$lib/icons/PlusIcon.svelte';
	import EllipsisHCircle from '$lib/icons/EllipsisHCircleIcon.svelte';
	import PlayIcon from '$lib/icons/PlayIcon.svelte';
	import LoadingSpinner from './LoadingSpinner.svelte';
	import StopPlayIcon from '$lib/icons/StopPlayIcon.svelte';
	import { goto } from '$app/navigation';
	import { showToast } from '$lib/toast';
	import { MAX_PODCAST_PER_PLAYLIST } from '$lib/constant';
	import { MetaTags } from 'svelte-meta-tags';
	import GoExternalIcon from '$lib/icons/GoExternalIcon.svelte';
	import { getSummarizerCache } from '$lib/repository/summarizer_cache.repository';
	import AudioPlayer from './AudioPlayer.svelte';

	interface PodcastItem extends Podcast {
		audioSrc$: string;
		lastGenerateDate$: string;
		docId$: string;
	}

	let isLoading = true;
	let isPlayingAll = false;
	let player: Howl | null = null;
	let items: PodcastItem[] = [];
	let checkNewAudioTimer: NodeJS.Timer;
	let play: () => void;
	let setPlaylist: (playlist: AudioPlayerItem[]) => void;

	onMount(() => {
		loadDefaultPlaylist();
	});

	let menuValue: string = ''; // needed for ListItem component
	let selectedItem: PodcastItem | null;

	function editSelectedItem() {
		if (!selectedItem) return;

		const d: ModalSettings = {
			type: 'component',
			// Pass the component directly:
			component: {
				// Pass a reference to your custom component
				ref: AddEditPodcastModal,
				// Add the component properties as key/value pairs
				props: {
					formData: selectedItem,
					isUpdate: true
				}
			} as ModalComponent,
			response: async (podcast: Podcast | boolean) => {
				if (podcast instanceof Object) {
					try {
						const docId = selectedItem!.docId$;
						const docRef = doc(db, `playlists/${$page.data.userId}/default/${docId}`);
						// set null values for undefined key
						const data = {} as Podcast;
						for (const key in podcast) {
							if (podcast[key] === undefined || key.endsWith('$')) {
								continue;
							}
							data[key] = podcast[key];
						}
						await setDoc(docRef, data);

						// update the item
						items = [];
						await loadDefaultPlaylist();
						showToast('Changes will apply in next daily update. Hang tight!');
					} catch (e) {
						alert('save failed');
						console.error(e);
					}
				}
			}
		};

		modalStore.trigger(d);
	}

	async function removeSelectedItem() {
		if (!selectedItem) return;
		const yes = await showConfirm(
			`Remove '${selectedItem.name}' from your playlist?`,
			`Yes, Remove`
		);
		if (!yes) {
			return;
		}
		const docId = selectedItem!.docId$;
		const uid = $page.data.userId;
		await deleteDoc(doc(db, `playlists/${uid}/default/${docId}`));
		// remove from the list
		items = items.filter((item) => item.docId$ != docId);
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

	async function loadDefaultPlaylist() {
		try {
			isLoading = true;
			items = await getDefaultPlaylist();

			setPlaylist(
				items.map((item) => {
					return {
						src: item.audioSrc$,
						title: item.name
					};
				})
			);

			// New podcast that is just added may not have audio yet.
			// so, check new generated audio by using timer.
			const hasNotGenerated = items.findIndex((item) => !item.lastGenerate) >= 0;
			if (hasNotGenerated) {
				if (checkNewAudioTimer) {
					clearInterval(checkNewAudioTimer);
				}
				checkNewAudioTimer = setInterval(() => {
					updateGeneratedAudio();
				}, 10000);
			}
		} finally {
			isLoading = false;
		}
	}

	async function updateGeneratedAudio() {
		const notYetGenerated = items.find((item) => !item.lastGenerate);
		if (!notYetGenerated) {
			clearInterval(checkNewAudioTimer);
			return;
		}
		const newItems = await getDefaultPlaylist();
		items = items.map((item) => {
			if (!item.lastGenerate) {
				const newItem = newItems.find(
					(newItem) => newItem.docId$ == item.docId$ && newItem.lastGenerate
				);
				if (newItem) {
					// force reload audio
					setTimeout(() => {
						const audio = document.querySelector(`audio[data-id='${newItem.docId$}']`);
						if (audio instanceof HTMLAudioElement) {
							audio.load();
						}
					}, 100);
					return newItem;
				}
			}
			return item;
		});
	}

	async function getDefaultPlaylist() {
		const newItems: PodcastItem[] = [];
		const uid = $page.data.userId;
		const playlistRef = collection(db, `playlists/${uid}/default`);
		(await getDocs(playlistRef)).docs.forEach((doc) => {
			const data = doc.data() as PodcastItem;
			const docId = doc.id;

			// format last generate date
			const lastGenerate = data.lastGenerate?.toDate();
			let lastGenerateDate = '';
			if (lastGenerate) {
				lastGenerateDate = formatDistance(lastGenerate, new Date(), { addSuffix: true });
			}

			const id = `${uid}/${docId}`;
			data.audioSrc$ = getAudioSrcFromId(id);
			data.lastGenerateDate$ = lastGenerateDate;
			data.docId$ = docId;
			newItems.push(data);
		});
		return newItems;
	}

	async function showTranscript(item: PodcastItem) {
		if (!item.lastTranscriptHash) {
			return;
		}
		const transcript = await getSummarizerCache(item.lastTranscriptHash);
		const html = `<div class="max-h-[200px] overflow-scroll">${transcript}</div>`;
		showAlert(item.name, 'Close', html, 'modal-transcript');
	}
</script>

<MetaTags title="BriefCast" />

<div class="p-4">
	<div class="flex justify-between items-center py-4">
		<h2 class="text-left">Podcasts</h2>
		{#if items.length > 0}
			<div class="flex justify-center gap-2">
				<button
					disabled={items.length >= MAX_PODCAST_PER_PLAYLIST}
					on:click={() => goto('/podcast/add')}
					class="btn variant-ringed bg-white rounded-3xl shadow-md text-slate-700"
				>
					<PlusIcon />
				</button>
			</div>
		{/if}
	</div>
	<hr class="" />

	<div class="flex flex-col flex-wrap md:flex-row gap-4 py-4">
		{#each items as item (item.docId$)}
			<div class="p-4 shadow-md bg-white flex flex-col items-stretch gap-2 min-w-[30vw]">
				<div class="flex items-center justify-between">
					<h3 class="">{item.name}</h3>
					<button class="btn btn-sm p-0 text-slate-500" on:click={(ev) => openMenu(ev, item)}>
						<EllipsisHCircle />
					</button>
				</div>
				<div class="flex text-xs text-slate-500 gap-1">
					{#if item.lastGenerateDate$}
						<span class="text-slate-400">Generated:</span>
						<span>{item.lastGenerateDate$}</span>
					{:else}
						<span class="text-slate-400">Generating ... It may take 20-30 seconds.</span>
					{/if}
				</div>
				<audio controls class="my-4 w-full" data-id={item.docId$}>
					<source src={item.audioSrc$} type="audio/mpeg" />
					<em>Sorry, your browser doesn't support HTML5 audio.</em>
				</audio>
				<div class="flex justify-end gap-4">
					{#if item.lastTranscriptHash}
						<button
							class="text-slate-700"
							title="Show transcript"
							on:click={() => showTranscript(item)}
						>
							<svg
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
									d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
								/>
							</svg>
						</button>
					{/if}
					<a
						href={item.websiteUrl}
						target="_blank"
						rel="noreferrer"
						class="flex items-center gap-1"
					>
						Visit website
						<GoExternalIcon />
					</a>
				</div>
			</div>
		{/each}
	</div>
	{#if isLoading}
		<div class="flex justify-center items-center h-[10rem]">
			<LoadingSpinner />
		</div>
	{/if}
	{#if !isLoading && items.length == 0}
		<div class="py-16 w-full flex flex-col items-center">
			<span class="py-10 text-xl font-serif text-slate-400">No podcasts yet</span>
			<button
				on:click={() => goto('/podcast/add')}
				class="my-4 btn variant-filled bg-orange-500 text-white rounded-xl shadow-md flex gap-2"
				><PlusIcon /> Generate</button
			>
		</div>
	{/if}
	<div id="popup" class="popup card shadow-md py-2 bg-white">
		<!-- Listbox -->
		<ListBox rounded="rounded-none">
			<ListBoxItem bind:group={menuValue} name="" value="edit" on:click={editSelectedItem}
				>Edit</ListBoxItem
			>
			<ListBoxItem bind:group={menuValue} name="" value="delete" on:click={removeSelectedItem}
				>Remove</ListBoxItem
			>
		</ListBox>
	</div>
	<AudioPlayer bind:play bind:setPlaylist />
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
