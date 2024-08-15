/// <reference types="react/canary" />
import * as React from 'react'

import { ClientCache } from './client-cache'
import type { AcceptsClassName, CSSObject, CSSValue } from './types'

export type CSSProp = CSSObject

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

  return result
}

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

const cssRulesMap = new Map<string, string>()

/** Parse a CSS styles object into class names and store rule data in a global map. */
function createClassNames(
  styles: CSSObject,
  selector = '',
  parentSelector = ''
): string {
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
      const chainedClassNames = createClassNames(
        value as CSSObject,
        chainedSelector,
        atSelector || parentSelector
      )

      classNames += ' ' + chainedClassNames
      continue
    }

    const precedence = lowPrecedenceProps.has(key)
      ? 'l'
      : mediumPrecedenceProps.has(key)
        ? 'm'
        : 'h'
    const className = precedence + hash(key + value + selector + parentSelector)

    classNames += ' ' + className

    if (!cssRulesMap.has(className)) {
      cssRulesMap.set(
        className,
        createRule(
          className,
          selector.trim(),
          parentSelector.trim(),
          key,
          value
        )
      )
    }
  }

  return classNames.trim()
}

type Cache = { current: Set<string> | null }

const isClientComponent = Boolean(React.useRef)
const serverCache = React.cache<() => Cache>(() => ({ current: null }))
let cache: Cache = { current: null }

function getLocalCache(): Set<string> {
  if (!isClientComponent) {
    cache = serverCache()
  }

  if (cache.current === null) {
    cache.current = new Set()
  }

  return cache.current
}

/**
 * Generates CSS from an object of styles.
 *
 * **Note** this is an isomorphic function that acts as a utility function on
 * the server and a hook on the client so it must respect the rules of hooks when
 * used on the client.
 *
 * @returns Atomic class names for each rule and style elements for each precedence.
 */
export function css(
  styles: CSSObject,
  nonce?: string
): [string, () => React.ReactNode] {
  const classNames = createClassNames(styles)

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
    const localCache = getLocalCache()
    const globalCache = isClientComponent
      ? globalThis.__RESTYLE_CACHE
      : undefined
    const classNamesArray = classNames.split(' ')
    const classNamesCount = classNamesArray.length
    let lowRules = ''
    let mediumRules = ''
    let highRules = ''

    for (let index = 0; index < classNamesCount; index++) {
      const className = classNamesArray[index]!
      const rule = cssRulesMap.get(className)

      if (rule === undefined) {
        continue
      }

      const hasCache = localCache.has(rule) || globalCache?.has(rule)

      if (hasCache) {
        continue
      }

      if (!isClientComponent) {
        localCache.add(rule)
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

    // Only cache on the client once styles have actually rendered
    if (isClientComponent) {
      React.useLayoutEffect(() => {
        for (let index = 0; index < classNamesCount; index++) {
          const className = classNamesArray[index]!
          const rule = cssRulesMap.get(className)!
          localCache.add(rule)
        }
      }, [])
    }

    return (
      <>
        <style
          nonce={nonce}
          // @ts-expect-error
          href={lowRules.length > 0 ? hash(lowRules) : 'rsli'}
          precedence="rsl"
          children={lowRules}
        />

        <style
          nonce={nonce}
          // @ts-expect-error
          href={mediumRules.length > 0 ? hash(mediumRules) : 'rsmi'}
          precedence="rsm"
          children={mediumRules}
        />

        {highRules.length > 0 ? (
          <style
            nonce={nonce}
            // @ts-expect-error
            href={highRules.length > 0 ? hash(highRules) : undefined}
            precedence="rsh"
            children={highRules}
          />
        ) : null}

        {isClientComponent ? null : <ClientCache cache={localCache} />}
      </>
    )
  }

  return [classNames, Styles]
}

/**
 * Creates a JSX component that forwards a `className` prop with the generated
 * atomic class names to the provided `Component`. Additionally, a `css` prop can
 * be provided to override the initial `styles`.
 *
 * Note, the provided component must accept a `className` prop.
 */
export function styled<
  ComponentType extends React.ElementType,
  StyleProps extends Record<string, unknown>,
>(
  Component: AcceptsClassName<ComponentType>,
  styles?: CSSObject | ((props: StyleProps) => CSSObject)
) {
  return ({
    className: classNameProp,
    css: cssProp,
    ...props
  }: React.ComponentProps<ComponentType> &
    StyleProps & {
      className?: string
      css?: CSSObject
    }) => {
    let parsedStyles: CSSObject

    if (typeof styles === 'function') {
      const accessedProps = new Set<keyof StyleProps>()
      const proxyProps = new Proxy(props as unknown as StyleProps, {
        get(target, prop: string) {
          accessedProps.add(prop)
          return target[prop]
        },
      })

      parsedStyles = styles(proxyProps)

      // Filter out accessed props from the original props
      accessedProps.forEach((prop) => {
        delete (props as unknown as StyleProps)[prop]
      })
    } else {
      parsedStyles = styles || {}
    }

    const [classNames, Styles] = css({
      ...parsedStyles,
      ...cssProp,
    })
    const className = classNameProp
      ? classNameProp + ' ' + classNames
      : classNames

    return (
      <>
        {/* @ts-expect-error */}
        <Component className={className} {...props} />
        <Styles />
      </>
    )
  }
}
