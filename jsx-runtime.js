const React = require('react')
const ReactJSXRuntime = require('react/jsx-runtime')
const { createRestyleProps } = require('./create-restyle-props')

const Fragment = ReactJSXRuntime.Fragment

function jsx(type, props, key) {
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

function jsxs(type, props, key) {
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

module.exports = { Fragment, jsx, jsxs }
