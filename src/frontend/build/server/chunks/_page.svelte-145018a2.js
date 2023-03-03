import { c as create_ssr_component } from './index-b06313dd.js';

const css = {
  code: ".text-column.svelte-1bccks5{font-family:serif}.description.svelte-1bccks5{text-align:center}li.svelte-1bccks5{line-height:2rem}h2.svelte-1bccks5{font-weight:bold;text-align:center;margin:2rem 0}",
  map: null
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css);
  return `${$$result.head += `<!-- HEAD_svelte-1ds1qyu_START -->${$$result.title = `<title>About</title>`, ""}<meta name="${"description"}" content="${"About this app"}"><!-- HEAD_svelte-1ds1qyu_END -->`, ""}

<div class="${"text-column svelte-1bccks5"}"><h1 class="${"svelte-1bccks5"}">About BriefCast</h1>
	<p class="${"description svelte-1bccks5"}">BriefCast is an AI-powered short podcast generator from any online resources.
	</p>
	<h2 class="${"svelte-1bccks5"}">How it works</h2>
	<ol><li class="${"svelte-1bccks5"}">Pick a web site: Briefcast works seamlessly with any websites that offers RSS/ATOM feeds.
		</li>
		<li class="${"svelte-1bccks5"}">Write a transcript: Briefcast has prompt templates to automatically generate your podcast
			transcript about the source. You can select one or customize it.
		</li>
		<li class="${"svelte-1bccks5"}">Choose your favorite voice: Briefcast turns the transcript into natural sounding podcast audio
			with the voice you choose.
		</li>
		<li class="${"svelte-1bccks5"}">Briefcast automatically updates your podcast. Enjoy your podcast!</li></ol>
</div>`;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-145018a2.js.map
