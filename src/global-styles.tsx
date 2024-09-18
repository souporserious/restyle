import React from 'react'

import { hash } from './hash'
import type { CSSObject } from './types'
import { createStyles } from './utils'

/** Generates styles from an object of styles. */
export function GlobalStyles({
  children,
  nonce,
}: {
  children: CSSObject
  nonce?: string
}) {
  const rules = createStyles(children)
  const id = hash(rules)

  return (
    <style
      // @ts-expect-error
      href={id}
      precedence="rsg"
      nonce={nonce}
    >
      {rules}
    </style>
  )
}
