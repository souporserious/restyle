/**
 * CSS at-rules
 *
 * Note that this is for nestable at-rules
 * at-rules that are used for definitions, like @font-face, don't make sense in this context
 *
 * each rule is nested on itself if possible, or on an arbitrary element if not
 */

import { createSyntaxTest } from '../../createNestingTest.js'

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/@container
 */
createSyntaxTest({
  name: '@container at-rule',
  fails: true,
  css: {
    backgroundColor: 'red',
    containerType: 'inline-size',

    '@container (max-width: 500px)': {
      '@container (min-width: 400px)': {
        div: {
          backgroundColor: 'green',
        },
      },
      '@container (max-width: 400px)': {
        div: {
          backgroundColor: 'orange',
        },
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
  css: {
    'div.one': {
      backgroundColor: 'red',
      color: 'blue',
      '@layer one': { borderWidth: '10px' },
      '@layer two': { borderColor: 'magenta' },
      '@layer three': { padding: '10px' },
    },
    'div.two': {
      backgroundColor: 'orange',
      color: 'green',
      '@layer one': { borderWidth: '20px' },
      '@layer two': { borderColor: 'green' },
      '@layer three': { padding: '20px' },
    },
    'div.three': {
      backgroundColor: 'yellow',
      color: 'purple',
      '@layer one': { borderWidth: '30px' },
      '@layer two': { borderColor: 'purple' },
      '@layer three': { padding: '30px' },
    },
    border: '1px solid blue',
  },
  children: (
    <div>
      <div>@layer</div>
    </div>
  ),
  injectStyle: (css) => css`
    @layer two, three, one;
  `,
})

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/@media
 */
createSyntaxTest({
  name: '@media at-rule',
  fails: true,
  css: {
    '@media (max-width: 800px)': {
      backgroundColor: 'blue',
      color: 'orange',
      '@media (max-width: 400px)': {
        backgroundColor: 'green',
      },
      '@media (min-width: 400px)': {
        backgroundColor: 'purple',
      },
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

      '@scope (.start-two) to (.end-two)': {
        border: '10px solid green',
      },
    },
  },
  children: (This) => (
    <>
      <This />
      <div className="start">
        <This />
        <div className="start-two">
          <This />
          <div className="end-two">
            <This />
            <div className="end">
              <This>@scope</This>
            </div>
          </div>
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

    div: {
      height: 100,
      transition: 'all 1000s',
      border: '1px solid red',
      overflow: 'clip',
      '@starting-style': {
        height: 0,
      },
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
      '@supports (display: flex)': {
        border: '10px solid red',
      },
      '@supports (display: banana)': {
        backgroundColor: 'green',
      },
    },
    '@supports (skibidi: toilet)': {
      backgroundColor: 'green',
      '@supports (display: block)': {
        border: 'padding: 20px',
      },
      '@supports (display: banana)': {
        backgroundColor: 'yellow',
      },
    },
  },
  children: <div>@supports</div>,
})
