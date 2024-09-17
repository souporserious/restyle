# restyle

## 2.3.0

- Adds a `media` utility to help with creating media query keys from objects.

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
