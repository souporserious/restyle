const React = require('react')
const ReactJSXRuntimeDev = require('react/jsx-dev-runtime')
const { createRestyleProps } = require('./create-restyle-props')

const Fragment = ReactJSXRuntimeDev.Fragment

/**
 * Create a JSX element that accepts a `css` prop to generate atomic class names.
 * @param {any} type
 * @param {object} props
 * @returns {JSX.Element}
 */
function jsxDEV(type, props, key, isStaticChildren, source, self) {
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

module.exports = { Fragment, jsxDEV }
