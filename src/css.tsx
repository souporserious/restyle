/// <reference types="react/canary" />
import * as React from 'react'

import { ClientStyles } from './client-styles'
import { ServerStyles } from './server-styles'
import { hash } from './hash'
import type { CSSObject, CSSValue, CSSRule } from './types'

export type { CSSObject, CSSValue }

const lowPrecedenceProps = new Set([
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

const mediumPrecedenceProps = new Set([
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

const unitlessProps = new Set([
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

const isServerComponent = React.useRef === undefined
const getServerCache = React.cache(() => new Set<string>())

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

  if (prop.startsWith('--') || unitlessProps.has(prop)) {
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
): CSSRule[] {
  const rules: CSSRule[] = []

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

      rules.push(...nestedRules)
      continue
    }

    const precedence = lowPrecedenceProps.has(key)
      ? 'l'
      : mediumPrecedenceProps.has(key)
        ? 'm'
        : 'h'
    const className = precedence + hash(key + value + selector + parentSelector)

    if (isServerComponent) {
      const cache = getServerCache()

      if (cache.has(className)) {
        rules.push([className])
        continue
      }

      cache.add(className)
    }

    const rule = createRule(
      className,
      selector.trim(),
      parentSelector.trim(),
      key,
      value
    )

    rules.push([className, rule])
  }

  return rules
}

/**
 * Generates CSS from an object of styles.
 * @returns Atomic class names for each rule and style elements for each precedence.
 */
export function css(
  styles: CSSObject,
  nonce?: string
): [string, () => React.ReactNode] {
  const rules = createRules(styles)
  const classNames = rules.map(([className]) => className).join(' ')

  /*
   * Style elements are rendered in order of low, medium, and high precedence.
   * This order is important to ensure atomic class names are applied correctly.
   *
   * The last rule wins in the case of conflicting keys where normal object merging occurs.
   * However, the insertion order of unique keys does not matter since rules are based on precedence.
   *
   * React style precedence is ordered based on when the style elements are first rendered
   * so even if low or medium precedence styles are not used, they will still be rendered
   * the first time they are encountered.
   */
  function Styles() {
    return isServerComponent ? (
      <ServerStyles rules={rules} nonce={nonce} cache={getServerCache()} />
    ) : (
      <ClientStyles rules={rules} nonce={nonce} />
    )
  }

  return [classNames, Styles]
}
