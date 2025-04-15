import type { CSSProperties } from 'react'
import { camelToHyphen } from '../src/media.js'
import type { CSSObject } from '../src/types.js'

/**
 * in order to deeply compare styles across all browsers, we need to convert
 * to a regular object - deep comparison of style objects will always
 * succeed in webkit & firefox otherwise
 */
export const styleDeclarationToObject = (style: CSSStyleDeclaration) => {
  const object: Record<string, string | undefined> = {}
  for (const key in style) {
    object[key] = style[key]
  }
  return object
}

/**
 * convert a restyle CSS object to native CSS
 */
export const CSSObjectToString = (css: CSSObject | CSSProperties): string => {
  let out = ''

  for (const [key, value] of Object.entries(css)) {
    if (typeof value === 'object') {
      out += `${key} {\n${CSSObjectToString(value)}}\n`
    } else {
      out += `${camelToHyphen(key)}: ${value};\n`
    }
  }

  return out
}

/**
 * prefix a restyle CSS object with a given prefix,
 *
 * for example, if the prefix is "&", then `.test` would become `&.test`
 */
export const prefixStyles = (
  styles: CSSObject | CSSProperties,
  prefix: string
) => {
  const out: CSSObject = {}

  for (const [key, value] of Object.entries(styles)) {
    if (typeof value === 'object' && key.startsWith('@')) {
      out[key] = prefixStyles(value, prefix)
    } else if (typeof value === 'object') {
      out[prefix + key] = prefixStyles(value, prefix)
    } else {
      out[key] = value
    }
  }

  return out
}
