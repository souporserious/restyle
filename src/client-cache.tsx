'use client'

export function ClientCache({ cache }: { cache: Set<string> }) {
  globalThis.__RESTYLE_CACHE = cache
  return null
}
