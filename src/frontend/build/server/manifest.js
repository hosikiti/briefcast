const manifest = {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.png","robots.txt"]),
	mimeTypes: {".png":"image/png",".txt":"text/plain"},
	_: {
		client: {"start":{"file":"_app/immutable/entry/start.ecb46a92.js","imports":["_app/immutable/entry/start.ecb46a92.js","_app/immutable/chunks/index.c3faf347.js","_app/immutable/chunks/singletons.ee0e90ef.js"],"stylesheets":[],"fonts":[]},"app":{"file":"_app/immutable/entry/app.bf5a739c.js","imports":["_app/immutable/entry/app.bf5a739c.js","_app/immutable/chunks/index.c3faf347.js"],"stylesheets":[],"fonts":[]}},
		nodes: [
			() => import('./chunks/0-fe6ea5df.js'),
			() => import('./chunks/1-8a11ae91.js'),
			() => import('./chunks/2-11cc121f.js'),
			() => import('./chunks/3-70bad5ab.js')
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
