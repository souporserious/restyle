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
  name: 'deeply nested child combinator',
  test: styled('div', {
    color: 'red',

    '> div': {
      '> p': {
        color: 'blue',
      },
    },
  })({
    children: (
      <>
        <div>
          <p />
        </div>
        <div>
          <div>
            <p />
          </div>
        </div>
      </>
    ),
  }),
  expect: (
    <div className="a">
      <div>
        <p />
      </div>
      <div>
        <div>
          <p />
        </div>
      </div>
    </div>
  ),
  css: (css) => css`
    .a {
      color: red;
      > div {
        > p {
          color: blue;
        }
      }
    }
  `,
})

createUnitTest({
  name: 'deeply nested child combinator with &',
  fails: true,
  test: styled('div', {
    color: 'red',

    '& > div': {
      '& > p': {
        color: 'blue',
      },
    },
  })({
    children: (
      <>
        <div>
          <p />
        </div>
        <div>
          <div>
            <p />
          </div>
        </div>
      </>
    ),
  }),
  expect: (
    <div className="a">
      <div>
        <p />
      </div>
      <div>
        <div>
          <p />
        </div>
      </div>
    </div>
  ),
  css: (css) => css`
    .a {
      color: red;
      & > div {
        > p {
          color: blue;
        }
      }
    }
  `,
})

createUnitTest({
  name: 'deeply nested child combinator with & (no space)',
  fails: true,
  test: styled('div', {
    color: 'red',

    '&>div': {
      '&>p': {
        color: 'blue',
      },
    },
  })({
    children: (
      <>
        <div>
          <p />
        </div>
        <div>
          <div>
            <p />
          </div>
        </div>
      </>
    ),
  }),
  expect: (
    <div className="a">
      <div>
        <p />
      </div>
      <div>
        <div>
          <p />
        </div>
      </div>
    </div>
  ),
  css: (css) => css`
    .a {
      color: red;
      & > div {
        > p {
          color: blue;
        }
      }
    }
  `,
})

createUnitTest({
  name: 'deeply nested descendant combinator',
  test: styled('div', {
    color: 'red',

    div: {
      p: {
        color: 'blue',
      },
    },
  })({
    children: (
      <>
        <div>
          <p />
        </div>
        <div>
          <div>
            <p />
          </div>
        </div>
      </>
    ),
  }),
  expect: (
    <div className="a">
      <div>
        <p />
      </div>
      <div>
        <div>
          <p />
        </div>
      </div>
    </div>
  ),
  css: (css) => css`
    .a {
      color: red;
      div {
        p {
          color: blue;
        }
      }
    }
  `,
})

createUnitTest({
  name: 'deeply nested descendant combinator with &',
  fails: true,
  test: styled('div', {
    color: 'red',

    '& div': {
      '& p': {
        color: 'blue',
      },
    },
  })({
    children: (
      <>
        <p></p>
        <div>
          <p />
        </div>
        <div>
          <div>
            <p />
          </div>
        </div>
      </>
    ),
  }),
  expect: (
    <div className="a">
      <p></p>
      <div>
        <p />
      </div>
      <div>
        <div>
          <p />
        </div>
      </div>
    </div>
  ),
  css: (css) => css`
    .a {
      color: red;
      & div {
        p {
          color: blue;
        }
      }
    }
  `,
})

createUnitTest({
  name: 'deeply nested descendant combinator with & (no space)',
  test: styled('div', {
    color: 'red',

    '&div': {
      '&p': {
        color: 'blue',
      },
    },
  })({
    children: (
      <>
        <p></p>
        <div>
          <p />
        </div>
        <div>
          <div>
            <p />
          </div>
        </div>
      </>
    ),
  }),
  expect: (
    <div className="a">
      <p></p>
      <div>
        <p />
      </div>
      <div>
        <div>
          <p />
        </div>
      </div>
    </div>
  ),
  css: (css) => css`
    .a {
      color: red;
      &div {
        p {
          color: blue;
        }
      }
    }
  `,
})

createUnitTest({
  name: 'deeply nested next-sibling combinator',
  test: (
    <>
      <Box
        css={{
          color: 'red',

          '+ div': {
            '+ p': {
              color: 'blue',
            },
          },
        }}
      >
        <div />
        <p />
        <div>
          <p />
          <p />
        </div>
      </Box>
      <p />
    </>
  ),
  expect: (
    <>
      <div className="a">
        <div />
        <p />
        <div>
          <p />
          <p />
        </div>
      </div>
      <p />
    </>
  ),
  css: (css) => css`
    .a {
      color: red;
      + div {
        + p {
          color: blue;
        }
      }
    }
  `,
})

createUnitTest({
  name: 'deeply nested next-sibling combinator with &',
  fails: true,
  test: (
    <>
      <Box
        css={{
          color: 'red',

          '& + div': {
            '& + p': {
              color: 'blue',
            },
          },
        }}
      >
        <div />
        <p />
        <div>
          <p />
          <p />
        </div>
      </Box>
      <p />
    </>
  ),
  expect: (
    <>
      <div className="a">
        <div />
        <p />
        <div>
          <p />
          <p />
        </div>
      </div>
      <p />
    </>
  ),
  css: (css) => css`
    .a {
      color: red;
      & > div {
        + p {
          color: blue;
        }
      }
    }
  `,
})

