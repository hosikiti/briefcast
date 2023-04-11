<script lang="ts">
	import { db } from '$lib/firebase';
	import { getAudioSrcFromId, getCombinedAudioSrc, sleep } from '$lib/util';
	import { collection, deleteDoc, doc, getDocs, setDoc, Timestamp } from 'firebase/firestore';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import type { Podcast } from '$lib/types';
	import { showConfirm } from '$lib/modal';
	import { formatDistance } from 'date-fns';
	import {
		ListBox,
		ListBoxItem,
		modalStore,
		popup,
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

	interface PodcastItem extends Podcast {
		audioSrc$: string;
		lastGenerateDate$: string;
		docId$: string;
	}

	let isLoading = true;
	let isPlayingAll = false;
	let playAllAudio: HTMLAudioElement | null;
	let items: PodcastItem[] = [];

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
						showToast('Changes will apply in next daily update.');
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
				items.push(data);
			});
			items = items;
		} finally {
			isLoading = false;
		}
	}

	async function playAll() {
		const uid = $page.data.userId!;
		const ids = items.map((item) => item.docId$);
		isPlayingAll = true;
		playAllAudio = new Audio(getCombinedAudioSrc(uid, ids));
		await playAudio(playAllAudio);
		isPlayingAll = false;
	}

	async function stopPlayAll() {
		if (playAllAudio) {
			playAllAudio.pause();
			playAllAudio = null;
		}
		isPlayingAll = false;
	}

	async function playAudio(audio: HTMLAudioElement) {
		return new Promise<void>(async (resolve) => {
			audio.addEventListener(
				'ended',
				() => {
					resolve();
				},
				{ once: true }
			);
			await audio.play();
		});
	}
</script>

<div class="p-4">
	<div class="flex justify-between items-center py-4">
		<h2 class="text-left ">Podcasts</h2>
		{#if items.length > 0}
			<div class="flex justify-center gap-2">
				{#if !isPlayingAll}
					<button
						on:click={playAll}
						class="btn variant-filled rounded-3xl bg-orange-500 shadow-md text-white flex gap-2"
					>
						<PlayIcon />
						Play All</button
					>
				{:else}
					<button
						on:click={stopPlayAll}
						class="btn variant-filled rounded-3xl bg-orange-500 shadow-md text-white flex gap-2"
					>
						<StopPlayIcon />
						Stop</button
					>
				{/if}
				<a
					href="/podcast/add"
					class="btn variant-ringed bg-white rounded-3xl shadow-md text-slate-700"
				>
					<PlusIcon />
				</a>
			</div>
		{/if}
	</div>
	<hr class="" />

	<div class="flex flex-col flex-wrap md:flex-row gap-4 py-4">
		{#each items as item}
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
						<span class="text-slate-400">Generating ...</span>
					{/if}
				</div>
				<audio controls class="my-4 w-full" data-id={item.docId$}>
					<source src={item.audioSrc$} type="audio/mpeg" />
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
