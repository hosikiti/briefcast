import { c as create_ssr_component, f as each, e as escape, d as add_attribute } from './index-b06313dd.js';

const css = {
  code: "section.svelte-1psafv{display:flex;flex-direction:column;justify-content:top;align-items:center;flex:0.6}h1.svelte-1psafv{width:100%;font-size:300%;font-family:serif;margin:1rem 0}h2.svelte-1psafv{font-family:serif}.item.svelte-1psafv{margin-top:1rem}",
  map: null
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const mediaHost = "";
  const items = [{ id: "nhk", title: "NHK" }, { id: "cnn", title: "CNN" }].map((item) => {
    return {
      id: item.id,
      title: item.title,
      audioSrc: mediaHost + "/media?id=" + item.id
    };
  });
  $$result.css.add(css);
  return `<section class="${"svelte-1psafv"}"><h1 class="${"svelte-1psafv"}">BriefCast</h1>

	<h2 class="${"svelte-1psafv"}">Stay on top of the news in seconds</h2>

	${each(items, (item) => {
    return `<div class="${"item svelte-1psafv"}"><h2 class="${"svelte-1psafv"}">${escape(item.title)}</h2>
			<audio controls><source${add_attribute("src", item.audioSrc, 0)} type="${"audio/mpeg"}"><em>Sorry, your browser doesn&#39;t support HTML5 audio.</em></audio>
		</div>`;
  })}
</section>`;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-73f79fc7.js.map
