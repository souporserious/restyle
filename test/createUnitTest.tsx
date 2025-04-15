import { page } from '@vitest/browser/context'
import type { FC, ReactNode } from 'react'
import { expect, test } from 'vitest'
import { render } from 'vitest-browser-react'
import { styleDeclarationToObject } from './util.js'

/**
 * by default, we do a fast check of styles to verify that they match
 * however this can be inconvenient when debugging a test because
 * you do not know which styles are failing
 *
 * set this to true to check each style property individually,
 * which is slower but more useful for debugging
 */
const DEBUG_TEST_FAILURES = false

/**
 * if set to true, we'll run failing tests to verify that they are, in fact, failing
 *
 * this is useful because vitest will not run tests that are marked as "todo"
 */
const VERIFY_TEST_FAILURES = false

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
  const runner = fails && !VERIFY_TEST_FAILURES ? test.todo : test.concurrent
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

      // verify that styles match
      if (DEBUG_TEST_FAILURES) {
        for (const key in restyleCSS) {
          expect(`${key}: ${restyleCSS[key]}`).toEqual(
            `${key}: ${nativeCSS[key]}`
          )
        }
      } else {
        expect(restyleCSS).toEqual(nativeCSS)
      }

      for (let index = 0; index < native.children.length; index++) {
        recursiveCompare(native.children[index], restyle.children[index])
      }
    }

    // if we're in headless mode, we want to fail asap (before resizing, if possible)
    recursiveCompare(native, restyle)

    const sizesToCheck = [
      { width: 320, height: 568 },
      { width: 834, height: 1112 },
      { width: 1920, height: 1080 },
      { width: 414, height: 896 },
    ]

    for (const size of sizesToCheck) {
      await page.viewport(size.width, size.height)
      recursiveCompare(native, restyle)
    }
  })
}
