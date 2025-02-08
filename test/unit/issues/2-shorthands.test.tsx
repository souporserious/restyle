import { styled } from '../../../src/styled.js'
import { createUnitTest } from '../../createUnitTest.js'

createUnitTest({
  name: 'resolve shorthand and longhand rules deterministically',
  test: styled('div', {
    // low - medium - high
    borderBottomColor: 'blue', // high
    borderBottom: '2px solid green', // medium
    border: '1px solid red', // low
  }),
  expect: <div className="a" />,
  css: (css) => css`
    .a {
      border: 1px solid red;
      border-bottom: 2px solid green;
      border-bottom-color: blue;
    }
  `,
})
