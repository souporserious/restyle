/**
 * CSS Simple Selectors
 * @see https://www.w3schools.com/cssref/css_selectors.php#:~:text=CSS%20Simple%20Selectors
 */

import { createNestingTest } from '../../createNestingTest.js'

createNestingTest({
  name: 'deeply nesting element selectors',
  fails: { withAmpersandWithSpace: true },
  css: {
    backgroundColor: 'red',

    div: {
      backgroundColor: 'green',

      p: {
        backgroundColor: 'blue',
      },
    },
  },
  children: (
    <>
      <div>
        <p />
      </div>
      <p />
    </>
  ),
})

createNestingTest({
  name: 'deeply nesting id selectors',
  fails: { withAmpersandWithSpace: true },
  css: {
    backgroundColor: 'red',

    '#a': {
      backgroundColor: 'green',

      '#b': {
        backgroundColor: 'blue',
      },
    },
  },
  children: (Test) => (
    <>
      <Test id="a"></Test>
      <div id="a">
        <div id="b" />
      </div>
      <div id="b" />
    </>
  ),
})

createNestingTest({
  name: 'deeply nesting * selectors',
  fails: { withAmpersandWithSpace: true },
  css: {
    backgroundColor: 'red',

    '*': {
      backgroundColor: 'green',

      '*': {
        backgroundColor: 'blue',
      },
    },
  },
  children: (Test) => (
    <>
      <Test>
        <Test></Test>
      </Test>
      <div>
        <div>
          <div />
        </div>
      </div>
      <div>
        <div />
      </div>
    </>
  ),
})

createNestingTest({
  name: 'deeply nesting class selectors',
  fails: { withAmpersandWithSpace: true },
  css: {
    backgroundColor: 'red',

    '.name': {
      backgroundColor: 'green',

      '.name': {
        backgroundColor: 'blue',
      },
    },
  },
  children: (
    <>
      <div className="name">
        <div className="name" />
      </div>
      <div className="name" />
    </>
  ),
})
