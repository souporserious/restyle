import * as React from 'react'

import { css } from './css.js'
import type {
  AcceptsClassName,
  CompatibleProps,
  CSSObject,
  RestrictToRecord,
  SimpleFunctionComponent,
} from './types.js'
import type { JSX } from './jsx-runtime.js'

/**
 * Creates a JSX component that forwards a `className` prop with the generated
 * atomic class names to the provided `Component`. Additionally, a `css` prop can
 * be provided to override the initial `styles`.
 *
 * Note, the provided component must accept a `className` prop.
 */
export function styled<Props extends { className?: string }, StyleProps>(
  Component: SimpleFunctionComponent<Props>,
  styles?:
    | CSSObject
    | ((
        // style props will be omitted from the props passed to the component
        // so we need to ensure that we won't break the type the component expects
        props: CompatibleProps<
          NoInfer<Props>,
          // style props cannot extend from Record without unintended consequences
          // so we restrict them here instead
          RestrictToRecord<StyleProps>
        >
      ) => CSSObject)
): SimpleFunctionComponent<
  Omit<Props, keyof StyleProps> & {
    css?: CSSObject
    className?: string
  } & StyleProps
>

// in order to preserve generic types, the signatures for function and intrinsic/class components must be entirely separate
// having any sort of union type for `Component` will break generic types
export function styled<TagName extends keyof JSX.IntrinsicElements, StyleProps>(
  Component:
    | AcceptsClassName<TagName>
    | React.ComponentClass<{ className?: string }>,
  styles?:
    | CSSObject
    | ((
        // see above
        props: CompatibleProps<
          React.ComponentProps<TagName>,
          // see above
          RestrictToRecord<StyleProps>
        >
      ) => CSSObject)
): SimpleFunctionComponent<
  Omit<React.ComponentProps<TagName>, keyof StyleProps> & {
    css?: CSSObject
    className?: string
  } & StyleProps
>

export function styled(
  Component: string | SimpleFunctionComponent<unknown>,
  styles?: CSSObject | ((props: unknown) => CSSObject)
) {
  return ({
    className: classNameProp,
    css: cssProp,
    ...props
  }: {
    className?: string
    css?: CSSObject
  }) => {
    let parsedStyles: CSSObject

    if (typeof styles === 'function') {
      const accessedProps = new Set<string>()
      const proxyProps = new Proxy(props, {
        get(target, prop: string) {
          accessedProps.add(prop)
          return target[prop as keyof typeof target]
        },
      })

      parsedStyles = styles(proxyProps)

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
