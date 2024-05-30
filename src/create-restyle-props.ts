import { cloneElement } from 'react'

import { css } from './index'

const voidElements = new Set(['br', 'embed', 'hr', 'img', 'input'])

/** Create a `restyle` JSX props object that handles the `css` prop to generate atomic class names. */
export function createRestyleProps(
  type: string | React.ComponentType,
  props: Record<string, any>
): [Record<string, any>, React.ReactNode] {
  // Only process the `css` prop for React elements.
  if (typeof type !== 'string') {
    return [props, null]
  }

  const [classNames, styleElement] = css(props.css)

  delete props.css

  props.className = props.className
    ? `${props.className} ${classNames}`
    : classNames

  if (voidElements.has(type)) {
    props.key = type

    return [props, styleElement]
  }

  if (styleElement && props.children) {
    if (props.children.constructor === Array) {
      props.children = props.children.concat(styleElement)
    } else if (typeof props.children === 'string') {
      props.children = [props.children, styleElement]
    } else {
      props.children = [
        cloneElement(props.children, { key: 'rse' }),
        styleElement,
      ]
    }
  } else if (styleElement) {
    props.children = styleElement
  }

  return [props, null]
}
