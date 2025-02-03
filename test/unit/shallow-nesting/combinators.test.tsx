/**
 * CSS Combinators
 * @see https://www.w3schools.com/cssref/css_ref_combinators.php
 *
 * TODO test namespace separators
 */

import { styled } from '../../../src/styled.js'
import { createUnitTest } from '../../createUnitTest.js'

const Box = styled('div')

createUnitTest({
  name: 'child combinator',
  test: styled('div', {
    color: 'red',

    '> p': {
      color: 'blue',
    },
  })({
    children: (
      <>
        <p />
        <div>
          <p />
        </div>
      </>
    ),
  }),
  expect: (
    <div className="a">
      <p />
      <div>
        <p />
      </div>
    </div>
  ),
  css: (css) => css`
    .a {
      color: red;
      > p {
        color: blue;
      }
    }
  `,
})

createUnitTest({
  name: 'child combinator with &',
  test: styled('div', {
    color: 'red',

    '& > p': {
      color: 'blue',
    },
  })({
    children: (
      <>
        <p />
        <div>
          <p />
        </div>
      </>
    ),
  }),
  expect: (
    <div className="a">
      <p />
      <div>
        <p />
      </div>
    </div>
  ),
  css: (css) => css`
    .a {
      color: red;
      & > p {
        color: blue;
      }
    }
  `,
})

createUnitTest({
  name: 'child combinator with & (no space)',
  test: styled('div', {
    color: 'red',

    '&>p': {
      color: 'blue',
    },
  })({
    children: (
      <>
        <p />
        <div>
          <p />
        </div>
      </>
    ),
  }),
  expect: (
    <div className="a">
      <p />
      <div>
        <p />
      </div>
    </div>
  ),
  css: (css) => css`
    .a {
      color: red;
      & > p {
        color: blue;
      }
    }
  `,
})

createUnitTest({
  name: 'descendant combinator',
  test: styled('div', {
    color: 'red',

    p: {
      color: 'blue',
    },
  })({
    children: (
      <>
        <p />
        <div>
          <p />
        </div>
      </>
    ),
  }),
  expect: (
    <div className="a">
      <p />
      <div>
        <p />
      </div>
    </div>
  ),
  css: (css) => css`
    .a {
      color: red;
      p {
        color: blue;
      }
    }
  `,
})

createUnitTest({
  name: 'descendant combinator with &',
  test: styled('div', {
    color: 'red',

    '& p': {
      color: 'blue',
    },
  })({
    children: (
      <>
        <p />
        <div>
          <p />
        </div>
      </>
    ),
  }),
  expect: (
    <div className="a">
      <p />
      <div>
        <p />
      </div>
    </div>
  ),
  css: (css) => css`
    .a {
      color: red;
      & p {
        color: blue;
      }
    }
  `,
})

createUnitTest({
  name: 'descendant combinator with & (no space)',
  test: styled('div', {
    color: 'red',

    '&p': {
      color: 'blue',
    },
  })({
    children: (
      <>
        <p />
        <div>
          <p />
        </div>
      </>
    ),
  }),
  expect: (
    <div className="a">
      <p />
      <div>
        <p />
      </div>
    </div>
  ),
  css: (css) => css`
    .a {
      color: red;
      &p {
        color: blue;
      }
    }
  `,
})

createUnitTest({
  name: 'next-sibling combinator',
  test: (
    <>
      <Box
        css={{
          color: 'red',

          '+ p': {
            color: 'blue',
          },
        }}
      >
        <p />
        <p />
        <Box
          css={{
            color: 'red',

            '+ p': {
              color: 'blue',
            },
          }}
        >
          <p />
          <p />
        </Box>
        <p />
        <p />
      </Box>
      <p />
      <p />
    </>
  ),
  expect: (
    <>
      <div className="a">
        <p />
        <p />
        <div className="a">
          <p />
          <p />
        </div>
        <p />
        <p />
      </div>
      <p />
      <p />
    </>
  ),
  css: (css) => css`
    .a {
      color: red;
      + p {
        color: blue;
      }
    }
  `,
})

createUnitTest({
  name: 'next-sibling combinator with &',
  test: (
    <>
      <Box
        css={{
          color: 'red',

          '& + p': {
            color: 'blue',
          },
        }}
      >
        <p />
        <p />
        <Box
          css={{
            color: 'red',

            '& + p': {
              color: 'blue',
            },
          }}
        >
          <p />
          <p />
        </Box>
        <p />
        <p />
      </Box>
      <p />
      <p />
    </>
  ),
  expect: (
    <>
      <div className="a">
        <p />
        <p />
        <div className="a">
          <p />
          <p />
        </div>
        <p />
        <p />
      </div>
      <p />
      <p />
    </>
  ),
  css: (css) => css`
    .a {
      color: red;
      & + p {
        color: blue;
      }
    }
  `,
})

