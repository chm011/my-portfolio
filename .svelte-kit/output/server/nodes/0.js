

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/layout.svelte.js')).default;
export const imports = ["_app/immutable/nodes/0.uP5kfsgC.js","_app/immutable/chunks/disclose-version.DIQLwq_U.js","_app/immutable/chunks/runtime.nUMTO9bk.js"];
export const stylesheets = [];
export const fonts = [];
