import type { CSSObject, CSSValue } from './types.js'
import { resolveNestedSelector, u } from './utils.js'

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
