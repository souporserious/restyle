const { css } = require('./index')

/**
 * Create a `restyle` JSX props object that handles the `css` prop to generate atomic class names.
 * @param {object} props
 * @returns {object}
 */
function createRestyleProps(props) {
  if (props.css) {
    const [classNames, styleElement] = css(props.css)

    delete props.css

    props.className = props.className
      ? `${props.className} ${classNames}`
      : classNames

    if (styleElement && props.children) {
      if (props.children.constructor === Array) {
        props.children = props.children.concat(styleElement)
      } else {
        props.children = [props.children, styleElement]
      }
    } else if (styleElement) {
      props.children = styleElement
    }
  }

  return props
}

module.exports = { createRestyleProps }
