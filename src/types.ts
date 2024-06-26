type AtRules =
  | '@container'
  | '@layer'
  | '@media'
  | '@scope'
  | '@starting-style'
  | '@supports'
  | '@-moz-document'

type AtRuleString = `${AtRules} ${string}`

type Selectors = '&' | '#' | '.' | '[' | ':' | '::' | '>' | '+' | '~' | '*'

type HTMLTagNames = keyof JSX.IntrinsicElements

type SelectorString = `${Selectors}${string}`

type CustomProperties = {
  [key in `--${string}`]?: string | number
}

type CSSWithCustomProperties = React.CSSProperties & CustomProperties

export type Styles = CSSWithCustomProperties & {
  [Key in AtRuleString | SelectorString | HTMLTagNames]?:
    | CSSWithCustomProperties
    | Styles
}

export type StyleValue = Styles[keyof Styles]

type ClassNameMessage = 'Component must accept a className prop'

export type AcceptsClassName<T> = T extends keyof JSX.IntrinsicElements
  ? 'className' extends keyof JSX.IntrinsicElements[T]
    ? T
    : ClassNameMessage
  : T extends React.ComponentType<infer P>
    ? 'className' extends keyof P
      ? T
      : ClassNameMessage
    : ClassNameMessage

export type CSSResult = [
  string,
  [
    lowStyles: React.ReactElement,
    mediumStyles: React.ReactElement,
    highStyles: React.ReactElement | null,
    cache: React.ReactElement | null,
  ],
]

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
    [K in keyof JSX.IntrinsicElements]: React.JSX.IntrinsicElements[K] & {
      css?: Styles
    }
  }
}

declare global {
  var __RESTYLE_CACHE: Set<string> | undefined
}
