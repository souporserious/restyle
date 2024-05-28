import * as React from 'react'
import ReactJSXRuntime from 'react/jsx-runtime'

import { createRestyleProps } from './create-restyle-props'

export type { RestyleJSX as JSX } from './types'

export const Fragment = ReactJSXRuntime.Fragment

export function jsx(type: any, props: Record<string, any>, key: string) {
  if (props.css) {
    const [parsedProps, styleElement] = createRestyleProps(type, props)

    if (styleElement) {
      return ReactJSXRuntime.jsx(
        Fragment,
        { children: [React.createElement(type, parsedProps), styleElement] },
        key
      )
    }

    return ReactJSXRuntime.jsx(type, parsedProps, key)
  }

  return ReactJSXRuntime.jsx(type, props, key)
}

export function jsxs(type: any, props: Record<string, any>, key: string) {
  if (props.css) {
    const [parsedProps, styleElement] = createRestyleProps(type, props)

    if (styleElement) {
      return ReactJSXRuntime.jsxs(
        Fragment,
        { children: [React.createElement(type, parsedProps), styleElement] },
        key
      )
    }

    return ReactJSXRuntime.jsxs(type, parsedProps, key)
  }

  return ReactJSXRuntime.jsxs(type, props, key)
}
