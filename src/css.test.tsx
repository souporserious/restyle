import { afterEach, describe, expect, test } from 'vitest'

import { css } from './css.js'
import {
  clearGlobalCssCache,
  setGlobalCssCache,
  type CssPropCacheEntry,
} from './css-cache.js'
import { createCssPropKey, normalizeCssObject } from './css-props-helpers.js'
import type { CSSRulePrecedences } from './types.js'

afterEach(() => {
  clearGlobalCssCache()
})

describe('css', () => {
  test('returns a Styles component when cache is missing', () => {
    const [classNames, Styles] = css({ color: 'red' })

    expect(typeof classNames).toBe('string')
    expect(Styles).not.toBeNull()
    expect(typeof Styles).toBe('function')
  })

  test('returns cached class names and skips rendering when available', () => {
    const styles = normalizeCssObject({ color: 'red' })
    const key = createCssPropKey(styles)
    const rules: CSSRulePrecedences = [[], [], [], []]

    const entry: CssPropCacheEntry = {
      styles,
      classNames: 'l123',
      rules,
    }

    setGlobalCssCache({ entries: { [key]: entry } })

    const [classNames, Styles] = css({ color: 'red' })

    expect(classNames).toBe('l123')
    expect(Styles).toBeNull()
  })
})
