import * as React from 'react'

import { createRules } from './create-rules.js'
import { ClientStyles } from './client-styles.js'
import { getGlobalCssCache } from './css-cache.js'
import { createCssPropKey, normalizeCssObject } from './css-props-helpers.js'
import type { CSSObject } from './types.js'

/**
 * Generates CSS from an object of styles.
 * @returns Atomic class names for each rule and style elements for each precedence.
 */
export function css(
  styles: CSSObject,
  nonce?: string
): [string, (() => React.JSX.Element) | null] {
  const normalizedStyles = normalizeCssObject(styles)
  const cacheKey = createCssPropKey(normalizedStyles)
  const globalCache = getGlobalCssCache()
  const cachedEntry = globalCache?.entries[cacheKey]

  if (cachedEntry) {
    return [cachedEntry.classNames, null]
  }

  const [classNames, rules] = createRules(normalizedStyles)

  if (globalCache) {
    globalCache.entries[cacheKey] = { styles: normalizedStyles, classNames, rules }
  }

  function Styles() {
    return <ClientStyles r={rules} n={nonce} />
  }

  return [classNames, Styles]
}
