import * as React from 'react'

import { css } from './css.js'
import type {
  AcceptsClassName,
  CompatibleProps,
  CSSObject,
  MaybeAsyncFunctionComponent,
  RestrictToRecord,
  StyledOutput,
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
  Component: MaybeAsyncFunctionComponent<Props>,
  styles?:
    | CSSObject
    | ((
        // style props will be omitted from the props passed to the component
        // so we need to ensure that we won't break the type the component expects
        styleProps: CompatibleProps<
          NoInfer<Props>,
          // style props cannot extend from Record without unintended consequences
          // so we restrict them here instead
          RestrictToRecord<StyleProps>
        >,
        props: NoInfer<Props>
      ) => CSSObject)
): StyledOutput<
  Omit<Props, keyof StyleProps> & {
    css?: CSSObject
    className?: string
  } & StyleProps
>

export function styled<TagName extends keyof JSX.IntrinsicElements, StyleProps>(
  Component:
    | AcceptsClassName<TagName>
    | React.ComponentClass<{ className?: string }>,
  styles?:
    | CSSObject
    | ((
        styleProps: CompatibleProps<
          React.ComponentProps<TagName>,
          RestrictToRecord<StyleProps>
        >,
        props: React.ComponentProps<TagName>
      ) => CSSObject)
): StyledOutput<
  Omit<React.ComponentProps<TagName>, keyof StyleProps> & {
    css?: CSSObject
    className?: string
  } & StyleProps
>

export function styled(
  Component: string | MaybeAsyncFunctionComponent<unknown>,
  styles?: CSSObject | ((styleProps: unknown, props: unknown) => CSSObject)
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
      const styleProps = new Set<string>()

      parsedStyles = styles(
        new Proxy(props, {
          get(target, prop: string) {
            styleProps.add(prop)
            return target[prop as keyof typeof target]
          },
        }),
        props
      )

      // Filter out accessed style props so they are not forwarded to the component
      for (const prop of styleProps) {
        delete props[prop as keyof typeof props]
      }
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
