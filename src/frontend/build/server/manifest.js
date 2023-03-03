const manifest = {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.png","robots.txt"]),
	mimeTypes: {".png":"image/png",".txt":"text/plain"},
	_: {
		client: {"start":{"file":"_app/immutable/entry/start.76256be3.js","imports":["_app/immutable/entry/start.76256be3.js","_app/immutable/chunks/index.c3faf347.js","_app/immutable/chunks/singletons.38b1acda.js"],"stylesheets":[],"fonts":[]},"app":{"file":"_app/immutable/entry/app.3d5bfd5e.js","imports":["_app/immutable/entry/app.3d5bfd5e.js","_app/immutable/chunks/index.c3faf347.js"],"stylesheets":[],"fonts":[]}},
		nodes: [
			() => import('./chunks/0-9ad2b123.js'),
			() => import('./chunks/1-f3c5ef28.js'),
			() => import('./chunks/2-11cc121f.js'),
			() => import('./chunks/3-b060d08a.js')
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0], errors: [1], leaf: 2 },
				endpoint: null
			},
			{
				id: "/about",
				pattern: /^\/about\/?$/,
				params: [],
				page: { layouts: [0], errors: [1], leaf: 3 },
				endpoint: null
			}
		],
		matchers: async () => {
			
			return {  };
		}
	}
};

export { manifest };
//# sourceMappingURL=manifest.js.map
