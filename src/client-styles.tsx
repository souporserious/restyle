'use client'
import { useLayoutEffect } from 'react'

import type { CSSRule } from './types'

let hasRenderedInitialStyles = false

/**
 * Renders style elements in order of low, medium, and high precedence.
 * This order is important to ensure atomic class names are applied correctly.
 *
 * The last rule wins in the case of conflicting keys where normal object merging occurs.
 * However, the insertion order of unique keys does not matter since rules are based on precedence.
 *
 * React style precedence is ordered based on when the style elements are first rendered
 * so even if low or medium precedence styles are not used, they will still be rendered
 * the first time they are encountered.
 */
export function ClientStyles({
  r: rules,
  n: nonce,
}: {
  r: [CSSRule[], CSSRule[], CSSRule[]]
  n?: string
}) {
  const [lowRules, mediumRules, highRules] = rules

  /* Only render the initial styles once to establish precedence order */
  if (hasRenderedInitialStyles === false) {
    useLayoutEffect(() => {
      hasRenderedInitialStyles = true
    }, [])
  }

  /* Don't send undefined nonce to reduce serialization size */
  const sharedProps = nonce ? { nonce } : {}

  return (
    <>
      {lowRules.length === 0 ? (
        hasRenderedInitialStyles ? null : (
          <style href="rsli" precedence="rsl" {...sharedProps} />
        )
      ) : (
        lowRules.map(([className, rule], index) => (
          <style href={className} precedence="rsl" key={index} {...sharedProps}>
            {rule}
          </style>
        ))
      )}

      {mediumRules.length === 0 ? (
        hasRenderedInitialStyles ? null : (
          <style href="rsmi" precedence="rsm" {...sharedProps} />
        )
      ) : (
        mediumRules.map(([className, rule], index) => (
          <style href={className} precedence="rsm" key={index} {...sharedProps}>
            {rule}
          </style>
        ))
      )}

      {highRules.length > 0
        ? highRules.map(([className, rule], index) => (
            <style
              href={className}
              precedence="rsh"
              key={index}
              {...sharedProps}
            >
              {rule}
            </style>
          ))
        : null}
    </>
  )
}
