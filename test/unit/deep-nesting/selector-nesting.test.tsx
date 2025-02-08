/**
 * CSS Nesting Selector
 * @see https://www.w3schools.com/cssref/css_selectors.php#:~:text=CSS%20Nesting%20Selector
 */

import { createNestingTest } from '../../createNestingTest.js'

createNestingTest({
  name: 'deeply nesting & selectors with & (no space)',
  fails: {
    asPassed: true,
    withAmpersandNoSpace: true,
    withAmpersandWithSpace: true,
  },
  css: {
    backgroundColor: 'red',
    '&': {
      backgroundColor: 'blue',
      '&': {
        backgroundColor: 'green',
      },
    },
  },
  children: (This) => (
    <This>
      <This>
        <This>
          <This>
            <This></This>
            <div />
          </This>
          <div></div>
        </This>
        <div></div>
      </This>
      <div></div>
    </This>
  ),
})
