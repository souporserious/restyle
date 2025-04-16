import * as React from 'react'

export type CustomProperties = {
  [key in `--${string}`]?: string | number
}

export type CSSObject = React.CSSProperties & {
  [Key: string]: React.CSSProperties | CSSObject | string | number | undefined
}

export type CSSValue = CSSObject[keyof CSSObject]

export type CSSRule = [className: string, rule?: string]

export type CSSRulePrecedences = [
  CSSRule[],
  CSSRule[],
  CSSRule[],
  CSSRulePrecedences[],
]

export type FunctionComponent<Props> = (
  props: Props
) => React.ReactNode | Promise<React.ReactNode>

export type StyleResolver<StyleProps extends object, Props extends object> = (
  styleProps: StyleProps,
  props: DistributiveOmit<Props, keyof StyleProps>
) => CSSObject

export type StyledComponent<Props> = (
  props: Props & {
    css?: CSSObject
    className?: string
  }
) => React.JSX.Element

type ClassNameMessage = 'Component must accept a className prop'

export type AcceptsClassName<Type> =
  Type extends keyof React.JSX.IntrinsicElements
    ? 'className' extends keyof React.JSX.IntrinsicElements[Type]
      ? Type
      : ClassNameMessage
    : Type extends React.ComponentType<infer Props>
      ? 'className' extends keyof Props
        ? Type
        : ClassNameMessage
      : ClassNameMessage

export type DistributiveOmit<Type, Keys extends keyof any> = Type extends any
  ? Omit<Type, Keys>
  : never

export declare namespace RestyleJSX {
  export type Element = React.JSX.Element
  export type ElementType = React.JSX.ElementType
  export type ElementClass = React.JSX.ElementClass
  export type ElementAttributesProperty = React.JSX.ElementAttributesProperty
  export type ElementChildrenAttribute = React.JSX.ElementChildrenAttribute
  export type LibraryManagedAttributes<Component, Props> =
    React.JSX.LibraryManagedAttributes<Component, Props>
  export type IntrinsicAttributes = React.JSX.IntrinsicAttributes
  export type IntrinsicClassAttributes<Type> =
    React.JSX.IntrinsicClassAttributes<Type>
  export type IntrinsicElements = {
    [Key in keyof React.JSX.IntrinsicElements]: React.JSX.IntrinsicElements[Key] & {
      css?: CSSObject
    }
  }
}
