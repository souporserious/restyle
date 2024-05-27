const { css } = require('./index')

const voidElements = new Set(['br', 'embed', 'hr', 'img', 'input'])

/**
 * Create a `restyle` JSX props object that handles the `css` prop to generate atomic class names.
 * @param {any} type
 * @param {object} props
 * @returns {[object, React.ReactNode]}
 */
function createRestyleProps(type, props) {
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
    } else {
      props.children = [props.children, styleElement]
    }
  } else if (styleElement) {
    props.children = styleElement
  }

  return [props, null]
}

module.exports = { createRestyleProps }
