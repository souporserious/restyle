import { test } from 'vitest'
import { render } from 'vitest-browser-react'
import { expectMatchingStyles } from './expectMatchingStyles.js'
import { styled } from '../src/styled.js'
import { page } from '@vitest/browser/context'

// basic matching test
test('expectMatchingStyles', () => {
  const screen = render(<div>hello world</div>)

  expectMatchingStyles(screen, <div>hello world</div>, (css) => css``)
})

const Text = styled('div', ({ color }: { color?: string }) => ({
  color: color || 'red',
}))

// components with styles
test('expectMatchingStyles - styled', () => {
  const screen = render(<Text>hello world</Text>)

  expectMatchingStyles(
    screen,
    <div>hello world</div>,
    (css) => css`
      div {
        color: red;
      }
    `
  )
})

// checking components after rerender
test('expectMatchingStyles - rerender', () => {
  const screen = render(<Text>hello world</Text>)

  expectMatchingStyles(
    screen,
    <div>hello world</div>,
    (css) => css`
      div {
        color: red;
      }
    `
  )

  screen.rerender(<Text color="blue">hello world</Text>)

  expectMatchingStyles(
    screen,
    <div>hello world</div>,
    (css) => css`
      div {
        color: blue;
      }
    `
  )
})

const MediaTest = styled('div', {
  color: 'red',
  '@media (width >= 1000px)': {
    color: 'blue',
  },
})

// different viewport sizes
test('expectMatchingStyles - viewport sizes', async () => {
  const screen = render(<MediaTest>hello world</MediaTest>)

  expectMatchingStyles(
    screen,
    <div>hello world</div>,
    (css) => css`
      div {
        color: red;
      }
    `
  )

  await page.viewport(1000, 1000)

  expectMatchingStyles(
    screen,
    <div>hello world</div>,
    (css) => css`
      div {
        color: blue;
      }
    `
  )
})
