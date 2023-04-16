<script>
	import { goto } from '$app/navigation';
</script>

<div class="bg-slate-50 w-full flex flex-col md:items-center">
	<div class="flex flex-col w-full md:w-[60%] text-center items-center">
		<span class="mt-8 p-4 font-semibold text-3xl md:text-4xl">
			BriefCast turns any website into a tiny podcast with the help of AI.
		</span>
		<span class="py-8 px-8 md:px-16">
			Staying informed shouldn't take hours of your day. Join us today and start enjoying the
			"brief" podcasts that keep you informed and up-to-date without sacrificing your life.
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
