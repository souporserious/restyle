'use client'
import { useLayoutEffect } from 'react'

import type { CSSRule } from './types'

let hasRenderedInitialStylesToDepth = -1
type NestedRules = [CSSRule[], CSSRule[], CSSRule[], NestedRules[]]

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
  d: depth = 0,
}: {
  r: NestedRules
  n?: string
  d?: number
}) {
  const [lowRules, mediumRules, highRules, nested] = rules

  /* Only render the initial styles for each depth once to establish precedence order */
  const hasRenderedThisDepth = hasRenderedInitialStylesToDepth >= depth
  useLayoutEffect(() => {
    hasRenderedInitialStylesToDepth = Math.max(
      depth,
      hasRenderedInitialStylesToDepth
    )
  }, [depth])

  /* Don't send undefined nonce to reduce serialization size */
  const sharedProps = nonce ? { nonce } : {}

  const depthString = depth === 0 ? '' : depth.toString()
  const levels = {
    low: `rsl${depthString}`,
    med: `rsm${depthString}`,
    high: `rsh${depthString}`,
  }

  return (
    <>
      {lowRules.length === 0 ? (
        hasRenderedThisDepth ? null : (
          <style
            href={`${levels.low}i`}
            precedence={levels.low}
            {...sharedProps}
          />
        )
      ) : (
        lowRules.map(([className, rule], index) => (
          <style
            href={className}
            precedence={levels.low}
            key={index}
            {...sharedProps}
          >
            {rule}
          </style>
        ))
      )}

      {mediumRules.length === 0 ? (
        hasRenderedThisDepth ? null : (
          <style
            href={`${levels.med}i`}
            precedence={levels.med}
            {...sharedProps}
          />
        )
      ) : (
        mediumRules.map(([className, rule], index) => (
          <style
            href={className}
            precedence={levels.med}
            key={index}
            {...sharedProps}
          >
            {rule}
          </style>
        ))
      )}

      {highRules.length === 0 ? (
        hasRenderedThisDepth ? null : (
          <style
            href={`${levels.high}i`}
            precedence={levels.high}
            {...sharedProps}
          />
        )
      ) : (
        highRules.map(([className, rule], index) => (
          <style
            href={className}
            precedence={levels.high}
            key={index}
            {...sharedProps}
          >
            {rule}
          </style>
        ))
      )}

      {nested.map((nested, index) => (
        <ClientStyles key={index} d={depth + 1} n={nonce} r={nested} />
      ))}
    </>
  )
}
