import * as React from 'react'

export type Styles = React.CSSProperties | { [key: string]: Styles }

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

declare module 'react' {
  interface Attributes {
    css?: Styles
  }
}
