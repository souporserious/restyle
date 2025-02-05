import * as React from 'react'

export type CustomProperties = {
  [key in `--${string}`]?: string | number
}

export type CSSObject = React.CSSProperties & {
  [Key: string]: React.CSSProperties | CSSObject | string | number | undefined
}

export type CSSValue = CSSObject[keyof CSSObject]

export type CSSRule = [className: string, rule?: string]

/**
 * using the built-in react types won't let us preserve generic component types
 */
export type SimpleFunctionComponent<P> = (props: P) => React.JSX.Element

type ClassNameMessage = 'Component must accept a className prop'

export type AcceptsClassName<T> = T extends keyof React.JSX.IntrinsicElements
  ? 'className' extends keyof React.JSX.IntrinsicElements[T]
    ? T
    : ClassNameMessage
  : T extends React.ComponentType<infer P>
    ? 'className' extends keyof P
      ? T
      : ClassNameMessage
    : ClassNameMessage

type IncompatiblePropsMessage =
  "Specified style props are incompatible with component props. Style props are filtered out of the component's props before being passed."

export type CompatibleProps<ComponentProps, StyleProps> =
  // check if style props is a wide type like Record<string, unknown>
  [string] extends [keyof StyleProps]
    ? // if the type is wide, a simple intersection works nicely
      StyleProps & ComponentProps
    : // for narrower types, we can omit properties for a stronger type
      Omit<ComponentProps, keyof StyleProps> extends ComponentProps
      ? StyleProps
      : IncompatiblePropsMessage

type RestrictToRecordMessage =
  'Style props must extend type `Record<string, unknown>`'

export type RestrictToRecord<T> =
  // our error message is assignable to string, so handle it separately
  T extends string
    ? Record<never, never>
    : T extends Record<string, unknown>
      ? T
      : RestrictToRecordMessage

export declare namespace RestyleJSX {
  export type Element = React.JSX.Element
  export type ElementType = React.JSX.ElementType
  export type ElementClass = React.JSX.ElementClass
  export type ElementAttributesProperty = React.JSX.ElementAttributesProperty
  export type ElementChildrenAttribute = React.JSX.ElementChildrenAttribute
  export type LibraryManagedAttributes<C, P> =
    React.JSX.LibraryManagedAttributes<C, P>
  export type IntrinsicAttributes = React.JSX.IntrinsicAttributes
  export type IntrinsicClassAttributes<T> =
    React.JSX.IntrinsicClassAttributes<T>
  export type IntrinsicElements = {
    [K in keyof React.JSX.IntrinsicElements]: React.JSX.IntrinsicElements[K] & {
      css?: CSSObject
    }
  }
}
