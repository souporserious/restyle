import type { FC, ReactNode } from 'react'
import { expect, test } from 'vitest'
import { render } from 'vitest-browser-react'
import { page } from '@vitest/browser/context'

/**
 * if set to true, we'll run failing tests to verify that they are, in fact, failing
 * this is useful because vitest will not run tests that are marked as "todo"
 */
const VERIFY_TEST_FAILURES = false

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
 *
 * this is the broadest way to test a behavior, and all unit tests helpers wrap this
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
   *
   * (as a note, naming the template `css` gives convenient formatting)
   */
  css?: (css: typeof String.raw) => string
  /**
   * for newly tested behaviors
   * specify if this test is expected to fail
   */
  fails?: boolean
}) => {
  const runner = fails && !VERIFY_TEST_FAILURES ? test.todo : test
  runner(name, { fails }, async () => {
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
        <style>{css?.(String.raw)}</style>
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
      expect(restyleCSS.color).toEqual(nativeCSS.color)
      expect(restyleCSS.backgroundColor).toEqual(nativeCSS.backgroundColor)
      expect(restyleCSS).toEqual(nativeCSS)

      for (let index = 0; index < native.children.length; index++) {
        recursiveCompare(native.children[index], restyle.children[index])
      }
    }

    const sizesToCheck = [10, 1000, 10000]

    for (const size of sizesToCheck) {
      await page.viewport(size, size)
      recursiveCompare(native, restyle)
    }
  })
}
