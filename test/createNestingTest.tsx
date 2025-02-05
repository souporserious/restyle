import type { CSSProperties, FC, ReactNode } from 'react'
import type { JSX } from '../src/jsx-runtime.js'
import type { CSSObject } from '../src/types.js'
import { createUnitTest } from './createUnitTest.js'
import { styled } from '../src/styled.js'
import { camelToHyphen } from '../src/media.js'
import { describe, suite } from 'vitest'

const CSSObjectToString = (css: CSSObject | CSSProperties): string => {
  let out = ''

  for (const [key, value] of Object.entries(css)) {
    if (typeof value === 'object') {
      out += `${key} {\n${CSSObjectToString(value)}}\n`
    } else {
      out += `${camelToHyphen(key)}: ${value};\n`
    }
  }

  return out
}

const prefixStyles = (styles: CSSObject | CSSProperties, prefix: string) => {
  const out: CSSObject = {}

  for (const [key, value] of Object.entries(styles)) {
    if (typeof value === 'object' && key.startsWith('@')) {
      out[key] = prefixStyles(value, prefix)
    } else if (typeof value === 'object') {
      out[prefix + key] = prefixStyles(value, prefix)
    } else {
      out[key] = value
    }
  }

  return out
}

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

type TestProperties = {
  /**
   * what should this test be called?
   */
  name: string
  /**
   * what tag should this test element use?
   * @default 'div'
   */
  tagName?: keyof JSX.IntrinsicElements
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
}: TestProperties & {
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

export const createNestingTest = ({
  name,
  fails,
  ...props
}: TestProperties & {
  /**
   * for newly tested behaviors
   * specify if this test is expected to fail
   */
  fails?: {
    asPassed?: boolean
    withAmpersandNoSpace?: boolean
    withAmpersandWithSpace?: boolean
  }
}) => {
  describe(name, () => {
    if (props.css.color) {
      throw new Error(
        'color is inheritable, which may cause false positives. use backgroundColor instead'
      )
    }

    createSyntaxTest({ ...props, name: 'as passed', fails: fails?.asPassed })
    createSyntaxTest({
      ...props,
      name: 'with & with space',
      rulePrefix: '& ',
      fails: fails?.withAmpersandWithSpace,
    })
    createSyntaxTest({
      ...props,
      name: 'with & no space',
      rulePrefix: '&',
      fails: fails?.withAmpersandNoSpace,
    })
  })
}
