import type { CSSObject, CSSRulePrecedences } from './types.js'

export interface CssPropCacheEntry {
  styles: CSSObject
  classNames: string
  rules: CSSRulePrecedences
}

export interface RestyleCssCache {
  entries: Record<string, CssPropCacheEntry>
  nonce?: string
}

const CACHE_SYMBOL = Symbol.for('restyle.css.cache')

export function getGlobalCssCache(): RestyleCssCache | undefined {
  if (typeof globalThis !== 'object') {
    return undefined
  }

  return (globalThis as Record<PropertyKey, unknown>)[CACHE_SYMBOL] as
    | RestyleCssCache
    | undefined
}

export function setGlobalCssCache(cache: RestyleCssCache): RestyleCssCache {
  if (typeof globalThis === 'object') {
    ;(globalThis as Record<PropertyKey, unknown>)[CACHE_SYMBOL] = cache
  }

  return cache
}

export function ensureGlobalCssCache(): RestyleCssCache {
  const existing = getGlobalCssCache()
  if (existing) {
    return existing
  }

  return setGlobalCssCache({ entries: Object.create(null) })
}

export function clearGlobalCssCache(): void {
  if (typeof globalThis === 'object') {
    delete (globalThis as Record<PropertyKey, unknown>)[CACHE_SYMBOL]
  }
}
