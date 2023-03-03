<svelte:head>
	<title>About</title>
	<meta name="description" content="About this app" />
</svelte:head>

<div class="text-column">
	<h1>About BriefCast</h1>
	<p class="description">
		BriefCast is an AI-powered short podcast generator from any online resources.
	</p>
	<h2>How it works</h2>
	<ol>
		<li>
			Pick a web site: Briefcast works seamlessly with any websites that offers RSS/ATOM feeds.
		</li>
		<li>
			Write a transcript: Briefcast has prompt templates to automatically generate your podcast
			transcript about the source. You can select one or customize it.
		</li>
		<li>
			Choose your favorite voice: Briefcast turns the transcript into natural sounding podcast audio
			with the voice you choose.
		</li>
		<li>Briefcast automatically updates your podcast. Enjoy your podcast!</li>
	</ol>
</div>

<style>
	.text-column {
		font-family: serif;
	}

	.description {
		text-align: center;
	}

	li {
		line-height: 2rem;
	}

	h1 {
	}

	h2 {
		font-weight: bold;
		text-align: center;
		margin: 2rem 0;
	}
</style>
