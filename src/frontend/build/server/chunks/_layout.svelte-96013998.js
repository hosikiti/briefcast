import { c as create_ssr_component, v as validate_component, b as subscribe, d as add_attribute } from './index-b06313dd.js';
import { p as page } from './stores-09d78b81.js';

const css$1 = {
  code: "header.svelte-1998jz.svelte-1998jz{display:flex;justify-content:space-between}.corner.svelte-1998jz.svelte-1998jz{width:3em;height:3em}nav.svelte-1998jz.svelte-1998jz{display:flex;justify-content:center;--background:rgba(255, 255, 255, 0.7)}svg.svelte-1998jz.svelte-1998jz{width:2em;height:3em;display:block}path.svelte-1998jz.svelte-1998jz{fill:var(--background)}ul.svelte-1998jz.svelte-1998jz{position:relative;padding:0;margin:0;height:3em;display:flex;justify-content:center;align-items:center;list-style:none;background:var(--background);background-size:contain}li.svelte-1998jz.svelte-1998jz{position:relative;height:100%}li[aria-current='page'].svelte-1998jz.svelte-1998jz::before{--size:6px;content:'';width:0;height:0;position:absolute;top:0;left:calc(50% - var(--size));border:var(--size) solid transparent;border-top:var(--size) solid var(--color-theme-1)}nav.svelte-1998jz a.svelte-1998jz{display:flex;height:100%;align-items:center;padding:0 0.5rem;color:var(--color-text);font-weight:700;font-size:0.8rem;text-transform:uppercase;letter-spacing:0.1em;text-decoration:none;transition:color 0.2s linear}a.svelte-1998jz.svelte-1998jz:hover{color:var(--color-theme-1)}",
  map: null
};
const Header = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $page, $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  $$result.css.add(css$1);
  $$unsubscribe_page();
  return `<header class="${"svelte-1998jz"}"><div class="${"corner svelte-1998jz"}"></div>

	<nav class="${"svelte-1998jz"}"><svg viewBox="${"0 0 2 3"}" aria-hidden="${"true"}" class="${"svelte-1998jz"}"><path d="${"M0,0 L1,2 C1.5,3 1.5,3 2,3 L2,0 Z"}" class="${"svelte-1998jz"}"></path></svg>
		<ul class="${"svelte-1998jz"}"><li${add_attribute("aria-current", $page.url.pathname === "/" ? "page" : void 0, 0)} class="${"svelte-1998jz"}"><a href="${"/"}" class="${"svelte-1998jz"}">Home</a></li>
			<li${add_attribute("aria-current", $page.url.pathname === "/about" ? "page" : void 0, 0)} class="${"svelte-1998jz"}"><a href="${"/about"}" class="${"svelte-1998jz"}">About</a></li></ul>
		<svg viewBox="${"0 0 2 3"}" aria-hidden="${"true"}" class="${"svelte-1998jz"}"><path d="${"M0,0 L0,3 C0.5,3 0.5,3 1,2 L2,0 Z"}" class="${"svelte-1998jz"}"></path></svg></nav>

	<div class="${"corner svelte-1998jz"}"></div>
</header>`;
});
const css = {
  code: ".app.svelte-1wevoko{display:flex;flex-direction:column;min-height:100vh}main.svelte-1wevoko{flex:1;display:flex;flex-direction:column;padding:1rem;width:100%;max-width:64rem;margin:0 auto;box-sizing:border-box}footer.svelte-1wevoko{display:flex;flex-direction:column;justify-content:center;align-items:center;padding:12px}@media(min-width: 480px){footer.svelte-1wevoko{padding:12px 0}}",
  map: null
};
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css);
  return `<div class="${"app svelte-1wevoko"}">${validate_component(Header, "Header").$$render($$result, {}, {}, {})}

	<main class="${"svelte-1wevoko"}">${slots.default ? slots.default({}) : ``}</main>

	<footer class="${"svelte-1wevoko"}"><p>(C) 2023 Kei Oikawa.</p></footer>
</div>`;
});

export { Layout as default };
//# sourceMappingURL=_layout.svelte-96013998.js.map
