const manifest = {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.png","robots.txt"]),
	mimeTypes: {".png":"image/png",".txt":"text/plain"},
	_: {
		client: {"start":{"file":"_app/immutable/entry/start.6a03abcb.js","imports":["_app/immutable/entry/start.6a03abcb.js","_app/immutable/chunks/index.c3faf347.js","_app/immutable/chunks/singletons.2168298f.js"],"stylesheets":[],"fonts":[]},"app":{"file":"_app/immutable/entry/app.ce593d8b.js","imports":["_app/immutable/entry/app.ce593d8b.js","_app/immutable/chunks/index.c3faf347.js"],"stylesheets":[],"fonts":[]}},
		nodes: [
			() => import('./chunks/0-466d0adb.js'),
			() => import('./chunks/1-c14520de.js'),
			() => import('./chunks/2-0b6c625c.js'),
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
