import * as React from 'react'

type ShorthandProps =
  | 'margin'
  | 'padding'
  | 'border'
  | 'borderWidth'
  | 'borderStyle'
  | 'borderColor'
  | 'borderRadius'
  | 'borderTop'
  | 'borderRight'
  | 'borderBottom'
  | 'borderLeft'
  | 'background'
  | 'backgroundPosition'
  | 'backgroundSize'
  | 'backgroundRepeat'
  | 'backgroundAttachment'
  | 'backgroundOrigin'
  | 'backgroundClip'
  | 'font'
  | 'listStyle'
  | 'transition'
  | 'animation'
  | 'flex'
  | 'flexFlow'
  | 'grid'
  | 'gridTemplate'
  | 'gridArea'
  | 'gridRow'
  | 'gridColumn'
  | 'gridGap'
  | 'columns'
  | 'columnRule'
  | 'outline'
  | 'overflow'
  | 'placeContent'
  | 'placeItems'
  | 'placeSelf'
  | 'textDecoration'

export type Styles =
  | Omit<React.CSSProperties, ShorthandProps>
  | { [key: string]: Styles }

export type Style = Styles[keyof Styles]

/**
 * Generate CSS from an object of styles and returns atomic class names and a style element.
 * @param styles - The styles to generate CSS from.
 * @param nonce - The nonce for the style element.
 * @returns A tuple containing the class names and the JSX style element.
 */
export function css(
  styles: Styles,
  nonce?: string
): [string, React.JSX.Element | null]

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
