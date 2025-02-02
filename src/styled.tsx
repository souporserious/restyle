import * as React from 'react'

import { css } from './css.js'
import type {
  AcceptsClassName,
  CompatibleProps,
  CSSObject,
  RestrictToRecord,
} from './types.js'
import type { JSX } from './jsx-runtime.js'

/**
 * Creates a JSX component that forwards a `className` prop with the generated
 * atomic class names to the provided `Component`. Additionally, a `css` prop can
 * be provided to override the initial `styles`.
 *
 * Note, the provided component must accept a `className` prop.
 */
export function styled<ComponentType extends React.ElementType, StyleProps>(
  Component: AcceptsClassName<ComponentType>,
  styles?:
    | CSSObject
    | ((
        // style props will be omitted from the props passed to the component
        // so we need to ensure that we won't break the type the component expects
        props: CompatibleProps<
          ComponentType,
          // style props cannot be extend from Record without unintended consequences
          // so we restrict them here instead
          RestrictToRecord<StyleProps>
        >
      ) => CSSObject)
): (
  props: Omit<React.ComponentProps<ComponentType>, keyof StyleProps> &
    StyleProps & {
      className?: string
      css?: CSSObject
    }
) => JSX.Element {
  return ({ className: classNameProp, css: cssProp, ...props }) => {
    let parsedStyles: CSSObject

    if (typeof styles === 'function') {
      const accessedProps = new Set<string>()
      const proxyProps = new Proxy(props, {
        get(target, prop: string) {
          accessedProps.add(prop)
          return target[prop as keyof typeof target]
        },
      })

      parsedStyles = styles(
        proxyProps as CompatibleProps<
          ComponentType,
          RestrictToRecord<StyleProps>
        >
      )

      // Filter out accessed props from the original props
      accessedProps.forEach((prop) => {
        delete props[prop as keyof typeof props]
      })
    } else {
      parsedStyles = styles || {}
    }

    const [classNames, Styles] = css({
      ...parsedStyles,
      ...cssProp,
    })
    const className = classNameProp
      ? classNameProp + ' ' + classNames
      : classNames

    return (
      <>
        {/* @ts-expect-error */}
        <Component className={className} {...props} />
        <Styles />
      </>
    )
  }
}
