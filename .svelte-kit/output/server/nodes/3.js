

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/contacts/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/3.ArPguGuS.js","_app/immutable/chunks/disclose-version.DIQLwq_U.js","_app/immutable/chunks/runtime.nUMTO9bk.js","_app/immutable/chunks/svelte-head.oRFqaCmj.js"];
export const stylesheets = [];
export const fonts = [];
