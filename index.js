const React = require('react')

/**
 * @typedef {React.CSSProperties | { [key: string]: Styles }} Styles
 * @typedef {Styles[keyof Styles]} Style
 */

const cache = new Set()

/**
 * Create a hash from a string.
 * @param {string} str
 * @returns {string}
 */
function hash(str) {
  // FNV-1a Hash Function
  var h = 0 ^ 0x811c9dc5
  for (var i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = (h * 0x01000193) >>> 0
  }

  // Base36 Encoding Function
  const letters = 'abcdefghijklmnopqrstuvwxyz'
  var base36 = '0123456789' + letters
  var result = ''
  do {
    result = base36[h % 36] + result
    h = Math.floor(h / 36)
  } while (h > 0)

  // Ensure the first character is a letter (a-z)
  return letters[0 % 26] + result.slice(1)
}

/**
 * Create a CSS rule.
 * @param {string} name
 * @param {string} selector
 * @param {string} prop
 * @param {Style} value
 * @returns {string}
 */
function createRule(name, selector, prop, value) {
  const className =
    selector === ''
      ? `.${name}`
      : selector.includes('&')
      ? selector.replace('&', `.${name}`)
      : `.${name}${selector}`
  const hyphenProp = prop.replace(/[A-Z]|^ms/g, '-$&').toLowerCase()
  return `${className.trim()}{${hyphenProp}:${
    typeof value === 'number' ? `${value}px` : value
  }}`
}

/**
 * Parse styles into class names and rules.
 * @param {Styles} styles
 * @param {string} [selector='']
 * @param {string} [parentSelector='']
 * @returns {[string, string]}
 */
function parseStyles(styles, selector = '', parentSelector = '') {
  let className = ''
  let rules = []

  for (const key in styles) {
    const value = styles[key]

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

      const [chainedClassName, chainedRules] = parseStyles(
        value,
        chainedSelector,
        atSelector || parentSelector
      )

      rules = rules.concat(chainedRules)
      className += ` ${chainedClassName}`

      continue
    }

    const cacheKey = hash(`${key}${value}`)

    if (cache.has(cacheKey)) {
      className += ` ${cacheKey}`
    } else {
      const rule = createRule(cacheKey, selector, key, value)
      rules.push(parentSelector === '' ? rule : `${parentSelector}{${rule}}`)
      className += ` ${cacheKey}`
      cache.add(cacheKey)
    }
  }

  return [className.trim(), rules.join('')]
}

/**
 * Generate CSS from an object of styles and returns atomic class names and a style element.
 * @param {Styles} styles
 * @param {string} [nonce]
 * @returns {[string, JSX.Element | null]}
 */
function css(styles, nonce) {
  const [classNames, rules] = parseStyles(styles)

  return [
    classNames,
    rules.length > 0
      ? React.createElement('style', {
          nonce,
          href: hash(rules),
          precedence: 'reset',
          children: rules,
        })
      : null,
  ]
}

module.exports = { css }
