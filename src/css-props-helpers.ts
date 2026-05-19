import type { CSSObject } from './types.js'

/** Create a stable cache key for a CSS object. */
export function createCssPropKey(styles: CSSObject): string {
  return stableStringify(styles)
}

/** Recursively remove nullable values while preserving nested structures. */
export function normalizeCssObject(styles: CSSObject): CSSObject {
  const normalized: CSSObject = {} as CSSObject
  const record = styles as Record<string, any>
  const normalizedRecord = normalized as Record<string, any>

  for (const key of Object.keys(record)) {
    const value = record[key]

    if (value === undefined || value === null) {
      continue
    }

    if (Array.isArray(value)) {
      normalizedRecord[key] = value.map((item) => {
        if (item && typeof item === 'object' && !Array.isArray(item)) {
          return normalizeCssObject(item as CSSObject)
        }

        return item
      })
      continue
    }

    if (typeof value === 'object') {
      normalizedRecord[key] = normalizeCssObject(value as CSSObject)
      continue
    }

    normalizedRecord[key] = value
  }

  return normalized
}

function stableStringify(value: unknown): string {
  if (Array.isArray(value)) {
    return '[' + value.map((item) => stableStringify(item)).join(',') + ']'
  }

  if (value && typeof value === 'object') {
    const entries = Object.keys(value as Record<string, unknown>)
      .sort()
      .map((key) => {
        const child = (value as Record<string, unknown>)[key]
        return `${JSON.stringify(key)}:${stableStringify(child)}`
      })

    return '{' + entries.join(',') + '}'
  }

  const json = JSON.stringify(value)
  return json === undefined ? 'undefined' : json
}
