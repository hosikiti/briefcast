<script lang="ts">
	import NextIcon from '$lib/icons/NextIcon.svelte';
	import PlayIcon from '$lib/icons/PlayIcon.svelte';
	import PrevIcon from '$lib/icons/PrevIcon.svelte';
	import StopPlayIcon from '$lib/icons/StopPlayIcon.svelte';
	import type { AudioPlayerItem } from '$lib/types';
	import { Howl } from 'howler';

	export let srcs: AudioPlayerItem[] = [];
	let player: Howl;
	let activeSrcIndex = 0;
	let isPlaying = false;
	let currentTime = '--:--';
	let trackTime = '--:--';

	$: currentTitle = srcs.length > 0 ? srcs[activeSrcIndex].title : '-';
	$: isLast = srcs.length > 0 && activeSrcIndex === srcs.length - 1;
	$: isFirst = srcs.length > 0 && activeSrcIndex === 0;

	export function setPlaylist(playlist: AudioPlayerItem[]) {
		srcs = playlist.slice(0);
		activeSrcIndex = 0;
		setAudio(srcs[activeSrcIndex].src);
	}

	function setAudio(src: string) {
		let autoPlay = false;
		if (player != null) {
			autoPlay = player.playing();
			player.stop();
		}
		player = new Howl({
			src: src,
			html5: true,
			format: 'audio/mp3'
		});
		player.on('play', () => {
			requestAnimationFrame(updateTime);
		});
		player.on('end', onPlayEnded);

		if (autoPlay) {
			player.play();
		}
	}

	function onPlayEnded() {
		if (!isLast) {
			activeSrcIndex++;
			setAudio(srcs[activeSrcIndex].src);
			player.play();
		} else {
			isPlaying = false;
		}
	}

	function formatTime(time: number) {
		const minutes = Math.floor(time / 60);
		const seconds = Math.floor(time % 60);
		return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
	}

	function updateTime() {
		currentTime = formatTime(player.seek());
		trackTime = formatTime(player.duration());
		if (player.playing()) {
			requestAnimationFrame(updateTime);
		}
	}

	export function play() {
		if (player.playing()) {
			isPlaying = false;
			player.pause();
		} else {
			isPlaying = true;
			player.play();
		}
	}

	export function goNextTrack() {
		if (!isLast) {
			activeSrcIndex++;
			setAudio(srcs[activeSrcIndex].src);
		}
	}

	export function goPrevTrack() {
		if (!isFirst) {
			activeSrcIndex--;
			setAudio(srcs[activeSrcIndex].src);
		}
	}
</script>

<div
	class="fixed left-0 bottom-0 bg-tranparent bg-slate-500 bg-opacity-80 gap-4 w-full h-[20vh] flex justify-center p-4 shadow-md"
>
	<div class="w-full flex flex-col gap-2 items-center justify-between">
		<!-- Time info -->
		<div class="flex flex-col w-full items-center">
			<span class="font-bold text-white">{currentTitle}</span>
			<div class="flex text-sm text-white w-full justify-between">
				<span>{currentTime}</span>
				<span>{trackTime}</span>
			</div>
		</div>
		<!-- Controls -->
		<div class="flex gap-4">
			<button
				class="btn variant-filled rounded-full bg-white shadow-md text-black flex gap-2"
				on:click={goPrevTrack}
				disabled={isFirst}
			>
				<PrevIcon />
			</button>
			{#if !isPlaying}
				<button
					on:click={play}
					class="btn variant-filled rounded-3xl bg-orange-500 shadow-md text-white flex gap-2"
				>
					<PlayIcon />
					Play</button
				>
			{:else}
				<button
					on:click={play}
					class="btn variant-filled rounded-3xl bg-orange-500 shadow-md text-white flex gap-2"
				>
					<StopPlayIcon />
					Stop</button
				>
			{/if}

			<button
				class="btn variant-filled rounded-full bg-white shadow-md text-black flex gap-2"
				on:click={goNextTrack}
				disabled={isLast}
			>
				<NextIcon />
			</button>
		</div>
	</div>
</div>
