<script>
	import { goto } from '$app/navigation';
	import PlayIcon from '$lib/icons/PlayIcon.svelte';
</script>

<div class="bg-slate-50 w-full flex flex-col md:items-center">
	<div class="flex flex-col w-full md:w-[70%] text-center items-center">
		<span class="mt-8 p-4 py-6 font-semibold text-3xl md:text-4xl">
			Make any website into a podcast
		</span>
		<span class="pb-8 px-8 md:px-20 text-xl">
			BriefCast converts a website into a short podcast you can consume within 1 minute!
		</span>

		<div class="flex px-8 flex-col w-full">
			<div class="py-8 mb-16 flex flex-col items-center md:items-start">
				<span class="text-3xl font-bold text-slate-800">Listen to a website's summary</span>
				<span class="py-2"
					>BriefCast automatically summarizes the content of the website with the help of AI and
					converts it into a podcast.</span
				>
				<PlayIcon size={20} additionalClass="text-slate-700" />
			</div>
			<div class="py-8 mb-16 flex flex-col items-center md:items-start">
				<span class="text-3xl font-bold text-slate-800">Tailor your podcast content</span>
				<span class="py-2"
					>Want to exclude specific topic from the news? Want to generate an English learning
					podcast from the latest BBC news?</span
				>
				<span class="py-4">You can ask BriefCast whatever you want.</span>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="w-20 h-20 text-slate-700"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
					/>
				</svg>
			</div>
			<div class="py-8 mb-16 flex flex-col items-center md:items-start">
				<span class="text-3xl font-bold text-slate-800">Get updates automatically</span>
				<span class="py-2"
					>Podcasts in your playlist are automatically updated with the latest content of the site.</span
				>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="w-20 h-20 text-slate-700"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
					/>
				</svg>
			</div>
		</div>

		<span class="py-8 px-8 md:px-20 text-xl">
			Join us and start enjoying the "brief" podcasts that keep you informed and up-to-date without
			sacrificing your life.
		</span>
		<div class="my-8 px-8 md:w-[240px] flex-col flex">
			<button
				class="btn variant-filled bg-orange-500 text-white rounded-xl"
				on:click={() => goto('/signin')}
			>
				Get started</button
			>
			<span class="py-4 text-center text-slate-600 font-semibold text-sm"
				>No credit card required</span
			>
		</div>
	</div>
</div>
<div class="bg-slate-700 w-full text-white flex flex-col md:items-center">
	<div class="flex flex-col w-full md:w-[60%] items-center  px-8">
		<span class="my-8 font-bold text-slate-50">Sign-up for free, and:</span>
		<div class="text-left md:px-16">
			<ul>
				<li>You can create multiple podcasts from news, blog, and whatever.</li>
				<li>Your podcasts are saved in a playlist.</li>
				<li>Your podcasts are customizable and updated every day.</li>
			</ul>
		</div>
		<div class="my-8 px-8 md:w-[240px] flex-col flex">
			<button
				class="btn variant-filled bg-orange-500 text-white rounded-xl"
				on:click={() => goto('/signin')}
			>
				Get started</button
			>
			<span class="py-4 text-center text-slate-400 font-semibold text-sm"
				>No credit card required</span
			>
		</div>
	</div>
</div>

<style lang="scss">
	li {
		list-style-type: disc;
		margin-left: 1rem;
	}
</style>
