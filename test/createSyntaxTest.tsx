import type { FC, JSX, ReactNode } from 'react'
import { styled } from '../src/styled.js'
import type { CSSObject } from '../src/types.js'
import { createUnitTest } from './createUnitTest.js'
import { CSSObjectToString, prefixStyles } from './util.js'

type ContentInput =
  | JSX.Element
  | ((
      This: FC<{
        id?: string
        children?: ReactNode
        className?: string
        lang?: string
        title?: string
      }>
    ) => JSX.Element)

export type SyntaxTestOptions = {
  /**
   * what should this test be called?
   */
  name: string
  /**
   * what tag should this test element use?
   * @default 'div'
   */
  tagName?: 'div'
  /**
   * content to nest beneath this test element
   * can also be a function that takes the test element as an argument
   */
  children: ContentInput
  /**
   * CSS styles to use for this element
   */
  css: CSSObject
  /**
   * if you need to inject extra styles to e.g. define something like @layer
   */
  injectStyle?: (css: typeof String.raw) => string
}

/**
 * a convenience wrapper around createUnitTest
 * native CSS will be auto-generated from the provided CSS object
 * and our HTML structure will be auto-generated from the provided children, preContent, and postContent
 */
export const createSyntaxTest = ({
  name,
  fails,
  tagName: TagName = 'div',
  children: children,
  css: cssInput,
  rulePrefix = '',
  injectStyle,
}: SyntaxTestOptions & {
  /**
   * for newly tested behaviors
   * specify if this test is expected to fail
   */
  fails?: boolean
  /**
   * if desired, specify the rule prefix for this test
   * this can be used, for example, to prepend an ampersand to all rules
   * @default ''
   */
  rulePrefix?: string
}) => {
  const prefixedStyle = prefixStyles(cssInput, rulePrefix)
  const Element = styled(TagName, prefixedStyle)

  const NativeTestElement = (props: {
    children?: ReactNode
    className?: string
  }) => {
    return (
      <TagName
        {...props}
        className={`native-test-element ${props.className || ''}`}
      />
    )
  }

  const restyleContent =
    typeof children === 'function' ? children(Element) : children
  const nativeContent =
    typeof children === 'function' ? children(NativeTestElement) : children

  createUnitTest({
    name,
    fails,
    test: (
      <>
        {restyleContent}
        <Element>
          <Element>{restyleContent}</Element>
          {restyleContent}
        </Element>
        {restyleContent}
      </>
    ),
    expect: (
      <>
        {nativeContent}
        <NativeTestElement>
          <NativeTestElement>{nativeContent}</NativeTestElement>
          {nativeContent}
        </NativeTestElement>
        {nativeContent}
      </>
    ),
    css: (css) => css`
      ${injectStyle?.(String.raw) || ''}

      .native-test-element {
        ${CSSObjectToString(prefixedStyle)}
      }
    `,
  })
}