createUnitTest({
  name: 'next-sibling combinator with & (no space)',
  test: (
    <>
      <Box
        css={{
          color: 'red',

          '&+p': {
            color: 'blue',
          },
        }}
      >
        <p />
        <p />
        <Box
          css={{
            color: 'red',

            '&+p': {
              color: 'blue',
            },
          }}
        >
          <p />
          <p />
        </Box>
        <p />
        <p />
      </Box>
      <p />
      <p />
    </>
  ),
  expect: (
    <>
      <div className="a">
        <p />
        <p />
        <div className="a">
          <p />
          <p />
        </div>
        <p />
        <p />
      </div>
      <p />
      <p />
    </>
  ),
  css: (css) => css`
    .a {
      color: red;
      & + p {
        color: blue;
      }
    }
  `,
})

createUnitTest({
  name: 'subsequent-sibling combinator',
  test: (
    <>
      <Box
        css={{
          color: 'red',

          '~ p': {
            color: 'blue',
          },
        }}
      >
        <p />
        <p />
      </Box>
      <p />
      <p />
    </>
  ),
  expect: (
    <>
      <div className="a">
        <p />
        <p />
      </div>
      <p />
      <p />
    </>
  ),
  css: (css) => css`
    .a {
      color: red;
      ~ p {
        color: blue;
      }
    }
  `,
})

createUnitTest({
  name: 'subsequent-sibling combinator with &',
  test: (
    <>
      <Box
        css={{
          color: 'red',

          '& ~ p': {
            color: 'blue',
          },
        }}
      >
        <p />
        <p />
      </Box>
      <p />
      <p />
    </>
  ),
  expect: (
    <>
      <div className="a">
        <p />
        <p />
      </div>
      <p />
      <p />
    </>
  ),
  css: (css) => css`
    .a {
      color: red;
      & ~ p {
        color: blue;
      }
    }
  `,
})

createUnitTest({
  name: 'subsequent-sibling combinator with & (no space)',
  test: (
    <>
      <Box
        css={{
          color: 'red',

          '&~p': {
            color: 'blue',
          },
        }}
      >
        <p />
        <p />
      </Box>
      <p />
      <p />
    </>
  ),
  expect: (
    <>
      <div className="a">
        <p />
        <p />
      </div>
      <p />
      <p />
    </>
  ),
  css: (css) => css`
    .a {
      color: red;
      & ~ p {
        color: blue;
      }
    }
  `,
})

createUnitTest({
  name: 'selector list combinator',
  test: (
    <>
      <Box
        css={{
          '.a, .b': {
            color: 'red',
          },
        }}
      >
        <div className="a">
          <p />
        </div>
        <div className="b">
          <p />
        </div>
        <div className="c">
          <p />
        </div>
      </Box>
      <p></p>
    </>
  ),
  expect: (
    <>
      <div className="test">
        <div className="a">
          <p />
        </div>
        <div className="b">
          <p />
        </div>
        <div className="c">
          <p />
        </div>
      </div>
      <p></p>
    </>
  ),
  css: (css) => css`
    .test {
      .a,
      .b {
        color: red;
      }
    }
  `,
})

createUnitTest({
  name: 'selector list combinator with &',
  test: (
    <>
      <Box
        css={{
          '& .a, & .b': {
            color: 'red',
          },
        }}
      >
        <div className="a">
          <p />
        </div>
        <div className="b">
          <p />
        </div>
        <div className="c">
          <p />
        </div>
      </Box>
      <p></p>
    </>
  ),
  expect: (
    <>
      <div className="test">
        <div className="a">
          <p />
        </div>
        <div className="b">
          <p />
        </div>
        <div className="c">
          <p />
        </div>
      </div>
      <p></p>
    </>
  ),
  css: (css) => css`
    .test {
      .a,
      .b {
        color: red;
      }
    }
  `,
})

createUnitTest({
  name: 'selector list combinator with & (no space)',
  test: (
    <>
      <Box
        css={{
          '&.a, &.b': {
            color: 'red',
          },
        }}
      >
        <div className="a">
          <p />
        </div>
        <div className="b">
          <p />
        </div>
        <div className="c">
          <p />
        </div>
      </Box>
      <p></p>
    </>
  ),
  expect: (
    <>
      <div className="test">
        <div className="a">
          <p />
        </div>
        <div className="b">
          <p />
        </div>
        <div className="c">
          <p />
        </div>
      </div>
      <p></p>
    </>
  ),
  css: (css) => css`
    .test {
      &.a,
      &.b {
        color: red;
      }
    }
  `,
})
