const ReactJSXRuntime = require('react/jsx-runtime')
const { createRestyleProps } = require('./create-restyle-props')

const Fragment = ReactJSXRuntime.Fragment

function jsx(type, props, key) {
  if (props.css) {
    return ReactJSXRuntime.jsx(type, createRestyleProps(props), key)
  }
  return ReactJSXRuntime.jsx(type, props, key)
}

function jsxs(type, props, key) {
  if (props.css) {
    return ReactJSXRuntime.jsxs(type, createRestyleProps(props), key)
  }
  return ReactJSXRuntime.jsxs(type, props, key)
}

module.exports = { Fragment, jsx, jsxs }
