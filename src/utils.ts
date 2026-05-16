/** Low precedence CSS styles. */
export const l = new Set([
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
export const m = new Set([
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
export const u =
  /^(-|f[lo].*[^se]$|g.{5,}[^ps]$|z|o[pr]|(W.{5})?[lL]i.*(t|mp)$|an|(bo|s).{4}Im|sca|m.{6}[ds]|ta|c.*[st]$|wido|ini)/

/** Hash a string using the djb2 algorithm. */
export function hash(value: string): string {
  let h = 5381
  for (let index = 0, len = value.length; index < len; index++) {
    h = ((h << 5) + h + value.charCodeAt(index)) >>> 0
  }
  return h.toString(36)
}

/** Split a comma-separated selector list while preserving nested function and attribute commas. */
export function splitSelectorList(selector: string): string[] {
  const selectors: string[] = []
  let current = ''
  let depth = 0
  let quote = ''

  for (let index = 0; index < selector.length; index++) {
    const char = selector[index]

    if (quote) {
      current += char

      if (char === '\\') {
        current += selector[++index] ?? ''
      } else if (char === quote) {
        quote = ''
      }

      continue
    }

    if (char === '"' || char === "'") {
      quote = char
      current += char
      continue
    }

    if (char === '(' || char === '[') {
      depth++
      current += char
      continue
    }

    if (char === ')' || char === ']') {
      depth--
      current += char
      continue
    }

    if (char === ',' && depth === 0) {
      selectors.push(current.trim())
      current = ''
      continue
    }

    current += char
  }

  selectors.push(current.trim())
  return selectors
}

function resolveSelectorPart(key: string, selector: string) {
  if (key.includes('&')) {
    return key.replaceAll('&', selector)
  }

  if (key.startsWith(':') || key.startsWith('::')) {
    return selector + key
  }

  return selector + ' ' + key
}

/** Resolve a nested selector. */
export function resolveNestedSelector(key: string, selector: string) {
  if (!selector) {
    return key
  }

  const parents = splitSelectorList(selector)
  const children = splitSelectorList(key)
  const selectors: string[] = []

  for (const parent of parents) {
    for (const child of children) {
      selectors.push(resolveSelectorPart(child, parent))
    }
  }

  return selectors.join(', ')
}
