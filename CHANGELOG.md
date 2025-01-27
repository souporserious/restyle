# restyle

## 3.1.2

- Fixes `Cannot read properties of null` error when rendering `null` children in the pragma

## 3.1.1

- Fixes regression when validating children in the pragma that caused an infinite loop
- Adds `area` and `col` void HTML elements in pragma

## 3.1.0

- **Remove `media` Return Type Casting (#18)**
  Improves the return type of the media helper function and removes unnecessary type casts.

- **Depth-Based Precedence (#24)**
  Introduces a depth-based precedence system that gives higher precedence to deeper nested styles (e.g., media queries) over shallower styles. This approach fixes property order determining precedence and ensures that media query styles are applied correctly.

  ```js
  const A = styled('div', {
    '@media (max-width: 600px)': {
      background: 'yellow',
    },
    background: 'green',
  })
  ```

- **Add `<textarea>` to Void Elements (#25)**
  Corrects an issue where `<textarea>` was treated incorrectly, resulting in errors when applying styles.

- **Fix Children Selector Issue (#27)**
  Fixes an issue where the selector for children elements was incorrectly concatenated without a space. Now, selectors for children are properly separated unless they are pseudo-selectors:

  ```tsx
  <div css={{ input: { backgroundColor: 'red' } }}>
    <input defaultValue="" type="text" />
  </div>
  ```

- **Fix React-Children Validation (#28)**  
   Resolves an issue where falsy children (e.g., `0`) were omitted and not rendered.

- **Support Importing from ESM (#29)**  
  Adds support for importing Restyle in ESM environments.

## 3.0.0

- Updates peer dependencies to React 19.
- Fixes types to use `React.JSX` instead of bare `JSX` for compatibility with React 19.

## 2.4.0

- Adds a `keyframes` utility to help with creating keyframes for animations.

## 2.3.1

- Simplifies `CSSObject` type to `string` since strongly typed object keys aren't reliable.

## 2.3.0

- Adds a `media` utility to help with creating media query keys from objects.
- Adds a `GlobalStyles` component to help with rendering global object styles.

## 2.2.1

- Fixes incorrectly interpreting unitless values as pixel values

## 2.2.0

- Fixes deduplication of styles by rendering style elements for each CSS rule

## 2.1.1

- Fix key warning for void elements
- Use for loop to concatenate class names for better performance
- Only call layout effect until initial styles set

## 2.1.0

- Moves all style rendering to a client component to ensure a consistent cache

## 2.0.4

- Implement shared cache between server and client
- Always render server style elements for correct precedence ordering

## 2.0.3

- Move back to `children` instead of `dangerouslySetInnerHTML` for style elements, see https://github.com/facebook/react/issues/30738 for more information.

## 2.0.2

### Patch Changes

- Add `jsx-runtime` and `jsx-dev-runtime` to `files` field in package.json

## 2.0.1

### Patch Changes

- Add specific `jsx-runtime` and `jsx-dev-runtime` packages

## 2.0.0

### Breaking Changes

- The `css` utility function now returns a component for styles instead of an array of style elements:

```diff
import { css } from 'restyle';

function App() {
-   const [classNames, stylesElements] = css({ color: 'tomato' });
-   return <div className={classNames}>Hello World {stylesElements}</div>
+   const [classNames, Styles] = css({ color: 'tomato' });
+   return <div className={classNames}>Hello World <Styles /></div>
}
```

### Minor Changes

- The `css` and `styled` utilities can be imported separately now using `restyle/css` and `restyle/styled` respectively.

### Patch Changes

- Style elements now use `dangerouslySetInnerHTML` instead of `children` to properly escape CSS styles.
- Initial style elements for precedence ordering are only rendered the first time they are encountered in the tree instead of every time the component is rendered.
- Serialized data has been reduced to minimal size for better performance.
- Styles are now deduplicated on the client if they were not able to be deduplicated during server and client rendering.