createUnitTest({
  name: 'deeply nested next-sibling combinator with & (no space)',
  test: (
    <>
      <Box
        css={{
          color: 'red',

          '&+div': {
            '&+p': {
              color: 'blue',
            },
          },
        }}
      >
        <div />
        <p />
        <div>
          <p />
          <p />
        </div>
      </Box>
      <p />
    </>
  ),
  expect: (
    <>
      <div className="a">
        <div />
        <p />
        <div>
          <p />
          <p />
        </div>
      </div>
      <p />
    </>
  ),
  css: (css) => css`
    .a {
      color: red;
      & + div {
        & + p {
          color: blue;
        }
      }
    }
  `,
})

createUnitTest({
  name: 'deeply nested subsequent-sibling combinator',
  test: (
    <>
      <Box
        css={{
          color: 'red',

          '~ div': {
            '~ p': {
              color: 'blue',
            },
          },
        }}
      >
        <div />
        <p />
        <p />
        <div>
          <p />
          <p />
        </div>
      </Box>
      <p />
    </>
  ),
  expect: (
    <>
      <div className="a">
        <div />
        <p />
        <p />
        <div>
          <p />
          <p />
        </div>
      </div>
      <p />
    </>
  ),
  css: (css) => css`
    .a {
      color: red;
      ~ div {
        ~ p {
          color: blue;
        }
      }
    }
  `,
})

createUnitTest({
  name: 'deeply nested subsequent-sibling combinator with &',
  test: (
    <>
      <Box
        css={{
          color: 'red',

          '& ~ div': {
            '& ~ p': {
              color: 'blue',
            },
          },
        }}
      >
        <div />
        <p />
        <p />
        <div>
          <p />
          <p />
        </div>
      </Box>
      <p />
    </>
  ),
  expect: (
    <>
      <div className="a">
        <div />
        <p />
        <p />
        <div>
          <p />
          <p />
        </div>
      </div>
      <p />
    </>
  ),
  css: (css) => css`
    .a {
      color: red;
      & ~ div {
        & ~ p {
          color: blue;
        }
      }
    }
  `,
})

createUnitTest({
  name: 'deeply nested subsequent-sibling combinator with & (no space)',
  fails: true,
  test: (
    <>
      <Box
        css={{
          color: 'red',

          '&~div': {
            '&~p': {
              color: 'blue',
            },
          },
        }}
      >
        <div />
        <p />
        <p />
        <div>
          <p />
          <p />
        </div>
      </Box>
      <p />
    </>
  ),
  expect: (
    <>
      <div className="a">
        <div />
        <p />
        <p />
        <div>
          <p />
          <p />
        </div>
      </div>
      <p />
    </>
  ),
  css: (css) => css`
    .a {
      color: red;
      & > div {
        ~ p {
          color: blue;
        }
      }
    }
  `,
})

createUnitTest({
  name: 'deeply nested selector list combinator',
  fails: true,
  test: (
    <>
      <Box
        css={{
          '.a, .b': {
            color: 'red',
            '.a, .b': {
              color: 'green',
            },
          },
        }}
      >
        <div className="a">
          <div className="b">
            <div className="a"></div>
            <p />
          </div>
        </div>
        <div className="b">
          <div className="a">
            <div className="b"></div>
          </div>
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
          <div className="b">
            <div className="a"></div>
            <p />
          </div>
        </div>
        <div className="b">
          <div className="a">
            <div className="b"></div>
          </div>
          <p />
        </div>
        <div className="c">
          <p></p>
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
        .a,
        .b {
          color: green;
        }
      }
    }
  `,
})

createUnitTest({
  name: 'deeply nested selector list combinator with &',
  fails: true,
  test: (
    <>
      <Box
        css={{
          '& .a, & .b': {
            color: 'red',
            '& .a, & .b': {
              color: 'green',
            },
          },
        }}
      >
        <div className="a">
          <div className="b">
            <div className="a"></div>
            <p />
          </div>
        </div>
        <div className="b">
          <div className="a">
            <div className="b"></div>
          </div>
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
          <div className="b">
            <div className="a"></div>
            <p />
          </div>
        </div>
        <div className="b">
          <div className="a">
            <div className="b"></div>
          </div>
          <p />
        </div>
        <div className="c">
          <p></p>
        </div>
      </div>
      <p></p>
    </>
  ),
  css: (css) => css`
    .test {
      & .a,
      & .b {
        color: green;
        & .a,
        & .b {
          color: red;
        }
      }
    }
  `,
})
createUnitTest({
  name: 'deeply nested selector list combinator with & (no space)',
  test: (
    <>
      <Box
        css={{
          '&.a, &.b': {
            color: 'red',
            '&.a, &.b': {
              color: 'green',
            },
          },
        }}
      >
        <div className="a">
          <div className="b">
            <div className="a"></div>
            <p />
          </div>
        </div>
        <div className="b">
          <div className="a">
            <div className="b"></div>
          </div>
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
          <div className="b">
            <div className="a"></div>
            <p />
          </div>
        </div>
        <div className="b">
          <div className="a">
            <div className="b"></div>
          </div>
          <p />
        </div>
        <div className="c">
          <p></p>
        </div>
      </div>
      <p></p>
    </>
  ),
  css: (css) => css`
    .test {
      &.a,
      &.b {
        color: green;
        &.a,
        &.b {
          color: red;
        }
      }
    }
  `,
})
