import { describe, it, expect } from 'vitest'

import { createStyles } from './utils'

describe('createStyles', () => {
  it('should convert simple style objects into CSS strings', () => {
    const result = createStyles({
      '*': { boxSizing: 'border-box' },
      body: { color: 'red' },
    })
    expect(result).toBe('*{box-sizing:border-box;}body{color:red;}')
  })

  it('should handle nested selectors', () => {
    const result = createStyles({
      body: {
        color: 'red',
        '&:hover': {
          color: 'blue',
        },
      },
    })
    expect(result).toBe('body{color:red;}body:hover{color:blue;}')
  })

  it('should handle at-rules', () => {
    const result = createStyles({
      '@media (max-width: 600px)': {
        body: {
          color: 'green',
        },
      },
    })
    expect(result).toBe('@media (max-width: 600px){body{color:green;}}')
  })

  it('should append units to numeric values except for unitless properties', () => {
    const result = createStyles({
      body: {
        margin: 0,
        opacity: 0.5,
      },
    })
    expect(result).toBe('body{margin:0px;opacity:0.5;}')
  })

  it('should handle custom properties (CSS variables)', () => {
    const result = createStyles({
      ':root': {
        '--main-color': '#06c',
      },
      body: {
        color: 'var(--main-color)',
      },
    })
    expect(result).toBe(
      ':root{--main-color:#06c;}body{color:var(--main-color);}'
    )
  })

  it('should ignore undefined values', () => {
    const result = createStyles({
      body: {
        color: undefined,
        padding: '10px',
      },
    })
    expect(result).toBe('body{padding:10px;}')
  })

  it('should handle complex nested structures', () => {
    const styles = {
      '.container': {
        display: 'flex',
        '@media (max-width: 600px)': {
          display: 'block',
        },
        '.item': {
          flex: 1,
        },
      },
    } as const
    const result = createStyles(styles)

    expect(result).toBe(
      '.container{display:flex;}@media (max-width: 600px){.container{display:block;}}.container .item{flex:1;}'
    )
  })

  it('should handle unitless properties correctly', () => {
    const result = createStyles({
      body: {
        lineHeight: 1.5,
        flexGrow: 1,
        fontWeight: 700,
      },
    })
    expect(result).toBe('body{line-height:1.5;flex-grow:1;font-weight:700;}')
  })

  it('should process multiple at-rules and nested selectors', () => {
    const result = createStyles({
      '@media (min-width: 768px)': {
        '.nav': {
          display: 'flex',
          '.nav-item': {
            marginLeft: 20,
          },
        },
      },
      '@supports (display: grid)': {
        '.grid': {
          display: 'grid',
        },
      },
    })
    expect(result).toBe(
      '@media (min-width: 768px){.nav{display:flex;}.nav .nav-item{margin-left:20px;}}@supports (display: grid){.grid{display:grid;}}'
    )
  })

  it('should handle pseudo-classes and pseudo-elements', () => {
    const result = createStyles({
      a: {
        textDecoration: 'none',
        ':hover': {
          textDecoration: 'underline',
        },
        '::after': {
          content: '""',
          display: 'block',
        },
      },
    })
    expect(result).toBe(
      'a{text-decoration:none;}a:hover{text-decoration:underline;}a::after{content:"";display:block;}'
    )
  })

  it('should correctly handle global styles without any selectors', () => {
    const result = createStyles({
      html: {
        fontSize: '16px',
      },
      body: {
        margin: 0,
        padding: 0,
      },
    })
    expect(result).toBe('html{font-size:16px;}body{margin:0px;padding:0px;}')
  })
})
