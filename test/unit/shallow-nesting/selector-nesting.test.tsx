/**
 * CSS Nesting Selector
 * @see https://www.w3schools.com/cssref/css_selectors.php#:~:text=CSS%20Nesting%20Selector
 */

import { createNestingTest } from '../../createNestingTest.js'

createNestingTest({
  name: '& selectors',
  fails: {
    withAmpersandNoSpace: true,
    withAmpersandWithSpace: true,
  },
  css: {
    backgroundColor: 'red',
    '&': {
      backgroundColor: 'blue',
    },
  },
  children: (This) => (
    <This>
      <This>
        <This />
        <div></div>
      </This>
      <div></div>
    </This>
  ),
})
