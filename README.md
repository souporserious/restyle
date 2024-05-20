<div align="center">
  <p align="center">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="/example/public/logo-dark.png"/>
      <img src="/example/public/logo-light.png" alt="restyle" width="280"/>
    </picture>
  </p>
  <p>The simplest way to add CSS styles to your React components.</p>
</div>

## Features

- Zero-runtime CSS in JS
- Generates atomic class names
- De-duplicates styles
- Works in Server and Client Components
- Encourages encapsulation
- Supports `css` prop with JSX pragma
- Loads styles on demand
- Allows shipping CSS in NPM packages
- Core is `694` bytes minified and gzipped

[View Example](https://reactstyle.vercel.app/)

## Installation

```bash
npm install restyle
```

> [!IMPORTANT]
> This library requires React 19 since it utilizes the new [style hoisting feature](https://react.dev/reference/react-dom/components/style) in React.

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
