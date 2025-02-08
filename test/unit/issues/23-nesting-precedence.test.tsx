/**
 * tests related to https://github.com/souporserious/restyle/issues/23
 */

import { styled } from '../../../src/styled.js'
import { createUnitTest } from '../../createUnitTest.js'

const A = styled('div', {
  color: 'green',
  '@media (max-width: 1000px)': {
    color: 'yellow',
  },
})

const B = styled('div', {
  color: 'orange',
  '@media (max-width: 1000px)': {
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
      <div className="b" />
    </>
  ),
  css: (css) => css`
    .a {
      color: green;
      @media (max-width: 1000px) {
        color: yellow;
      }
    }
    .b {
      color: orange;
      @media (max-width: 1000px) {
        color: yellow;
      }
    }
  `,
})

createUnitTest({
  name: 'deeper styles have higher precedence regardless of order',
  test: styled('div', {
    '@media (max-width: 1000px)': {
      '@media (max-width: 1000px)': {
        color: 'green',
        '@media (max-width: 1000px)': {
          color: 'red',
        },
      },
      color: 'blue',
    },
    color: 'yellow',
  }),
  expect: <div className="a" />,
  css: (css) => css`
    .a {
      color: yellow;
      @media (max-width: 1000px) {
        color: red;
      }
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
  css: (css) => css`
    .a {
      color: orange;
    }
  `,
})

createUnitTest({
  name: '& can be used to increase precedence deeply',
  fails: true,
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
  css: (css) => css`
    .a {
      color: blue;
    }
  `,
})
