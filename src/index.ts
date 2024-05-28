import * as React from 'react'

import type { Styles, Style } from './types'

export type CSSProp = Styles

// @ts-expect-error - React 19 types for cache are not available yet
const serverCache = React.cache(() => ({ current: null }))
let cache = null

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

const shorthandProps = new Set([
  'all',
  'animation',
  'background',
  'border',
  'border-block',
  'border-block-end',
  'border-block-start',
  'border-bottom',
  'border-color',
  'border-image',
  'border-inline',
  'border-inline-end',
  'border-inline-start',
  'border-left',
  'border-radius',
  'border-right',
  'border-style',
  'border-top',
  'border-width',
  'column-rule',
  'columns',
  'flex',
  'flex-flow',
  'font',
  'gap',
  'grid',
  'grid-area',
  'grid-column',
  'grid-row',
  'grid-template',
  'list-style',
  'margin',
  'mask',
  'mask-border',
  'offset',
  'outline',
  'overflow',
  'padding',
  'place-content',
  'place-items',
  'place-self',
  'scroll-margin',
  'scroll-padding',
  'text-decoration',
  'text-emphasis',
  'transition',
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
function parseValue(prop: string, value: Style): Style {
  if (unitlessProps.has(prop)) {
    return value
  }
  return typeof value === 'number' ? `${value}px` : value
}

/** Create a CSS rule. */
function createRule(
  name: string,
  selector: string,
  prop: string,
  value: Style
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
): [string, string, string] {
  let classNames = ''
  let shorthandRules = []
  let longhandRules = []

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
        value,
        chainedSelector,
        atSelector || parentSelector
      )

      classNames += ` ${chainedResults[0]}`
      shorthandRules.push(...chainedResults[1])
      longhandRules.push(...chainedResults[2])

      continue
    }

    const cacheKey = hash(`${key}${value}${selector}${parentSelector}`)
    const cache = getCache()

    if (cache.has(cacheKey)) {
      classNames += ` ${cacheKey}`
    } else {
      const rule = createRule(cacheKey, selector, key, value)
      const wrappedRule =
        parentSelector === '' ? rule : `${parentSelector}{${rule}}`
      if (shorthandProps.has(key)) {
        shorthandRules.push(wrappedRule)
      } else {
        longhandRules.push(wrappedRule)
      }
      classNames += ` ${cacheKey}`
      cache.add(cacheKey)
    }
  }

  return [classNames.trim(), shorthandRules.join(''), longhandRules.join('')]
}

/** Generates CSS from an object of styles and returns atomic class names for each rule and style elements for each precedence. */
export function css(styles: Styles, nonce?: string): [string, React.ReactNode] {
  const [classNames, shorthandRules, longhandRules] = parseStyles(styles)
  const shorthandKey = 'rssh'
  const shorthandStyles = React.createElement('style', {
    nonce,
    key: shorthandKey,
    precedence: shorthandKey,
    href: shorthandRules.length > 0 ? hash(shorthandRules) : 'initial',
    children: shorthandRules,
  })
  const longhandKey = 'rslh'
  const longhandStyles =
    longhandRules.length > 0
      ? React.createElement('style', {
          nonce,
          key: longhandKey,
          precedence: longhandKey,
          href: hash(longhandRules),
          children: longhandRules,
        })
      : null

  return [classNames, [shorthandStyles, longhandStyles]]
}

/**
 * Creates a JSX component that adds a `css` prop and forwards a `className` prop to the component
 * based on the `css` styles merged into the initial `styles`.
 */
export function styled<ComponentType extends React.ElementType>(
  Component: ComponentType,
  styles: Styles
) {
  return ({
    css: cssProp,
    ...props
  }: React.ComponentProps<ComponentType> & { css?: Styles }) => {
    const [classNames, styleElements] = css({
      ...styles,
      ...cssProp,
    })
    return React.createElement(React.Fragment, {
      children: [
        React.createElement(Component, {
          key: 'styled',
          ...props,
          className: props.className
            ? `${props.className} ${classNames}`
            : classNames,
        }),
        styleElements,
      ],
    })
  }
}
