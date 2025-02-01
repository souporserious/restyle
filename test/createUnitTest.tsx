import type { FC, ReactNode } from 'react'
import { expect, test } from 'vitest'
import { render } from 'vitest-browser-react'

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
 * compare a restyle component to a native html + css structure
 * and verify that current styles and structure match exactly
 */
export const createUnitTest = ({
  name,
  test: TestContent,
  expect: ExpectContent,
  css,
  fails,
}: {
  /**
   * what should this test be called?
   */
  name: string
  /**
   * a restyle component to render or JSX to display
   */
  test: ReactNode | FC
  /**
   * the expected HTML structure of the component
   * only tag names are compared, not attributes
   */
  expect: ReactNode | FC
  /**
   * CSS styles to add to the stylesheet for this test
   */
  css?: string
  /**
   * for newly tested behaviors
   * specify if this test is expected to fail
   */
  fails?: boolean
}) => {
  test(name, { fails }, async () => {
    const { getByTestId } = render(
      <>
        <div data-testid="restyle">
          {typeof TestContent === 'function' ? <TestContent /> : TestContent}
        </div>
        <div data-testid="native">
          {typeof ExpectContent === 'function' ? (
            <ExpectContent />
          ) : (
            ExpectContent
          )}
        </div>
        <style>{css}</style>
      </>
    )

    // crawl through each tree and ensure every element has the same styles

    const native = getByTestId('native').element()
    const restyle = getByTestId('restyle').element()

    const recursiveCompare = (
      native: Element | undefined,
      restyle: Element | undefined
    ) => {
      if (native === undefined || restyle === undefined) return

      const nativeCSS = styleDeclarationToObject(
        window.getComputedStyle(native)
      )
      const restyleCSS = styleDeclarationToObject(
        window.getComputedStyle(restyle)
      )

      // verify that the dom structure matches
      expect(native.tagName).toEqual(restyle.tagName)
      expect(native.children.length).toEqual(restyle.children.length)

      // check some common styles first, then check all styles
      expect(nativeCSS.color).toEqual(restyleCSS.color)
      expect(nativeCSS.backgroundColor).toEqual(restyleCSS.backgroundColor)
      expect(nativeCSS).toEqual(restyleCSS)

      for (let index = 0; index < native.children.length; index++) {
        recursiveCompare(native.children[index], restyle.children[index])
      }
    }

    recursiveCompare(native, restyle)
  })
}
