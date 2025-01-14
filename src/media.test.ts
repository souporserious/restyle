import { describe, it, expect } from 'vitest'

import { media } from './media.js'

describe('media', () => {
  it('converts simple media query object to a string', () => {
    const mq = media({
      minWidth: '60rem',
    })
    expect(mq).toBe('@media (min-width: 60rem)')
  })

  it('converts a single media query object to a string', () => {
    const mq = media({
      screen: true,
      minWidth: 768,
      orientation: 'portrait',
    })
    expect(mq).toBe(
      '@media screen and (min-width: 768px) and (orientation: portrait)'
    )
  })

  it('handles multiple media query objects as arguments', () => {
    const mq = media(
      { minWidth: 20 },
      { screen: true, orientation: 'landscape' }
    )
    expect(mq).toBe(
      '@media (min-width: 20px), screen and (orientation: landscape)'
    )
  })

  it('handles "not" and "only" qualifiers', () => {
    const mq1 = media({
      not: true,
      print: true,
      screen: true,
    })
    expect(mq1).toBe('@media not print and screen')

    const mq2 = media({
      only: true,
      print: true,
    })
    expect(mq2).toBe('@media only print')
  })

  it('appends "px" to numeric dimension values', () => {
    const mq = media({
      minWidth: 1024,
      maxHeight: 768,
    })
    expect(mq).toBe('@media (min-width: 1024px) and (max-height: 768px)')
  })

  it('handles various media features correctly', () => {
    const mq = media({
      screen: true,
      minResolution: '2dppx',
      orientation: 'landscape',
      monochrome: 0,
    })
    expect(mq).toBe(
      '@media screen and (min-resolution: 2dppx) and (orientation: landscape) and (monochrome: 0)'
    )
  })

  it('throws a TypeScript error for invalid features', () => {
    media({
      screen: true,
      // @ts-expect-error
      invalidFeature: 'value',
    })
  })

  it('handles boolean features correctly', () => {
    const mq = media({
      screen: true,
      hover: 'none',
    })
    expect(mq).toBe('@media screen and (hover: none)')
  })

  it('converts camelCase features to hyphen-case', () => {
    const mq = media({
      minDeviceWidth: 320,
      maxDeviceWidth: 480,
    })
    expect(mq).toBe(
      '@media (min-device-width: 320px) and (max-device-width: 480px)'
    )
  })

  it('handles media features with string values', () => {
    const mq = media({
      orientation: 'landscape',
      scan: 'progressive',
    })
    expect(mq).toBe('@media (orientation: landscape) and (scan: progressive)')
  })

  it('combines multiple queries with commas', () => {
    const mq = media({ screen: true, minWidth: 800 }, { print: true })
    expect(mq).toBe('@media screen and (min-width: 800px), print')
  })

  it('handles the "all" media type', () => {
    const mq = media({
      all: true,
      minWidth: 1024,
    })
    expect(mq).toBe('@media all and (min-width: 1024px)')
  })

  it('ignores undefined values', () => {
    const mq = media({
      screen: true,
      minWidth: undefined,
      maxWidth: 1200,
    })
    expect(mq).toBe('@media screen and (max-width: 1200px)')
  })

  it('supports the "only" qualifier without media type', () => {
    const mq = media({
      only: true,
      colorGamut: 'p3',
    })
    expect(mq).toBe('@media only (color-gamut: p3)')
  })
})
