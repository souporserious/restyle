'use client'
import { useLayoutEffect } from 'react'

import { hash } from './hash'
import type { CSSRule } from './types'

const cache = new Set<string>()

/*
 * Since React may have inserted duplicate styles into the DOM due to concurrent
 * rendering, we need to watch and remove duplicate rules as they are added.
 */
if (typeof window !== 'undefined') {
  const seenStyleElements = new Set<HTMLStyleElement>()
  const seenSelectors = new Set<string>()

  function processStyleRule(
    rule: CSSStyleRule,
    sheet: CSSStyleSheet,
    index: number
  ) {
    const selector = rule.selectorText

    if (seenSelectors.has(selector)) {
      sheet.deleteRule(index)
    } else {
      seenSelectors.add(selector)
    }

    const className = selector.match(/\.([a-zA-Z0-9_-]+)/)![1]!

    cache.add(className)
  }

  function processMediaRule(mediaRule: CSSMediaRule, sheet: CSSStyleSheet) {
    const rules = mediaRule.cssRules

    for (let index = rules.length - 1; index >= 0; index--) {
      const rule = rules[index]!
      if (rule instanceof CSSStyleRule) {
        processStyleRule(rule, sheet, index)
      }
    }
  }

  function processStyleElement(node: HTMLStyleElement) {
    const sheet = node.sheet as CSSStyleSheet
    const rules = sheet.cssRules

    if (rules) {
      for (let index = rules.length - 1; index >= 0; index--) {
        const rule = rules[index]!

        if (rule instanceof CSSStyleRule) {
          processStyleRule(rule, sheet, index)
        } else if (rule instanceof CSSMediaRule) {
          processMediaRule(rule, sheet)
        }
      }
    }

    seenStyleElements.add(node)
  }

  const observer = new MutationObserver((mutations) => {
    for (
      let mutationIndex = 0;
      mutationIndex < mutations.length;
      mutationIndex++
    ) {
      const mutation = mutations[mutationIndex]!
      const addedNodes = mutation.addedNodes

      for (let nodeIndex = 0; nodeIndex < addedNodes.length; nodeIndex++) {
        const node = addedNodes[nodeIndex]! as HTMLStyleElement

        if (
          node.tagName === 'STYLE' &&
          node.dataset.precedence?.startsWith('rs') &&
          !seenStyleElements.has(node)
        ) {
          processStyleElement(node)
        }
      }
    }
  })

  document
    .querySelectorAll<HTMLStyleElement>('style[data-precedence^="rs"]')
    .forEach((node) => {
      processStyleElement(node)
    })

  observer.observe(document.head, { childList: true })
}

let hasRenderedInitialStyles = false

export function ClientStyles({
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

    if (cache.has(className) || rule === undefined) {
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

  useLayoutEffect(() => {
    hasRenderedInitialStyles = true
  }, [])

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
    </>
  )
}
