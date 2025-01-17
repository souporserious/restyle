import { ComponentType, FC, ReactNode } from 'react'
import { expect, test } from 'vitest'
import { render } from 'vitest-browser-react'

/**
 * verify that styles applied to a single div
 * match the equivalent native CSS
 */
export const createUnitTest = ({
  name,
  test: TestContent,
  expect: ExpectContent,
  css,
}: {
  /**
   * what should this test be called?
   */
  name: string
  /**
   * a restyle component to render
   */
  test: ReactNode | ((...args: unknown[]) => ReactNode)
  /**
   * the expected HTML structure of the component
   * only tag names are compared, not attributes
   */
  expect: ReactNode | ((...args: unknown[]) => ReactNode)
  /**
   * the expected CSS styles of the component
   */
  css?: string
}) => {
  test(name, async () => {
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

    const recursiveCompare = (native: Element, restyle: Element) => {
      const nativeCSS = window.getComputedStyle(native)
      const restyleCSS = window.getComputedStyle(restyle)

      expect(native.tagName).toEqual(restyle.tagName)
      expect(native.children.length).toEqual(restyle.children.length)
      expect(nativeCSS).toEqual(restyleCSS)

      for (let index = 0; index < native.children.length; index++) {
        recursiveCompare(native.children[index], restyle.children[index])
      }
    }

    recursiveCompare(native, restyle)
  })
}
