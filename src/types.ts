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
export type MaybeAsyncFunctionComponent<P> = (
  props: P
) => React.ReactNode | Promise<React.ReactNode>
export type StyledOutput<P> = (props: P) => React.JSX.Element

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

type FilteredRequiredPropErrorMessage<Keys extends PropertyKey> =
  `Error: Styles function filters prop(s) '${Extract<Keys, string>}' which are explicitly named in style props and required by the original component.`

/**
 * Omit over a union of types without merging them
 */
export type DistributiveOmit<T, K extends keyof any> = T extends any
  ? Omit<T, K>
  : never

/**
 * extract keys from T that are explicitly named
 * (excludes string/number index signatures)
 */
type KnownKeys<T> = keyof {
  [K in keyof T as string extends K
    ? never
    : number extends K
      ? never
      : K]: T[K]
}

/**
 * extract keys of required properties from T
 */
type RequiredKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? never : K
}[keyof T]

/**
 * check if any required component props overlap with ONLY the
 * style prop keys
 *
 * This ignores potential conflicts via index signatures
 * unless the key is also explicitly named in StyleProps
 */
type RequiredKnownKeyFiltered<CompProps, StyleProps> =
  Extract<RequiredKeys<CompProps>, KnownKeys<StyleProps>> extends never
    ? false // No required component prop conflicts with a KNOWN style prop key
    : true // A required component prop conflicts with a KNOWN style prop key

/**
 * Calculates the compatible props for a styled component considering runtime filtering
 */
export type CompatibleProps<ComponentProps, StyleProps> =
  StyleProps extends never
    ? ComponentProps
    : // check if any required ComponentProps conflict with explicitly named (Known) StyleProps keys
      RequiredKnownKeyFiltered<ComponentProps, StyleProps> extends true
      ? // if conflict with KNOWN keys, return error
        FilteredRequiredPropErrorMessage<
          Extract<RequiredKeys<ComponentProps>, KnownKeys<StyleProps>>
        >
      : // if NO conflict with KNOWN keys, calculate props:
        //   - start with ComponentProps
        //   - remove properties explicitly named in StyleProps
        //   - add all StyleProps (which includes potential index signatures)
        Omit<ComponentProps, KnownKeys<StyleProps>> & StyleProps

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
