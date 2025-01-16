import * as React from 'react'

import { ClientStyles } from './client-styles.js'
import type { CSSObject } from './types.js'
import { createRules } from './utils.js'

/**
 * Generates CSS from an object of styles.
 * @returns Atomic class names for each rule and style elements for each precedence.
 */
export function css(
  styles: CSSObject,
  nonce?: string
): [string, () => React.ReactNode] {
  const [classNames, lowRules, mediumRules, highRules] = createRules(styles)

  function Styles() {
    return <ClientStyles r={[lowRules, mediumRules, highRules]} n={nonce} />
  }

  return [classNames, Styles]
}
