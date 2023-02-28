<script lang="ts">
	import { dev } from '$app/environment';
	import { identity } from 'svelte/internal';

	const mediaHost = dev ? 'http://localhost:8088' : '';

	interface BriefCastItem {
		id: string;
		title: string;
		audioSrc: string;
	}

	const items: BriefCastItem[] = [
		{ id: 'nhk', title: 'NHK' },
		{ id: 'cnn', title: 'CNN' }
	].map((item) => {
		return {
			id: item.id,
			title: item.title,
			audioSrc: mediaHost + '/media?id=' + item.id
		};
	});
</script>

<section>
	<h1>BriefCast</h1>

	<h2>Stay on top of the news in seconds</h2>

	{#each items as item}
		<div class="item">
			<h2>{item.title}</h2>
			<audio controls>
				<source src={item.audioSrc} type="audio/mpeg" />
				<em>Sorry, your browser doesn't support HTML5 audio.</em>
			</audio>
		</div>
	{/each}
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: top;
		align-items: center;
		flex: 0.6;
	}

	h1 {
		width: 100%;
		font-size: 300%;
		font-family: serif;
		margin: 1rem 0;
	}

	h2 {
		font-family: serif;
	}
</style>
