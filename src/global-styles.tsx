import { createStyles } from './create-styles.js'
import type { CSSObject } from './types.js'
import { hash } from './utils.js'

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
    <style href={id} precedence="rsg" nonce={nonce}>
      {rules}
    </style>
  )
}
