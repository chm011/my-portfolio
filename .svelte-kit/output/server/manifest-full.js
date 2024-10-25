export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["PHOTO-2023-04-03-22-38-17.jpg","favicon.png","global.js","style.css"]),
	mimeTypes: {".jpg":"image/jpeg",".png":"image/png",".js":"text/javascript",".css":"text/css"},
	_: {
		client: {"start":"_app/immutable/entry/start.DZ94C4Hr.js","app":"_app/immutable/entry/app.Ct4WB8cK.js","imports":["_app/immutable/entry/start.DZ94C4Hr.js","_app/immutable/chunks/entry.CokY_GgK.js","_app/immutable/chunks/runtime.nUMTO9bk.js","_app/immutable/entry/app.Ct4WB8cK.js","_app/immutable/chunks/runtime.nUMTO9bk.js","_app/immutable/chunks/render.CmKfKh9g.js","_app/immutable/chunks/svelte-head.oRFqaCmj.js","_app/immutable/chunks/disclose-version.DIQLwq_U.js"],"stylesheets":[],"fonts":[],"uses_env_dynamic_public":false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js')),
			__memo(() => import('./nodes/3.js')),
			__memo(() => import('./nodes/4.js')),
			__memo(() => import('./nodes/5.js'))
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/contacts",
				pattern: /^\/contacts\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			},
			{
				id: "/projects",
				pattern: /^\/projects\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 4 },
				endpoint: null
			},
			{
				id: "/resume",
				pattern: /^\/resume\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 5 },
				endpoint: null
			}
		],
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
