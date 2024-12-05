import * as React from 'react'

export type CustomProperties = {
  [key in `--${string}`]?: string | number
}

export type CSSObject = React.CSSProperties & {
  [Key: string]: React.CSSProperties | CSSObject | string | number | undefined
}

export type CSSValue = CSSObject[keyof CSSObject]

export type CSSRule = [className: string, rule?: string]

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
