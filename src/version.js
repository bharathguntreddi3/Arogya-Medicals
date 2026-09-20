// The build stamps this in from package.json (see `define` in vite.config.js), so the
// version shown on the site and in the admin can never drift from the released build.
/* global __APP_VERSION__ */
export const APP_VERSION = __APP_VERSION__

// "v0.0.1" — what the UI actually renders.
export const APP_VERSION_LABEL = `v${APP_VERSION}`
