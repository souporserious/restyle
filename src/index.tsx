/// <reference types="react/canary" />
import * as React from 'react'

import { ClientCache } from './client-cache'
import type { AcceptsClassName, Styles, StyleValue } from './types'

export type CSSProp = Styles

type Cache = { current: Set<string> | null }

const isClientComponent = Boolean(React.useRef)
const serverCache = React.cache<() => Cache>(() => ({ current: null }))
let cache: Cache | null = null

function getCache(): Set<string> {
  try {
    cache = serverCache()
  } catch {
    cache = { current: null }
  }

  if (cache.current === null) {
    cache.current = new Set()
  }

  return cache.current
}

/** Create a hash from a string. */
function hash(str: string): string {
  // FNV-1a Hash Function
  let h = 0 ^ 0x811c9dc5
  for (let index = 0; index < str.length; index++) {
    h ^= str.charCodeAt(index)
    h = (h * 0x01000193) >>> 0
  }

  // Base36 Encoding Function
  const letters = 'abcdefghijklmnopqrstuvwxyz'
  const base36 = '0123456789' + letters
  let result = ''
  do {
    result = base36[h % 36] + result
    h = Math.floor(h / 36)
  } while (h > 0)

  return `x${result}`
}

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

/** Parse a value. */
function parseValue(prop: string, value: StyleValue): StyleValue {
  if (prop.startsWith('--') || unitlessProps.has(prop)) {
    return value
  }
  return typeof value === 'number' ? `${value}px` : value
}

/** Create a CSS rule. */
function createRule(
  name: string,
  selector: string,
  prop: string,
  value: StyleValue
): string {
  const className =
    selector === ''
      ? `.${name}`
      : selector.includes('&')
        ? selector.replace('&', `.${name}`)
        : `.${name}${selector}`
  const hyphenProp = prop.replace(/[A-Z]|^ms/g, '-$&').toLowerCase()

  return `${className.trim()}{${hyphenProp}:${parseValue(prop, value)}}`
}

/** Parse styles into class names and rules. */
function parseStyles(
  styles: Styles,
  selector = '',
  parentSelector = ''
): [string, string, string, string] {
  let classNames = ''
  let lowPrecedenceRules = []
  let mediumPrecedenceRules = []
  let highPrecedenceRules = []

  for (const key in styles) {
    const value = styles[key as keyof Styles]

    if (value === undefined || value === null) {
      continue
    }

    if (typeof value === 'object') {
      const atSelector = /^@/.test(key) ? key : null
      const chainedSelector = atSelector
        ? selector
        : key.startsWith(':')
          ? `${selector}${key}`
          : `${selector} ${key}`

      const chainedResults = parseStyles(
        value as Styles,
        chainedSelector,
        atSelector || parentSelector
      )

      classNames += ` ${chainedResults[0]}`
      lowPrecedenceRules.push(...chainedResults[1])
      mediumPrecedenceRules.push(...chainedResults[2])
      highPrecedenceRules.push(...chainedResults[3])

      continue
    }

    const cacheKey = hash(`${key}${value}${selector}${parentSelector}`)
    const fileCache = getCache()
    const globalCache = isClientComponent
      ? globalThis.__RESTYLE_CACHE
      : undefined
    const hasCache = fileCache.has(cacheKey) || globalCache?.has(cacheKey)

    if (hasCache) {
      classNames += ` ${cacheKey}`
    } else {
      let rule = createRule(cacheKey, selector, key, value)
      rule = parentSelector === '' ? rule : `${parentSelector}{${rule}}`
      if (lowPrecedenceProps.has(key)) {
        lowPrecedenceRules.push(rule)
      } else if (mediumPrecedenceProps.has(key)) {
        mediumPrecedenceRules.push(rule)
      } else {
        highPrecedenceRules.push(rule)
      }
      classNames += ` ${cacheKey}`
      fileCache.add(cacheKey)
    }
  }

  return [
    classNames.trim(),
    lowPrecedenceRules.join(''),
    mediumPrecedenceRules.join(''),
    highPrecedenceRules.join(''),
  ]
}

type CSSResult = [
  string,
  [
    lowStyles: React.ReactElement,
    mediumStyles: React.ReactElement,
    highStyles: React.ReactElement | null,
    cache: React.ReactElement | null,
  ],
]

/**
 * Generates CSS from an object of styles and returns atomic class names for each rule and style
 * elements for each precedence.
 */
export function css(styles: Styles, nonce?: string): [string, React.ReactNode] {
  let ref: { current: CSSResult | null } = { current: null }

  /*
   * When rendering on the client, use a constant cache to prevent duplicate styles.
   * This follows the rules of style tags not receiving updates after they have been rendered.
   * https://react.dev/reference/react-dom/components/style#special-rendering-behavior
   */
  if (isClientComponent) {
    ref = React.useRef<CSSResult | null>(null)

    if (ref.current) {
      return ref.current
    }
  }

  const [classNames, lowRules, mediumRules, highRules] = parseStyles(styles)

  /*
   * Style elements are rendered in order of low, medium, and high precedence.
   * This order is important to ensure atomic class names are applied correctly.
   *
   * The last rule wins in the case of conflicting keys where normal object merging occurs, but note
   * the order of individual keys does not matter since rules are based on precedence.
   *
   * Note, precedence styles are ordered based on when they are first rendered so even if  low or
   * medium precedence styles are not used, they will still be rendered the first time they are
   * encountered.
   */

  const lowId = lowRules.length > 0 ? hash(lowRules) : 'rsli'
  const lowPrecedence = 'rsl'
  const lowStyles = (
    <style
      nonce={nonce}
      key={lowId}
      // @ts-expect-error
      href={lowId}
      precedence={lowPrecedence}
      children={lowRules}
    />
  )

  const mediumId = mediumRules.length > 0 ? hash(mediumRules) : 'rsmi'
  const mediumPrecedence = 'rsm'
  const mediumStyles = (
    <style
      nonce={nonce}
      key={mediumId}
      // @ts-expect-error
      href={mediumId}
      precedence={mediumPrecedence}
      children={mediumRules}
    />
  )

  const highId = highRules.length > 0 ? hash(highRules) : undefined
  const highPrecedence = 'rsh'
  const highStyles =
    highRules.length > 0 ? (
      <style
        nonce={nonce}
        key={highId}
        // @ts-expect-error
        href={highId}
        precedence={highPrecedence}
        children={highRules}
      />
    ) : null

  /* Use globalThis to share the server cache with the client. */
  const clientCache = isClientComponent ? null : (
    <ClientCache key="cache" cache={getCache()} />
  )

  ref.current = [classNames, [lowStyles, mediumStyles, highStyles, clientCache]]

  return ref.current
}

/**
 * Creates a JSX component that adds a `css` prop and forwards a `className` prop to the component
 * based on the `css` styles merged into the initial `styles`.
 */
export function styled<ComponentType extends React.ElementType>(
  Component: AcceptsClassName<ComponentType>,
  styles?: Styles
) {
  return ({
    css: cssProp,
    ...props
  }: React.ComponentProps<ComponentType> & { css?: Styles }) => {
    const [classNames, styleElements] = css({
      ...styles,
      ...cssProp,
    })
    return (
      <>
        {/* @ts-ignore */}
        <Component
          {...props}
          className={
            props.className ? `${props.className} ${classNames}` : classNames
          }
        />
        {styleElements}
      </>
    )
  }
}
