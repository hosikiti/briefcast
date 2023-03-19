<script lang="ts">
	import { supportedLanguages, type LanguageCode } from '$lib/util';

	let isModalOpen = false;
	let selectedLanguage = supportedLanguages[0];
	let selectedTemplate: FeedTemplate | null = null;

	let feedUrl = '';

	interface FeedTemplate {
		name: string;
		description: string;
		feedUrl: string;
	}

	const templates: FeedTemplate[] = [
		{ name: 'CNN', description: 'CNN World News', feedUrl: '' },
		{ name: 'NHK', description: 'NHKニュース', feedUrl: 'https://www.nhk.or.jp/rss/news/cat0.xml' },
		{
			name: 'Decrypt',
			description: "What's new in crypto and the advent of the decentralized web.",
			feedUrl: ''
		},
		{
			name: 'Decrypt',
			description: "What's new in crypto and the advent of the decentralized web.",
			feedUrl: ''
		},
		{
			name: 'Decrypt',
			description: "What's new in crypto and the advent of the decentralized web.",
			feedUrl: ''
		}
	];

	function handleAdd(tmpl: FeedTemplate) {
		isModalOpen = true;
		selectedTemplate = tmpl;
		feedUrl = tmpl.feedUrl;
	}

	function handleClose() {
		isModalOpen = false;
	}
</script>

<div class="p-4 flex justify-center relative">
	<div class="shadow-md p-4 bg-white md:w-[80vw] w-full">
		<h2 class="mb-8">Add podcast</h2>
		<div class="flex gap-2 mb-4">
			<input class="input p-2" type="url" placeholder="RSS/Atom feed URL" />
			<button class="btn variant-filled bg-orange-500 text-white">Add</button>
		</div>
		<hr />
		<h3 class="mt-8 mb-4">Explore</h3>
		<div class="flex flex-wrap gap-2 items-center flex-col md:flex-row">
			{#each templates as tmpl}
				<div class="border p-4 w-full md:w-[30%] h-[10rem] flex flex-col rounded-lg">
					<span class="font-bold text-slate-700 text-lg">{tmpl.name}</span>
					<span class="block text-slate-500 text-sm flex-1">{tmpl.description}</span>
					<div class="flex justify-end">
						<button class="btn variant-filled rounded-full" on:click={() => handleAdd(tmpl)}
							>Add</button
						>
					</div>
				</div>
			{/each}
		</div>
	</div>
	{#if isModalOpen}
		<div
			class="absolute z-[999] top-0 left-0 w-screen h-main bg-black bg-opacity-40 flex justify-center"
		>
			<div
				class="bg-white border p-4 shadow-lg m-8 lg:w-[60%] w-[80%] h-[50%] relative flex flex-col"
			>
				<h2>{selectedTemplate?.name || 'site'}</h2>
				<div class="flex flex-col my-4 gap-4">
					<label class="label">
						<span>Feed URL: </span>
						<input
							type="url"
							class="input p-2"
							placeholder="RSS/Atom feed URL"
							bind:value={feedUrl}
						/>
					</label>
					<label class="label">
						<span>Podcast Language: </span>
						<select class="select" bind:value={selectedLanguage}>
							{#each supportedLanguages as lang}
								<option value={lang}>
									{lang.title}
								</option>
							{/each}
						</select>
					</label>
				</div>
				<div class="flex-1" />
				<div class="flex justify-end gap-2 items-end">
					<button class="btn variant-filled bg-orange-500 text-white">Add</button>
					<button class="btn variant-soft" on:click={handleClose}>Cancel</button>
				</div>
			</div>
		</div>
	{/if}
</div>
