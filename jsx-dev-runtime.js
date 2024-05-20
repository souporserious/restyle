const ReactJSXRuntimeDev = require('react/jsx-dev-runtime')
const { createRestyleProps } = require('./create-restyle-props')

const Fragment = ReactJSXRuntimeDev.Fragment

/**
 * Create a JSX element that accepts a `css` prop to generate atomic class names.
 * @param {React.ElementType} type
 * @param {object} props
 * @returns {JSX.Element}
 */
function jsxDEV(type, props, key, isStaticChildren, source, self) {
  if (props.css) {
    return ReactJSXRuntimeDev.jsxDEV(
      type,
      createRestyleProps(props),
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
