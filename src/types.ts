export type Styles = React.CSSProperties | { [key: string]: Styles }

export type Style = Styles[keyof Styles]

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
