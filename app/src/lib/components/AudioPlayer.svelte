<script lang="ts">
	import NextIcon from '$lib/icons/NextIcon.svelte';
	import PlayIcon from '$lib/icons/PlayIcon.svelte';
	import PrevIcon from '$lib/icons/PrevIcon.svelte';
	import StopPlayIcon from '$lib/icons/StopPlayIcon.svelte';
	import type { AudioPlayerItem } from '$lib/types';
	import { formatTime } from '$lib/util';
	import { set } from 'date-fns';
	import { Howl } from 'howler';

	export let srcs: AudioPlayerItem[] = [];
	let player: Howl;
	let activeSrcIndex = 0;
	let isPlaying = false;
	let currentTime = '00:00';
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
		setSeekBar(0);
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
		setAudioMetaData(src);

		if (autoPlay) {
			player.play();
		}
	}

	function setAudioMetaData(src: string) {
		const audio = new Audio(src);
		audio.addEventListener(
			'loadedmetadata',
			() => {
				currentTime = formatTime(0);
				trackTime = formatTime(audio.duration);
			},
			{ once: true }
		);
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

	function updateTime() {
		const oldCurrentTime = currentTime;
		currentTime = formatTime(player.seek());
		trackTime = formatTime(player.duration());
		if (oldCurrentTime !== currentTime) {
			const percent = Math.floor((player.seek() / player.duration()) * 100);
			setSeekBar(percent);
		}
		if (player.playing()) {
			requestAnimationFrame(updateTime);
		}
	}

	function seek(event: MouseEvent) {
		const seekbar = document.getElementById('seekbar');
		if (seekbar != null) {
			const percent = event.offsetX / seekbar.offsetWidth;
			player.seek(player.duration() * percent);
		}
	}

	function setSeekBar(percent: number) {
		const seekbar = document.getElementById('seekbar');
		if (seekbar != null) {
			seekbar.style.backgroundSize = `${percent}%`;
		}
		const knob = document.getElementById('seekbar_knob');
		if (knob != null) {
			knob.style.left = `${percent}%`;
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
	class="fixed left-0 bottom-0 bg-tranparent bg-slate-500 bg-opacity-80 gap-4 w-full h-[23vh] md:h-[20vh] flex justify-center p-4 shadow-md"
>
	<div class="w-full md:w-[50%] flex flex-col gap-2 items-center justify-between">
		<!-- Time info -->
		<div class="flex flex-col w-full items-center">
			<span class="font-bold text-white">{currentTitle}</span>
			<!-- Seek bar -->
			<div id="seekbar" on:pointerdown={seek}>
				<div id="seekbar_knob" />
			</div>
			<div class="flex text-xs text-white w-full justify-between">
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

<style lang="scss">
	#seekbar {
		width: 100%;
		height: 3px;
		margin: 1rem 0 0.3rem 0;
		border-radius: 5px;
		background: linear-gradient(#eee, #eee) no-repeat #bbb;
		position: relative;
	}

	#seekbar_knob {
		width: 12px;
		height: 12px;
		border-radius: 50%;
		background: #fff;
		position: absolute;
		top: -4px;
		left: 0;
	}
</style>
