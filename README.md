<div align="center">
  <p align="center">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="/example/public/logo-dark.png"/>
      <img src="/example/public/logo-light.png" alt="restyle" width="280"/>
    </picture>
  </p>
  <p>The simplest way to add CSS styles to your React components.</p>
</div>

- [Features](#features)
- [Installation](#installation)
- [How it Works](#how-it-works)
- [Examples](#examples)
  - [Basic Usage](#basic-usage)
  - [Box Component](#box-component)
  - [CSS Prop](#css-prop)
  - [Psuedoclasses](#psuedoclasses)
  - [Media Queries](#media-queries)
  - [Child Selectors](#child-selectors)

## Features

- Zero-runtime CSS in JS
- Generates atomic class names
- De-duplicates styles
- Works in Server and Client Components
- Encourages encapsulation
- Supports `css` prop with JSX pragma
- Loads styles on demand
- Allows shipping CSS in NPM packages
- [Core](./index.js) is `694` bytes minified and gzipped

[View Example](https://reactstyle.vercel.app/)

## Installation

```bash
npm install restyle
```

> [!IMPORTANT]
> This library requires a React Canary version since it utilizes the new [style hoisting feature](https://react.dev/reference/react-dom/components/style).

## How it Works

Restyle leverages the power of atomic CSS and on-demand CSS generation to provide a flexible and efficient styling solution for React components that works everywhere. Here's a high-level overview of how it operates:

1. **Styles Parsing**: Restyle takes a styles object of CSS and parses it, generating atomic class names for each unique style property and value pair:

```ts
import { css } from 'restyle'

const [classNames, styleElement] = css({
  padding: '1rem',
  backgroundColor: 'peachpuff',
})

// classNames: 'x1y2 x3z4'
// styleElement: <style>.x1y2{padding:1rem}.x3z4{background-color:peachpuff}</style>
```

2. **Class Names Generation**: Atomic class names are generated using a hashing function to ensure uniqueness and prevent collisions:

```ts
import { css } from 'restyle'

const [classNames] = css({
  padding: '1rem',
  backgroundColor: 'tomato',
})

// Example output: 'x1y2 xfg3'
```

3. **Style Deduplication**: Class names are cached per request, optimizing performance and reducing the overall size of the generated CSS:

```tsx
/** @jsxImportSource restyle */

export default function StyleDeduplication() {
  return (
    <div
      css={{
        padding: '0.5rem 1rem',
        backgroundColor: 'white',
        color: 'black',
        borderRadius: '4px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      }}
    >
      <h2>Card Title</h2>
      <p>This is a card with some reusable styles.</p>
      <button
        css={{
          padding: '0.5rem 1rem',
          backgroundColor: 'blue',
          color: 'white',
          borderRadius: '4px',
        }}
      >
        Click Me
      </button>
    </div>
  )
}

// Example output:
// .x1y2abc { padding: 0.5rem 1rem; }
// .x3z4def { background-color: blue; }
// .x5a6ghi { color: white; }
// .x7j8klm { border-radius: 4px; }
// .x1r2stu { background-color: white; }
// .x3v4wxy { color: black; }
// .x5z6abc { box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); }
```

4. **Atomic CSS**: By breaking down styles into atomic units, it allows for highly reusable class names, making it easy to manage and override styles while reducing the overall size of the CSS produced:

```ts
import { css } from 'restyle'

const styles = {
  padding: '1rem',
  backgroundColor: 'rebeccapurple',
}

const [classNames, styleElement] = css(styles)

// classNames: 'x1y2 x4z1'
// Reuse class names for other elements
const buttonStyles = {
  ...styles,
  border: '1px solid black',
}

const [buttonClassNames, buttonStyleElement] = css(buttonStyles)

// buttonClassNames: 'x1y2 x4z1 x5a6'
```

5. **On-Demand Style Injection**: Styles are only added to the DOM when the component or element is rendered:

```tsx
import { css } from 'restyle'

export default function OnDemandStyles() {
  const [classNames, styleElement] = css({
    padding: '1rem',
    backgroundColor: 'papayawhip',
  })

  return (
    <>
      <div className={classNames}>Hello World</div>
      {styleElement}
    </>
  )
}
```

6. **Integration with JSX Pragma**: It supports the `css` prop via the JSX pragma, allowing for inline styling directly within JSX elements.

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

## Examples

- [Basic Usage](#basic-usage)
- [Box Component](#box-component)
- [CSS Prop](#css-prop)
- [Psuedoclasses](#psuedoclasses)
- [Media Queries](#media-queries)
- [Child Selectors](#child-selectors)

### Basic Usage

```tsx
import React from 'react'
import { css } from 'restyle'

export default function BasicUsage() {
  const [classNames, styles] = css({
    padding: '1rem',
    backgroundColor: 'peachpuff',
  })

  return (
    <>
      {styles}
      <div className={classNames}>Hello World</div>
    </>
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
  const [classNames, styles] = css({
    display,
    alignItems,
    justifyContent,
    padding,
    backgroundColor,
  })
  return (
    <>
      <div className={classNames}>{children}</div>
      {styles}
    </>
  )
}
```

### CSS Prop

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

### Psuedoclasses

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

## Development

```bash
cd example
npm install
npm run dev
```
