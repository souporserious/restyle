/// <reference types="react/canary" />
import * as React from 'react'

import { ClientCache } from './client-cache'
import type { AcceptsClassName, CSSResult, CSSObject, CSSValue } from './types'

export type CSSProp = CSSObject

type Cache = { current: Set<string> | null }

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

function isEqual(a: Record<string, any>, b: Record<string, any>): boolean {
  const aKeys = Object.keys(a)
  const bKeys = Object.keys(b)

  if (aKeys.length !== bKeys.length) return false

  for (let key of aKeys) {
    if (typeof a[key] === 'object' && typeof b[key] === 'object') {
      if (!isEqual(a[key], b[key])) return false
    } else if (a[key] !== b[key]) {
      return false
    }
  }

  return true
}

function parseValue(prop: string, value: CSSValue): CSSValue {
  if (prop.startsWith('--') || unitlessProps.has(prop)) {
    return value
  }
  return typeof value === 'number' ? `${value}px` : value
}

function createRule(
  name: string,
  selector: string,
  prop: string,
  value: CSSValue
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

/** Parse a CSS styles object into class names and rule sets for each precedence. */
function parseCSSObject(
  styles: CSSObject,
  selector = '',
  parentSelector = ''
): [string, string, string, string] {
  let classNames = ''
  let lowPrecedenceRules = []
  let mediumPrecedenceRules = []
  let highPrecedenceRules = []

  for (const key in styles) {
    const value = styles[key as keyof CSSObject]

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
      const chainedResults = parseCSSObject(
        value as CSSObject,
        chainedSelector,
        atSelector || parentSelector
      )

      classNames += ' ' + chainedResults[0]
      lowPrecedenceRules.push(chainedResults[1])
      mediumPrecedenceRules.push(chainedResults[2])
      highPrecedenceRules.push(chainedResults[3])

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

function parseCSS(styles: CSSObject, nonce?: string): CSSResult {
  const [classNames, lowRules, mediumRules, highRules] = parseCSSObject(styles)

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

  return [classNames, [lowStyles, mediumStyles, highStyles, clientCache]]
}

/**
 * Generates CSS from an object of styles. Note, this is an isomorphic function
 * that acts as a utility function on the server and a hook on the client.
 *
 * @returns Atomic class names for each rule and style elements for each precedence.
 */
export function css(
  styles: CSSObject,
  nonce?: string
): [string, React.ReactNode] {
  if (isClientComponent) {
    const previousStyles = React.useRef<CSSObject | null>(null)
    const previousResult = React.useRef<CSSResult | null>(null)

    if (
      previousResult.current === null ||
      !isEqual(previousStyles.current!, styles)
    ) {
      previousStyles.current = styles
      previousResult.current = parseCSS(styles, nonce)
    }

    return previousResult.current
  }

  return parseCSS(styles, nonce)
}

/**
 * Creates a JSX component that forwards a `className` prop with the generated
 * atomic class names to the provided `Component`. Additionally, a `css` prop can
 * be provided to override the initial `styles`.
 *
 * Note, the provided component must accept a `className` prop.
 */
export function styled<ComponentType extends React.ElementType>(
  Component: AcceptsClassName<ComponentType>,
  styles?: CSSObject
) {
  return ({
    css: cssProp,
    ...props
  }: React.ComponentProps<ComponentType> & { css?: CSSObject }) => {
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
