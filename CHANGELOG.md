# restyle

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
