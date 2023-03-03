<script lang="ts">
	import { dev } from '$app/environment';

	const mediaHost = dev ? 'http://localhost:8088' : '';

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
			<div class="additional">
				<a class="original-source" href={item.sourceUrl} target="_blank" rel="noreferrer"
					>Visit website</a
				>
			</div>
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

	.item {
		margin-top: 1rem;
		margin-bottom: 2rem;
	}

	.additional {
		display: flex;
		justify-content: right;
	}
	.original-source {
		right: 0;
		display: block;
		font-size: 80%;
	}
</style>
