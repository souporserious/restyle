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
  let hash = 5381
  for (let index = 0; index < value.length; index++) {
    hash = ((hash << 5) + hash + value.charCodeAt(index)) >>> 0
  }
  return hash.toString(36)
}

/** Create a single CSS rule from a CSS object. */
export function createRule(
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

  const rule = className.trim() + '{' + hyphenProp + ':' + parsedValue + '}'

  return parentSelector === '' ? rule : parentSelector + '{' + rule + '}'
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
  parentSelector = ''
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
      const atSelector = /^@/.test(key) ? key : undefined
      const chainedSelector = atSelector
        ? selector
        : key.startsWith(':')
          ? selector + key
          : selector + ' ' + key
      const [nestedClass, nestedRules] = createRules(
        value as CSSObject,
        chainedSelector,
        atSelector || parentSelector
      )

      classNames += nestedClass + ' '
      nested.push(nestedRules)
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

  return [classNames.trim(), [lowRules, mediumRules, highRules, nested]]
}

/** Convert a CSS object into a string of global CSS styles. */
export function createStyles(styles: CSSObject): string {
  function process(
    styles: CSSObject,
    selector = '',
    parentAtRule = ''
  ): string {
    let declarations = ''
    let nestedCss = ''

    for (const key in styles) {
      const value = styles[key as keyof CSSObject]

      if (value === undefined || value === null) {
        continue
      }

      if (typeof value === 'object') {
        const atRule = /^@/.test(key) ? key : undefined
        let nestedSelector = ''

        if (atRule) {
          nestedSelector = selector
        } else if (key.includes('&')) {
          nestedSelector = key.replace(/&/g, selector)
        } else if (key.startsWith(':') || key.startsWith('::')) {
          nestedSelector = selector + key
        } else if (selector) {
          nestedSelector = selector + ' ' + key
        } else {
          nestedSelector = key
        }

        const nestedResult = process(
          value as CSSObject,
          nestedSelector,
          atRule || parentAtRule
        )
        if (atRule) {
          nestedCss += `${key}{${nestedResult}}`
        } else {
          nestedCss += nestedResult
        }
        continue
      }

      // CSS property
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
      result += `${selector}{${declarations}}`
    }
    result += nestedCss

    return result
  }

  return process(styles)
}
