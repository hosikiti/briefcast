const manifest = {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.png","robots.txt"]),
	mimeTypes: {".png":"image/png",".txt":"text/plain"},
	_: {
		client: {"start":{"file":"_app/immutable/entry/start.b87eeee1.js","imports":["_app/immutable/entry/start.b87eeee1.js","_app/immutable/chunks/index.c3faf347.js","_app/immutable/chunks/singletons.4df91814.js"],"stylesheets":[],"fonts":[]},"app":{"file":"_app/immutable/entry/app.2ce23ae9.js","imports":["_app/immutable/entry/app.2ce23ae9.js","_app/immutable/chunks/index.c3faf347.js"],"stylesheets":[],"fonts":[]}},
		nodes: [
			() => import('./chunks/0-17d41816.js'),
			() => import('./chunks/1-be97df3d.js'),
			() => import('./chunks/2-11cc121f.js'),
			() => import('./chunks/3-78ece20e.js')
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
