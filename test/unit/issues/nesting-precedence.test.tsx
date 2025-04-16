/**
 * tests related to https://github.com/souporserious/restyle/issues/23
 */

import { styled } from '../../../src/styled.js'
import { createUnitTest } from '../../createUnitTest.js'

const css = String.raw

const A = styled('div', {
  color: 'green',
  '@media (max-width: 9999px)': {
    color: 'yellow',
  },
})

const B = styled('div', {
  color: 'orange',
  '@media (max-width: 9999px)': {
    color: 'yellow',
  },
})

createUnitTest({
  name: 'media breakpoints that reuse styles are applied',
  test: (
    <>
      <A />
      <B />
    </>
  ),
  expect: (
    <>
      <div className="a" />
      <div className="a" />
    </>
  ),
  css: css`
    .a {
      color: yellow;
    }
  `,
})

createUnitTest({
  name: 'deeper styles have higher precedence regardless of order',
  test: styled('div', {
    '@media (max-width: 9999px)': {
      '@media (max-width: 9999px)': {
        '@media (max-width: 9999px)': {
          color: 'red',
        },
        color: 'green',
      },
      color: 'blue',
    },
    color: 'yellow',
  }),
  expect: <div className="a" />,
  css: css`
    .a {
      color: red;
    }
  `,
})

createUnitTest({
  name: '& can be used to increase precedence',
  test: styled('div', {
    '&': {
      color: 'orange',
    },
    color: 'red',
  }),
  expect: <div className="a" />,
  css: css`
    .a {
      color: orange;
    }
  `,
})

createUnitTest({
  name: '& can be used to increase precedence deeply',
  test: styled('div', {
    '&': {
      '&': {
        color: 'blue',
      },
      color: 'orange',
    },
    color: 'red',
  }),
  expect: <div className="a" />,
  css: css`
    .a {
      color: blue;
    }
  `,
})
