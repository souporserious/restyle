import { hash } from './hash'
import type { CSSRule } from './types'

let hasRenderedInitialStyles = false

export function ServerStyles({
  rules,
  nonce,
}: {
  rules: CSSRule[]
  nonce?: string
}) {
  const rulesLength = rules.length
  let lowRules = ''
  let mediumRules = ''
  let highRules = ''

  for (let index = 0; index < rulesLength; index++) {
    const [className, rule] = rules[index]!

    if (rule === undefined) {
      continue
    }

    const precedence = className[0]

    if (precedence === 'l') {
      lowRules += rule
    } else if (precedence === 'm') {
      mediumRules += rule
    } else {
      highRules += rule
    }
  }

  /* Don't send undefined nonce to reduce serialization size */
  const sharedProps = nonce ? { nonce } : {}

  return (
    <>
      {lowRules.length === 0 && hasRenderedInitialStyles ? null : (
        <style
          // @ts-expect-error
          href={lowRules.length > 0 ? hash(lowRules) : 'rsli'}
          precedence="rsl"
          {...sharedProps}
        >
          {lowRules}
        </style>
      )}

      {mediumRules.length === 0 && hasRenderedInitialStyles ? null : (
        <style
          // @ts-expect-error
          href={mediumRules.length > 0 ? hash(mediumRules) : 'rsmi'}
          precedence="rsm"
          {...sharedProps}
        >
          {mediumRules}
        </style>
      )}

      {highRules.length > 0 ? (
        <style
          // @ts-expect-error
          href={hash(highRules)}
          precedence="rsh"
          {...sharedProps}
        >
          {highRules}
        </style>
      ) : null}

      {(hasRenderedInitialStyles = true)}
    </>
  )
}
