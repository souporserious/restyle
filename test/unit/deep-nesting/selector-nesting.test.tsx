/**
 * CSS Nesting Selector
 * @see https://www.w3schools.com/cssref/css_selectors.php#:~:text=CSS%20Nesting%20Selector
 */

import { styled } from '../../../src/styled.js'
import { createUnitTest } from '../../createUnitTest.js'

const css = String.raw

const Basic = styled('div', {
  color: 'red',
  '&': {
    color: 'blue',
    '&': {
      color: 'green',
    },
  },
})
createUnitTest({
  name: 'deeply nesting & selectors',
  test: (
    <Basic>
      <Basic>
        <Basic />
      </Basic>
    </Basic>
  ),
  expect: (
    <div className="a">
      <div className="a">
        <div className="a" />
      </div>
    </div>
  ),
  css: css`
    .a {
      color: red;
      & {
        color: blue;
        & {
          color: green;
        }
      }
    }
  `,
})
