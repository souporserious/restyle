import * as React from 'react'
import ReactJSXRuntimeDev from 'react/jsx-dev-runtime'

import { createRestyleProps } from './create-restyle-props.js'

export const Fragment = ReactJSXRuntimeDev.Fragment

/** Create a JSX element that accepts a `css` prop to generate atomic class names. */
export function jsxDEV(
  type: React.ElementType,
  props: Record<string, any>,
  key: string,
  isStaticChildren: boolean,
  source: any,
  self: any
): React.JSX.Element {
  if (typeof type === 'string' && props.css) {
    const [parsedProps, Styles] = createRestyleProps(type, props)

    if (Styles) {
      return ReactJSXRuntimeDev.jsxDEV(
        Fragment,
        {
          children: [
            React.createElement(type, parsedProps),
            React.createElement(Styles, { key: 'rss' }),
          ],
        },
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
