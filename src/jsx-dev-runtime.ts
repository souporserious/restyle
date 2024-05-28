import * as React from 'react'
import ReactJSXRuntimeDev from 'react/jsx-dev-runtime'

import { createRestyleProps } from './create-restyle-props'

export const Fragment = ReactJSXRuntimeDev.Fragment

/** Create a JSX element that accepts a `css` prop to generate atomic class names. */
export function jsxDEV(
  type: any,
  props: Record<string, any>,
  key: string,
  isStaticChildren: boolean,
  source: any,
  self: any
): React.JSX.Element {
  if (props.css) {
    const [parsedProps, styleElement] = createRestyleProps(type, props)

    if (styleElement) {
      return ReactJSXRuntimeDev.jsxDEV(
        Fragment,
        { children: [React.createElement(type, parsedProps), styleElement] },
        key,
        isStaticChildren,
        source,
        self
      )
    }

    return ReactJSXRuntimeDev.jsxDEV(
      type,
      parsedProps,
      key,
      isStaticChildren,
      source,
      self
    )
  }

  return ReactJSXRuntimeDev.jsxDEV(
    type,
    props,
    key,
    isStaticChildren,
    source,
    self
  )
}
