import * as React from 'react'

import { css } from './css'
import type { AcceptsClassName, CSSObject } from './types'

/**
 * Creates a JSX component that forwards a `className` prop with the generated
 * atomic class names to the provided `Component`. Additionally, a `css` prop can
 * be provided to override the initial `styles`.
 *
 * Note, the provided component must accept a `className` prop.
 */
export function styled<
  ComponentType extends React.ElementType,
  StyleProps extends Record<string, unknown>,
>(
  Component: AcceptsClassName<ComponentType>,
  styles?: CSSObject | ((props: StyleProps) => CSSObject)
) {
  return ({
    className: classNameProp,
    css: cssProp,
    ...props
  }: React.ComponentProps<ComponentType> &
    StyleProps & {
      className?: string
      css?: CSSObject
    }) => {
    let parsedStyles: CSSObject

    if (typeof styles === 'function') {
      const accessedProps = new Set<keyof StyleProps>()
      const proxyProps = new Proxy(props as unknown as StyleProps, {
        get(target, prop: string) {
          accessedProps.add(prop)
          return target[prop]
        },
      })

      parsedStyles = styles(proxyProps)

      // Filter out accessed props from the original props
      accessedProps.forEach((prop) => {
        delete (props as unknown as StyleProps)[prop]
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
