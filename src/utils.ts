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

/** Resolve a nested selector. */
export function resolveNestedSelector(key: string, selector: string) {
  if (key.includes('&')) {
    return selector ? key.replaceAll('&', selector) : key
  } else if (key.startsWith(':') || key.startsWith('::')) {
    return selector + key
  } else if (selector) {
    return selector + ' ' + key
  }
  return key
}
