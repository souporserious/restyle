/**
 * CSS Simple Selectors
 * @see https://www.w3schools.com/cssref/css_selectors.php#:~:text=CSS%20Simple%20Selectors
 */

import { createNestingTest } from '../../createNestingTest.js'

createNestingTest({
  name: 'element selectors',
  children: <div />,
  css: {
    backgroundColor: 'red',

    div: {
      backgroundColor: 'blue',
    },
  },
})

createNestingTest({
  name: 'id selectors',
  children: <div id="a" />,
  css: {
    backgroundColor: 'red',

    '#a': {
      backgroundColor: 'blue',
    },
  },
})

createNestingTest({
  name: '* selectors',
  children: <div />,
  css: {
    backgroundColor: 'red',
    '*': {
      backgroundColor: 'blue',
    },
  },
})

createNestingTest({
  name: 'class selectors',
  children: (This) => (
    <>
      <This>
        <div className="name" />
      </This>
      <This className="name" />
    </>
  ),
  css: {
    backgroundColor: 'red',

    '.name': {
      backgroundColor: 'blue',
    },
  },
})
