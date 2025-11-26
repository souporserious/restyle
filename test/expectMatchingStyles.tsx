import type { ReactNode } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { expect } from 'vitest'
import type { RenderResult } from 'vitest-browser-react'

/**
 * in order to deeply compare styles across all browsers, we need to convert
 * to a regular object - deep comparison of style objects will always
 * succeed in webkit & firefox otherwise
 */
const styleDeclarationToObject = (style: CSSStyleDeclaration) => {
  const object: Record<string, string | undefined> = {}
  for (const key in style) {
    object[key] = style[key]
  }
  return object
}

/**
 * recursively compare the dom structure and styles of two elements
 * this will verify that each element has the same children and styles
 *
 * attributes are not compared
 *
 * @param elementA
 * @param elementB
 * @returns
 */
const expectElementMatches = (
  elementA: Element | undefined,
  elementB: Element | undefined
) => {
  if (elementA === undefined || elementB === undefined) return

  const elementStyleA = styleDeclarationToObject(
    window.getComputedStyle(elementA)
  )
  const elementStyleB = styleDeclarationToObject(
    window.getComputedStyle(elementB)
  )

  // verify that the dom structure matches
  expect(elementA.tagName).toEqual(elementB.tagName)
  expect(elementA.children.length).toEqual(elementB.children.length)

  // verify that styles match
  for (const key in elementStyleB) {
    expect(`${key}: ${elementStyleB[key]}`).toEqual(
      `${key}: ${elementStyleA[key]}`
    )
  }

  for (let index = 0; index < elementA.children.length; index++) {
    expectElementMatches(elementA.children[index], elementB.children[index])
  }
}

export const expectMatchingStyles = (
  screen: RenderResult,
  html: ReactNode,
  css: (css: typeof String.raw) => string
) => {
  const htmlInput = renderToStaticMarkup(html)
  const cssInput = css(String.raw) ?? ''

  // open a new tab
  // we use two blank tabs to compare because vitest will insert its own styles
  // which will cause the styles to not match
  const nativeTab = window.open(
    'about:blank',
    '_blank',
    `width=${window.innerWidth},height=${window.innerHeight}`
  )
  const restyleTab = window.open(
    'about:blank',
    '_blank',
    `width=${window.innerWidth},height=${window.innerHeight}`
  )
  if (!nativeTab) throw new Error('failed to open new tab')
  if (!restyleTab) throw new Error('failed to open new tab')

  // inject the html and css into the new tab
  const nativeStyle = nativeTab.document.createElement('style')
  nativeStyle.innerHTML = cssInput
  nativeTab.document.head.appendChild(nativeStyle)
  nativeTab.document.body.innerHTML = htmlInput

  // copy the test content into our second tab
  restyleTab.document.body.innerHTML = screen.container.innerHTML
  const restyles = document.querySelectorAll('style[data-precedence')
  for (const style of restyles) {
    restyleTab.document.head.appendChild(style.cloneNode(true))
  }

  expectElementMatches(restyleTab.document.body, nativeTab.document.body)

  // close the tabs
  nativeTab.close()
  restyleTab.close()
}
