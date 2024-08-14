import * as React from 'react'
import ReactJSXRuntime from 'react/jsx-runtime'

import { createRestyleProps } from './create-restyle-props'

export type { RestyleJSX as JSX } from './types'

export const Fragment = ReactJSXRuntime.Fragment

export function jsx(
  type: React.ElementType,
  props: Record<string, any>,
  key: string
) {
  if (typeof type === 'string' && props.css) {
    const [parsedProps, Styles] = createRestyleProps(type, props)

    if (Styles) {
      return ReactJSXRuntime.jsx(
        Fragment,
        {
          children: [
            React.createElement(type, parsedProps),
            React.createElement(Styles),
          ],
        },
        key
      )
    }

    return ReactJSXRuntime.jsx(type, parsedProps, key)
  }

  return ReactJSXRuntime.jsx(type, props, key)
}

export function jsxs(type: any, props: Record<string, any>, key: string) {
  if (props.css) {
    const [parsedProps, Styles] = createRestyleProps(type, props)

    if (Styles) {
      return ReactJSXRuntime.jsxs(
        Fragment,
        {
          children: [
            React.createElement(type, parsedProps),
            React.createElement(Styles),
          ],
        },
        key
      )
    }

    return ReactJSXRuntime.jsxs(type, parsedProps, key)
  }

  return ReactJSXRuntime.jsxs(type, props, key)
}
