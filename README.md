<div align="center">
  <p align="center">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="/site/public/logo-dark.png"/>
      <img src="/site/public/logo-light.png" alt="restyle" width="280"/>
    </picture>
  </p>
  <p>The simplest way to add CSS styles to your React components.</p>
  <p>No configuration required.</p>
  <p><a href="https://www.restyle.dev/">Visit Site</a> | <a href="https://codesandbox.io/p/sandbox/restyle-basic-usage-5v45lg?file=%2Fsrc%2FApp.tsx%3A12%2C11">Codesandbox Demo</a></p>
</div>

- [Features](#features)
- [Installation](#installation)
- [How it Works](#how-it-works)
- [Examples](#examples)
  - [Styled Function](#styled-function)
  - [Style Props](#style-props)
  - [CSS Function](#css-function)
  - [CSS Prop](#css-prop)
  - [Box Component](#box-component)
  - [Pseudo Selectors](#pseudo-selectors)
  - [Child Selectors](#child-selectors)
  - [Media Queries](#media-queries)
  - [Global Styles](#global-styles)
- [Acknowledgments](#acknowledgments)
- [Development](#development)

## Features

- Generates atomic class names
- Works in Server and Client Components
- Compatible with Suspense and streaming
- Deduplicates styles across environments
- Encourages encapsulation
- Supports `css` prop with JSX pragma
- Loads styles on demand
- Allows shipping CSS in NPM packages
- `1.5kb` minified and gzipped

## Installation

```bash
npm install restyle
```

```tsx
import { styled } from 'restyle'

export const Box = styled('div', {
  padding: '1rem',
  backgroundColor: 'peachpuff',
})
```

> [!IMPORTANT]
> This library requires a React Canary version since it utilizes the new [style hoisting feature](https://react.dev/reference/react-dom/components/style).

## How it Works

Restyle leverages React's new ability to [hoist `style` elements](https://react.dev/reference/react-dom/components/style#rendering-an-inline-css-stylesheet) by generating atomic CSS on-demand to provide a flexible and efficient styling solution for React components.

<details>
  <summary>Read more</summary>

Here's a high-level overview of how it works:

1. **Styles Parsing**: Restyle takes a styles object of CSS and parses it, generating atomic class names for each unique style property and value pair:

```ts
import { css } from 'restyle'

const [classNames, Styles] = css({
  padding: '1rem',
  backgroundColor: 'peachpuff',
})

// classNames: 'x1y2 x3z4'
// Styles: <style>.x1y2{padding:1rem}.x3z4{background-color:peachpuff}</style>
```

2. **Class Names Generation and Deduplication**: Atomic class names are generated using a hashing function to ensure uniqueness and prevent collisions. Class names are cached per request, optimizing performance and reducing the overall size of the generated CSS:

```ts
import { css } from 'restyle'

const [classNames] = css({
  padding: '1rem',
  backgroundColor: 'tomato',
})

// Example output: 'x1y2 xfg3'
```

3. **Atomic CSS**: By breaking down styles into atomic units, it allows for highly reusable class names, making it easy to manage and override styles while reducing the overall size of the CSS produced:

```ts
import { css } from 'restyle'

const styles = {
  padding: '1rem',
  backgroundColor: 'rebeccapurple',
}

const [classNames, Styles] = css(styles)

// classNames: 'x1y2 x4z1'
// Reuse class names for other elements
const buttonStyles = {
  ...styles,
  border: '1px solid black',
}

const [buttonClassNames, ButtonStyles] = css(buttonStyles)

// buttonClassNames: 'x1y2 x4z1 x5a6'
```

4. **On-Demand Style Injection**: Styles are only added to the DOM when the component or element is rendered:

```tsx
import { css } from 'restyle'

export default function OnDemandStyles() {
  const [classNames, Styles] = css({
    padding: '1rem',
    backgroundColor: 'papayawhip',
  })

  return (
    <div className={classNames}>
      Hello World
      <Styles />
    </div>
  )
}
```

5. **Integration with JSX Pragma**: Easily add support for the `css` prop via the JSX pragma, allowing colocated inline CSS styles directly on JSX elements.

```tsx
/** @jsxImportSource restyle */

export default function MyComponent() {
  return (
    <div
      css={{
        padding: '1rem',
        backgroundColor: 'peachpuff',
      }}
    >
      Hello World
    </div>
  )
}
```

</details>

## Examples

- [Styled Function](#styled-function)
- [Style Props](#style-props)
- [CSS Function](#css-function)
- [CSS Prop](#css-prop)
- [Box Component](#box-component)
- [Pseudo Selectors](#pseudo-selectors)
- [Child Selectors](#child-selectors)
- [Media Queries](#media-queries)
- [Global Styles](#global-styles)

### Styled Function

The `styled` function is a higher-order function that takes an HTML element tag name or a component that accepts a `className` prop and a initial styles object that returns a styled component that can accept a `css` prop:

```tsx
import Link from 'next/link'
import { styled } from 'restyle'

const StyledLink = styled(Link, {
  color: 'rebeccapurple',
  textDecoration: 'none',
})
```

### Style Props

The second argument to the `styled` function also accepts a function that returns a styles object based on the props passed to the component:

```tsx
import { styled } from 'restyle'

type GridProps = {
  gridTemplateColumns: string
}

const Grid = styled('div', (props: GridProps) => ({
  display: 'grid',
  gridTemplateColumns: props.gridTemplateColumns,
}))
```

Now you can use these props to style the component:

```tsx
<Grid gridTemplateColumns="repeat(3, 1fr)">
  <div>1</div>
  <div>2</div>
  <div>3</div>
</Grid>
```

> [!IMPORTANT]
> A proxy is used to differentiate between style props and those passed directly to the component. Therefore, only style props should be accessed within the function to ensure proper filtering.

### CSS Function

The `css` function returns a tuple of class names and the style tags to render. You can use the class names to apply styles to an element and the style tag to inject the styles into the head of the document:

```tsx
import React from 'react'
import { css } from 'restyle'

export default function BasicUsage() {
  const [classNames, Styles] = css({
    padding: '1rem',
    backgroundColor: 'peachpuff',
  })

  return (
    <>
      <div className={classNames}>Hello World</div>
      <Styles />
    </>
  )
}
```

### CSS Prop

The `css` function is most useful for components. However, you can use the `css` prop to style elements directly. The pragma will take care of applying the class names and injecting the style tag.

First, configure the pragma in your `tsconfig.json` file:

```json
{
  "compilerOptions": {
    "jsxImportSource": "restyle"
  }
}
```

Now, you can use the `css` prop to style elements:

```tsx
export default function CSSProp() {
  return (
    <div
      css={{
        padding: '1rem',
        backgroundColor: 'peachpuff',
      }}
    >
      Hello World
    </div>
  )
}
```

Alternatively, you can set the pragma at the top of the file:

```tsx
/** @jsxImportSource restyle */

export default function CSSProp() {
  return (
    <div
      css={{
        padding: '1rem',
        backgroundColor: 'peachpuff',
      }}
    >
      Hello World
    </div>
  )
}
```

### Box Component

```tsx
import React from 'react'
import { css } from 'restyle'

export function Box({
  children,
  display = 'flex',
  alignItems,
  justifyContent,
  padding,
  backgroundColor,
}) {
  const [classNames, Styles] = css({
    display,
    alignItems,
    justifyContent,
    padding,
    backgroundColor,
  })
  return (
    <div className={classNames}>
      {children}
      <Styles />
    </div>
  )
}
```

### Pseudo Selectors

```tsx
/** @jsxImportSource restyle */

export default function Hover() {
  return (
    <div
      css={{
        ':hover': {
          opacity: 0.8,
        },
      }}
    >
      Hover me
    </div>
  )
}
```

### Child Selectors

```tsx
/** @jsxImportSource restyle */

export default function ChildSelectors() {
  return (
    <div
      css={{
        color: 'black',
        '> a': {
          color: 'tomato',
        },
      }}
    >
      Parent
      <a href="#">Link</a>
    </div>
  )
}
```

### Media Queries

```tsx
/** @jsxImportSource restyle */

export default function MediaQueries() {
  return (
    <h1
      css={{
        fontSize: '2rem',
        '@media screen and (min-width: 40em)': {
          fontSize: '3.5rem',
        },
      }}
    >
      Resize the window
    </h1>
  )
}
```

An additional `media` utility is available to help with creating typed media query keys from objects:

```tsx
/** @jsxImportSource restyle */
import { media } from 'restyle'

export default function MediaQueries() {
  return (
    <h1
      css={{
        fontSize: '2rem',
        [media({ screen: true, minWidth: '40em' })]: {
          fontSize: '3.5rem',
        },
      }}
    >
      Resize the window
    </h1>
  )
}
```

### Global Styles

Use the `GlobalStyles` component to inject global styles into the document. This is useful for setting default styles for the body, headings, etc. This component accepts an object of styles and injects them into the head of the document based on their order in the object as well as when they are rendered in the react tree. **Note, Styles may not be removed when the component is unmounted. React makes no guarantees about when styles are removed from the document.**

```tsx
import { GlobalStyles } from 'restyle'

export default function Page() {
  return (
    <GlobalStyles>
      {{
        body: {
          margin: 0,
          padding: 0,
          fontFamily: 'sans-serif',
        },
      }}
    </GlobalStyles>
  )
}
```

## Acknowledgments

This project is inspired by and builds upon the ideas and work of several other projects in the CSS-in-JS ecosystem:

- The React team for the [style hoisting feature](https://react.dev/reference/react-dom/components/style#rendering-an-inline-css-stylesheet) which makes this library possible
- [Glamor](https://github.com/threepointone/glamor) for introducing the `css` prop
- [Styled-Components](https://styled-components.com/) for introducing the `styled` function
- [Emotion](https://emotion.sh/docs/introduction) for types and the modern JSX pragma
- [CXS](https://github.com/jxnblk/cxs) for atomic CSS generation
- [Fela](https://fela.js.org/) for their approach to deterministic atomic class name ordering
- [Otion](https://github.com/kripod/otion) for the regex to parse unitless CSS properties

Thank you to [WebReflection](https://github.com/WebReflection) for the `restyle` NPM package name.

## Development

In one terminal, run the following command to build the library and watch for changes:

```bash
npm install
npm run dev
```

In another terminal, run the following command to start the development server for the site:

```bash
cd site
npm install
npm run dev
```
