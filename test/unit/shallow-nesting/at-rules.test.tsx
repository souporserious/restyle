/**
 * CSS at-rules
 *
 * Note that this is for nestable at-rules
 * at-rules that are used for definitions, like @font-face, don't make sense in this context
 */

import { createSyntaxTest } from '../../createSyntaxTest.js'

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/@container
 */
createSyntaxTest({
  name: '@container at-rule',
  css: {
    backgroundColor: 'red',
    containerType: 'inline-size',

    '@container (max-width: 400px)': {
      div: {
        backgroundColor: 'blue',
      },
    },
  },
  children: <div>@container</div>,
})

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/@layer
 */
createSyntaxTest({
  name: '@layer at-rule',
  injectStyle: (css) => css`
    @layer module, state;
  `,
  css: {
    '@layer state': {
      '.alert': {
        backgroundColor: 'brown',
      },
      p: {
        border: 'medium solid limegreen',
      },
    },
    '@layer module': {
      '.alert': {
        border: 'medium solid violet',
        backgroundColor: 'yellow',
        color: 'white',
      },
    },
  },
  children: <p className="alert">@layer</p>,
})

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/@media
 */
createSyntaxTest({
  name: '@media at-rule',
  css: {
    '@media (min-width: 1000px)': {
      backgroundColor: 'blue',
    },
  },
  children: <div>@media</div>,
})

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/@scope
 */
createSyntaxTest({
  name: '@scope at-rule',
  fails: true,
  css: {
    '@scope (.start) to (.end)': {
      backgroundColor: 'blue',
    },
  },
  children: (This) => (
    <>
      <This />
      <div className="start">
        <This />
        <div className="end">
          <This>@scope</This>
        </div>
      </div>
    </>
  ),
})

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/@starting-style
 */
createSyntaxTest({
  name: '@starting-style at-rule',
  fails: true,
  css: {
    height: 100,
    transition: 'all 1000s',
    border: '1px solid red',
    overflow: 'clip',

    '@starting-style': {
      height: 0,
    },
  },
  children: <div>@starting-style</div>,
})

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/@supports
 */
createSyntaxTest({
  name: '@supports at-rule',
  css: {
    backgroundColor: 'red',
    '@supports (display: grid)': {
      backgroundColor: 'blue',
    },
    '@supports (skibidi: toilet)': {
      backgroundColor: 'green',
    },
  },
  children: <div>@supports</div>,
})
