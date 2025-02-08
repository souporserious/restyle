/**
 * CSS Attribute Selectors
 * @see https://www.w3schools.com/cssref/css_selectors.php#:~:text=CSS%20Attribute%20Selectors
 */

import { createNestingTest } from '../../createNestingTest.js'

createNestingTest({
  name: 'deeply nesting attribute selectors',
  fails: { withAmpersandWithSpace: true },
  css: {
    backgroundColor: 'red',

    '[lang]': {
      backgroundColor: 'green',

      '[title]': {
        backgroundColor: 'blue',
      },
    },
  },
  children: (
    <>
      <div lang="en">
        <div title="example" />
      </div>
      <div title="example" />
    </>
  ),
})

createNestingTest({
  name: 'deeply nesting attribute value selectors',
  fails: { withAmpersandWithSpace: true },
  css: {
    backgroundColor: 'red',

    '[lang="en"]': {
      backgroundColor: 'green',

      '[title="example"]': {
        backgroundColor: 'blue',
      },
    },
  },
  children: (
    <>
      <div lang="en">
        <div title="example" />
      </div>
      <div title="example" />
    </>
  ),
})

createNestingTest({
  name: 'deeply nesting attribute contains word selectors',
  fails: { withAmpersandWithSpace: true },
  css: {
    backgroundColor: 'red',

    '[lang~="en"]': {
      backgroundColor: 'green',

      '[title~="example"]': {
        backgroundColor: 'blue',
      },
    },
  },
  children: (
    <>
      <div lang="en">
        <div title="example" />
      </div>
      <div title="example" />
    </>
  ),
})

createNestingTest({
  name: 'deeply nesting attribute starts with value selectors',
  fails: { withAmpersandWithSpace: true },
  css: {
    backgroundColor: 'red',

    '[lang|="en"]': {
      backgroundColor: 'green',

      '[title|="example"]': {
        backgroundColor: 'blue',
      },
    },
  },
  children: (
    <>
      <div lang="en">
        <div title="example" />
      </div>
      <div title="example" />
    </>
  ),
})

createNestingTest({
  name: 'deeply nesting attribute begins with value selectors',
  fails: { withAmpersandWithSpace: true },
  css: {
    backgroundColor: 'red',

    '[lang^="en"]': {
      backgroundColor: 'green',

      '[title^="example"]': {
        backgroundColor: 'blue',
      },
    },
  },
  children: (
    <>
      <div lang="en">
        <div title="example" />
      </div>
      <div title="example" />
    </>
  ),
})

createNestingTest({
  name: 'deeply nesting attribute ends with value selectors',
  fails: { withAmpersandWithSpace: true },
  css: {
    backgroundColor: 'red',

    '[lang$="en"]': {
      backgroundColor: 'green',

      '[title$="example"]': {
        backgroundColor: 'blue',
      },
    },
  },
  children: (
    <>
      <div lang="en">
        <div title="example" />
      </div>
      <div title="example" />
    </>
  ),
})

createNestingTest({
  name: 'deeply nesting attribute contains value selectors',
  fails: { withAmpersandWithSpace: true },
  css: {
    backgroundColor: 'red',

    '[lang*="en"]': {
      backgroundColor: 'green',

      '[title*="example"]': {
        backgroundColor: 'blue',
      },
    },
  },
  children: (
    <>
      <div lang="en">
        <div title="example" />
      </div>
      <div title="example" />
    </>
  ),
})
