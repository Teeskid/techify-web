// for emulator instance
export const DEBUG_MODE = !!process.env.FUNCTIONS_EMULATOR && process.env.FUNCTIONS_EMULATOR === "true"

// for cloud time out
export const CLOUD_TIMEOUT = 180

// request time out
export const REQUEST_TIMEOUT = 45000

// json content storage info
export const CONTENT_JSON = { contentType: 'application/json' }

// shards count for stats
export const SHARDS_COUNT = 10
