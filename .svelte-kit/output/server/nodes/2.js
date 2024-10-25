

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/2.DOD30vCb.js","_app/immutable/chunks/disclose-version.DIQLwq_U.js","_app/immutable/chunks/runtime.nUMTO9bk.js"];
export const stylesheets = [];
export const fonts = [];
