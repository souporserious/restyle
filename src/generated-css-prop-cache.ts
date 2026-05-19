import type { CssPropUsage } from './analyze-css-props/index.js'
import type { CssPropCacheEntry } from './css-cache.js'

export const cache: Record<string, CssPropCacheEntry> = {}
export const usages: CssPropUsage[] = []

export default cache
