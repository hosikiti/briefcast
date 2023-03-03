import { c as create_ssr_component, f as each, e as escape, d as add_attribute } from './index-b06313dd.js';

const css = {
  code: "section.svelte-18r0v4z{display:flex;flex-direction:column;justify-content:top;align-items:center;flex:0.6}h1.svelte-18r0v4z{width:100%;font-size:300%;font-family:serif;margin:1rem 0}h2.svelte-18r0v4z{font-family:serif}.item.svelte-18r0v4z{margin-top:1rem;margin-bottom:2rem}.additional.svelte-18r0v4z{display:flex;justify-content:right}.original-source.svelte-18r0v4z{right:0;display:block;font-size:80%}",
  map: null
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const mediaHost = "";
  const items = [
    {
      id: "nhk",
      title: "NHK",
      sourceUrl: "http://www3.nhk.or.jp/news/"
    },
    {
      id: "cnn",
      title: "CNN in simple English",
      sourceUrl: "https://edition.cnn.com/"
    }
  ].map((item) => {
    return {
      id: item.id,
      title: item.title,
      sourceUrl: item.sourceUrl,
      audioSrc: mediaHost + "/media?id=" + item.id
    };
  });
  $$result.css.add(css);
  return `<section class="${"svelte-18r0v4z"}"><h1 class="${"svelte-18r0v4z"}">BriefCast</h1>

	<h2 class="${"svelte-18r0v4z"}">Stay on top of the news in seconds</h2>

	${each(items, (item) => {
    return `<div class="${"item svelte-18r0v4z"}"><h2 class="${"svelte-18r0v4z"}">${escape(item.title)}</h2>
			<audio controls><source${add_attribute("src", item.audioSrc, 0)} type="${"audio/mpeg"}"><em>Sorry, your browser doesn&#39;t support HTML5 audio.</em></audio>
			<div class="${"additional svelte-18r0v4z"}"><a class="${"original-source svelte-18r0v4z"}"${add_attribute("href", item.sourceUrl, 0)} target="${"_blank"}" rel="${"noreferrer"}">Visit website</a></div>
		</div>`;
  })}
</section>`;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-176c44af.js.map
