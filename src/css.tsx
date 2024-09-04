/// <reference types="react/canary" />
import * as React from 'react'

import { ClientStyles } from './client-styles'
import { hash } from './hash'
import type { CSSObject, CSSValue, CSSRule } from './types'

export type { CSSObject, CSSValue }

/** Low precedence CSS styles. */
const l = new Set([
  'all',
  'animation',
  'background',
  'backgroundPosition',
  'border',
  'borderImage',
  'borderRadius',
  'columnRule',
  'columns',
  'flex',
  'flexFlow',
  'font',
  'fontVariant',
  'gap',
  'grid',
  'gridArea',
  'gridColumn',
  'gridRow',
  'gridTemplate',
  'inset',
  'listStyle',
  'margin',
  'mask',
  'maskBorder',
  'offset',
  'outline',
  'overflow',
  'overscrollBehavior',
  'padding',
  'placeContent',
  'placeItems',
  'placeSelf',
  'scrollMargin',
  'scrollPadding',
  'textDecoration',
  'textEmphasis',
  'textWrap',
  'transform',
  'transition',
  'viewTimeline',
])

/** Medium precedence CSS styles. */
const m = new Set([
  'borderBlockStart',
  'borderBlockEnd',
  'borderBlock',
  'borderInline',
  'borderInlineStart',
  'borderInlineEnd',
  'borderLeft',
  'borderRight',
  'borderTop',
  'borderBottom',
  'borderWidth',
  'borderColor',
  'borderStyle',
  'marginBlock',
  'marginInline',
  'paddingBlock',
  'paddingInline',
])

/** Unitless CSS styles. */
const u = new Set([
  'animationIterationCount',
  'borderImageSlice',
  'columnCount',
  'flexGrow',
  'flexShrink',
  'fontWeight',
  'gridColumn',
  'gridColumnEnd',
  'gridColumnStart',
  'gridRow',
  'gridRowEnd',
  'gridRowStart',
  'lineHeight',
  'opacity',
  'orphans',
  'tabSize',
  'widows',
  'zIndex',
])

function createRule(
  name: string,
  selector: string,
  parentSelector: string,
  prop: string,
  value: CSSValue
): string {
  let className = ''

  if (selector === '') {
    className = '.' + name
  } else if (selector.includes('&')) {
    className = selector.replace('&', '.' + name)
  } else {
    className = '.' + name + selector
  }

  const hyphenProp = prop.replace(/[A-Z]|^ms/g, '-$&').toLowerCase()
  let parsedValue: CSSValue

  if (prop.startsWith('--') || u.has(prop)) {
    parsedValue = value
  } else {
    parsedValue = typeof value === 'number' ? value + 'px' : value
  }

  const rule = className.trim() + '{' + hyphenProp + ':' + parsedValue + '}'

  return parentSelector === '' ? rule : parentSelector + '{' + rule + '}'
}

function createRules(
  styles: CSSObject,
  selector = '',
  parentSelector = ''
): [string, CSSRule[], CSSRule[], CSSRule[]] {
  const lowRules: CSSRule[] = []
  const mediumRules: CSSRule[] = []
  const highRules: CSSRule[] = []
  let classNames = ''

  for (const key in styles) {
    const value = styles[key as keyof CSSObject]

    if (value === undefined || value === null) {
      continue
    }

    if (typeof value === 'object') {
      const atSelector = /^@/.test(key) ? key : undefined
      const chainedSelector = atSelector
        ? selector
        : key.startsWith(':')
          ? selector + key
          : selector + ' ' + key
      const nestedRules = createRules(
        value as CSSObject,
        chainedSelector,
        atSelector || parentSelector
      )

      classNames += nestedRules[0] + ' '
      lowRules.push(...nestedRules[1])
      mediumRules.push(...nestedRules[2])
      highRules.push(...nestedRules[3])
      continue
    }

    const precedence = l.has(key) ? 'l' : m.has(key) ? 'm' : 'h'
    const className = precedence + hash(key + value + selector + parentSelector)
    const rule = createRule(
      className,
      selector.trim(),
      parentSelector.trim(),
      key,
      value
    )

    classNames += className + ' '
    if (precedence === 'l') {
      lowRules.push([className, rule])
    } else if (precedence === 'm') {
      mediumRules.push([className, rule])
    } else {
      highRules.push([className, rule])
    }
  }

  return [classNames.trim(), lowRules, mediumRules, highRules]
}

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
