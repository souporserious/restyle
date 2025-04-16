import type { CSSObject, CSSValue, CSSRule } from './types.js'

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
const u =
  /^(-|f[lo].*[^se]$|g.{5,}[^ps]$|z|o[pr]|(W.{5})?[lL]i.*(t|mp)$|an|(bo|s).{4}Im|sca|m.{6}[ds]|ta|c.*[st]$|wido|ini)/

/** Hash a string using the djb2 algorithm. */
export function hash(value: string): string {
  let h = 5381
  for (let index = 0, len = value.length; index < len; index++) {
    h = ((h << 5) + h + value.charCodeAt(index)) >>> 0
  }
  return h.toString(36)
}

/** Resolve a nested selector. */
function resolveNestedSelector(key: string, selector: string) {
  if (key.includes('&')) {
    return selector ? key.replaceAll('&', selector) : key
  } else if (key.startsWith(':') || key.startsWith('::')) {
    return selector + key
  } else if (selector) {
    return selector + ' ' + key
  }
  return key
}

/** Create a single CSS rule from a CSS object. */
export function createRule(
  name: string,
  selector: string,
  prop: string,
  value: CSSValue
): string {
  let className = ''

  if (selector === '') {
    className = '.' + name
  } else if (selector.includes('&')) {
    className = selector.replaceAll('&', '.' + name)
  } else {
    className =
      '.' + name + (selector.startsWith(':') ? selector : ' ' + selector)
  }

  const hyphenProp = prop.replace(/[A-Z]|^ms/g, '-$&').toLowerCase()
  let parsedValue: CSSValue
  if (prop.startsWith('--') || u.test(prop)) {
    parsedValue = value
  } else {
    parsedValue = typeof value === 'number' ? value + 'px' : value
  }

  return className.trim() + '{' + hyphenProp + ':' + parsedValue + '}'
}

type CSSRulePrecedences = [
  CSSRule[],
  CSSRule[],
  CSSRule[],
  CSSRulePrecedences[],
]

/** Create a string of CSS class names and rules ordered by precedence from a CSS object. */
export function createRules(
  styles: CSSObject,
  selector = '',
  atRules: string[] = []
): [classNames: string, rules: CSSRulePrecedences] {
  const lowRules: CSSRule[] = []
  const mediumRules: CSSRule[] = []
  const highRules: CSSRule[] = []
  const nested: CSSRulePrecedences[] = []
  let classNames = ''

  for (const key in styles) {
    const value = styles[key as keyof CSSObject]

    if (value === undefined || value === null) {
      continue
    }

    if (typeof value === 'object') {
      let nestedClass = ''
      let nestedRules: CSSRulePrecedences

      if (key.startsWith('@')) {
        atRules.push(key)
        ;[nestedClass, nestedRules] = createRules(
          value as CSSObject,
          selector,
          atRules
        )
        atRules.pop()
      } else {
        ;[nestedClass, nestedRules] = createRules(
          value as CSSObject,
          resolveNestedSelector(key, selector),
          atRules
        )
      }

      classNames += nestedClass + ' '
      nested.push(nestedRules)
      continue
    }

    const precedence = l.has(key) ? 'l' : m.has(key) ? 'm' : 'h'
    const className =
      precedence + hash(key + value + selector + atRules.join(''))
    let rule = createRule(className, selector, key, value)
    if (atRules.length > 0) {
      const atPrefix = atRules.join('{') + '{'
      const atSuffix = '}'.repeat(atRules.length)
      rule = atPrefix + rule + atSuffix
    }
    classNames += className + ' '
    if (precedence === 'l') {
      lowRules.push([className, rule])
    } else if (precedence === 'm') {
      mediumRules.push([className, rule])
    } else {
      highRules.push([className, rule])
    }
  }

  return [classNames.trim(), [lowRules, mediumRules, highRules, nested]]
}

/** Convert a CSS object into a string of global CSS styles. */
export function createStyles(
  styles: CSSObject,
  selector = '',
  atRules: string[] = []
): string {
  let declarations = ''
  let nestedCss = ''

  for (const key in styles) {
    const value = styles[key as keyof CSSObject]

    if (value === undefined || value === null) {
      continue
    }

    if (typeof value === 'object') {
      if (key.startsWith('@')) {
        nestedCss +=
          key + '{' + createStyles(value as CSSObject, selector, []) + '}'
      } else {
        const nestedSelector = resolveNestedSelector(key, selector)
        nestedCss += createStyles(value as CSSObject, nestedSelector, atRules)
      }
      continue
    }

    const hyphenProp = key.replace(/[A-Z]|^ms/g, '-$&').toLowerCase()
    let parsedValue: CSSValue

    if (key.startsWith('--') || u.test(key)) {
      parsedValue = value
    } else {
      parsedValue = typeof value === 'number' ? value + 'px' : value
    }

    declarations += `${hyphenProp}:${parsedValue};`
  }

  let result = ''
  if (declarations) {
    result += selector ? selector + '{' + declarations + '}' : declarations
  }
  result += nestedCss

  if (result && atRules.length > 0) {
    const atPrefix = atRules.join('{') + '{'
    const atSuffix = '}'.repeat(atRules.length)
    result = atPrefix + result + atSuffix
  }

  return result
}
