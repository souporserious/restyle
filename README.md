<div align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="/example/app/logo-dark.png"/>
    <img src="/example/app/logo-light.png" alt="restyle" width="280"/>
  </picture>
  <br />
  <p>The simplest way to add CSS styles to your React components.</p>
</div>

## Features

- Generates atomic class names
- De-duplicates styles
- Loads styles on demand
- Zero configuration
- Works in NPM packages
- `731` bytes minified and gzipped

[View Example](https://reactstyle.vercel.app/)

## Installation

```bash
npm install restyle
```

> [!IMPORTANT]
> This library requires React 19 since it utilizes the new [style hoisting feature](https://react.dev/reference/react-dom/components/style).

## Examples

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

### Psuedoclasses

```tsx
import React from 'react'
import { css } from 'restyle'

export default function Hover() {
  const [classNames, styles] = css({
    ':hover': {
      opacity: 0.8,
    },
  })

  return (
    <>
      {styles}
      <div className={classNames}>Hover me</div>
    </>
  )
}
```

### Media Queries

```tsx
import React from 'react'
import { css } from 'restyle'

export default function MediaQueries() {
  const [classNames, styles] = css({
    fontSize: '2rem',
    '@media screen and (min-width: 40em)': {
      fontSize: '3.5rem',
    },
  })

  return (
    <>
      {styles}
      <h1 className={classNames}>Resize the window</h1>
    </>
  )
}
```

### Child Selectors

```tsx
import React from 'react'
import { css } from 'restyle'

export default function ChildSelectors() {
  const [classNames, styles] = css({
    color: 'black',
    '> a': {
      color: 'tomato',
    },
  })

  return (
    <>
      {styles}
      <div className={classNames}>
        Parent
        <a href="#">Link</a>
      </div>
    </>
  )
}
```

## Development

```bash
cd example
npm install
npm run dev
```
