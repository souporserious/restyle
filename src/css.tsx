import * as React from 'react'

import { ClientStyles } from './client-styles'
import type { CSSObject } from './types'
import { createRules } from './utils'

/**
 * Generates CSS from an object of styles.
 * @returns Atomic class names for each rule and style elements for each precedence.
 */
export function css(
  styles: CSSObject,
  nonce?: string
): [string, () => React.ReactNode] {
  const [classNames, lowRules, mediumRules, highRules, nested] =
    createRules(styles)

  function Styles() {
    return (
      <ClientStyles r={[lowRules, mediumRules, highRules, nested]} n={nonce} />
    )
  }

  return [classNames, Styles]
}
