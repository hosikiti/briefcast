const manifest = {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.png","robots.txt"]),
	mimeTypes: {".png":"image/png",".txt":"text/plain"},
	_: {
		client: {"start":{"file":"_app/immutable/entry/start.63381dc2.js","imports":["_app/immutable/entry/start.63381dc2.js","_app/immutable/chunks/index.c3faf347.js","_app/immutable/chunks/singletons.a5a9a01f.js"],"stylesheets":[],"fonts":[]},"app":{"file":"_app/immutable/entry/app.8dead3b6.js","imports":["_app/immutable/entry/app.8dead3b6.js","_app/immutable/chunks/index.c3faf347.js"],"stylesheets":[],"fonts":[]}},
		nodes: [
			() => import('./chunks/0-7b7ade34.js'),
			() => import('./chunks/1-1ca3ed43.js'),
			() => import('./chunks/2-99b37d33.js'),
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
