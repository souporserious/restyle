import type {
  CSSObject,
  CSSRule,
  CSSRulePrecedences,
  CSSValue,
} from './types.js'
import { resolveNestedSelector, l, m, u, hash } from './utils.js'

/** map every generated className back to its original CSS object */
const rulesCache: Record<string, CSSObject> = {}
export const addToRulesCache = (className: string, cssObject: CSSObject) => {
  rulesCache[className] = cssObject
}

/** type checking for objects */
const isNestedObject = (
  item: CSSObject[keyof CSSObject]
): item is CSSObject => {
  return (
    item !== null && typeof item === 'object' && item.constructor === Object
  )
}

/** deeply merges a list of CSSObjects into one object */
export const mergeStyles = (
  objects: (CSSObject | undefined | null)[]
): CSSObject => {
  const merged: CSSObject = {}

  for (const currentObject of objects) {
    if (!currentObject) continue

    for (const key in currentObject) {
      // ensure the key is directly on the object, not from its prototype
      if (Object.prototype.hasOwnProperty.call(currentObject, key)) {
        const newValue = currentObject[key]
        const existingValue = merged[key]

        // if both the existing value and the new value are plain objects,
        // recursively merge them
        if (isNestedObject(existingValue) && isNestedObject(newValue)) {
          merged[key] = mergeStyles([existingValue, newValue])
        } else {
          // otherwise, assign the new value directly
          merged[key] = newValue
        }
      }
    }
  }

  return merged
}

/** merging rules, with extended dev classes */
export function makeClass(strings: (string | number)[]) {
  const generated = hash(strings.join(''))

  if (process.env.NODE_ENV === 'production') {
    return generated
  }

  return (
    generated +
    '-' +
    strings
      .filter(Boolean)
      .join('-')
      .replaceAll(/[^a-zA-Z0-9-]/g, '')
  )
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

/** Create a string of CSS class names and rules ordered by precedence from a CSS object. */
export function createRules(
  stylesIn: CSSObject,
  selector = '',
  atRules: string[] = [],
  classOverrides: string[] = []
): [classNames: string, rules: CSSRulePrecedences] {
  const lowRules: CSSRule[] = []
  const mediumRules: CSSRule[] = []
  const highRules: CSSRule[] = []
  const nested: CSSRulePrecedences[] = []
  let classNames = ''

  const styleOverride = mergeStyles(
    classOverrides.map((className) => rulesCache[className])
  )
  const styles = mergeStyles([stylesIn, styleOverride])

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

    let originalObject: CSSObject = { [key]: value }
    for (let index = atRules.length - 1; index >= 0; index--) {
      const rule = atRules[index]
      if (typeof rule === 'string') originalObject = { [rule]: originalObject }
    }

    const precedence = l.has(key) ? 'l' : m.has(key) ? 'm' : 'h'
    const className =
      precedence + hash(key + value + selector + atRules.join(''))
    addToRulesCache(className, originalObject)
    let rule = createRule(className, selector, key, value)
    if (atRules.length > 0) {
      const atPrefix = atRules.join('{') + '{'
      const atSuffix = '}'.repeat(atRules.length)
      rule = atPrefix + rule + atSuffix
    }
    classNames += className + ' '
    if (precedence === 'l') {
      lowRules.push([className, rule, originalObject])
    } else if (precedence === 'm') {
      mediumRules.push([className, rule, originalObject])
    } else {
      highRules.push([className, rule, originalObject])
    }
  }

  return [classNames.trim(), [lowRules, mediumRules, highRules, nested]]
}
