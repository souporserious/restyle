import { styled } from '../../src/styled.js'
import { createUnitTest } from '../createUnitTest.js'

createUnitTest({
  name: 'basic style is applied correctly',
  test: styled('div', { color: 'red' }),
  expect: <div className="a"></div>,
  css: (css) => css`
    .a {
      color: red;
    }
  `,
})

const Red = styled('div', {
  color: 'red',
})
const Green = styled('div', {
  color: 'green',
})

createUnitTest({
  name: 'nested styles are applied correctly',
  test: (
    <Red>
      <Green />
    </Red>
  ),
  expect: (
    <div className="a">
      <div className="b"></div>
    </div>
  ),
  css: (css) => css`
    .a {
      color: red;
    }
    .b {
      color: green;
    }
  `,
})
