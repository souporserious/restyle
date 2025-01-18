/**
 * Simple Selectors
 * @see https://www.w3schools.com/cssref/css_selectors.php
 */

import { styled } from '../../../src/styled.js'
import { createUnitTest } from '../../createUnitTest.js'

const css = String.raw

createUnitTest({
  name: 'nesting element selectors',
  test: styled('div', {
    color: 'red',

    div: {
      color: 'blue',
    },
  })({ children: <div /> }),
  expect: (
    <div className="a">
      <div />
    </div>
  ),
  css: css`
    .a {
      color: red;
      div {
        color: blue;
      }
    }
  `,
})

createUnitTest({
  name: 'nesting element selectors with &',
  test: styled('div', {
    color: 'red',

    '& div': {
      color: 'blue',
    },
  })({ children: <div /> }),
  expect: (
    <div className="a">
      <div />
    </div>
  ),
  css: css`
    .a {
      color: red;
      & div {
        color: blue;
      }
    }
  `,
})

createUnitTest({
  name: 'nesting element selectors with & (no space)',
  test: styled('div', {
    color: 'red',

    '&div': {
      color: 'blue',
    },
  })({ children: <div /> }),
  expect: (
    <div className="a">
      <div />
    </div>
  ),
  css: css`
    .a {
      color: red;
      &div {
        color: blue;
      }
    }
  `,
})

createUnitTest({
  name: 'nesting id selectors',
  test: styled('div', {
    color: 'red',

    '#a': {
      color: 'blue',
    },
  })({ children: <div id="a" /> }),
  expect: (
    <div className="a">
      <div id="a" />
    </div>
  ),
  css: css`
    .a {
      color: red;
      #a {
        color: blue;
      }
    }
  `,
})

createUnitTest({
  name: 'nesting id selectors with &',
  test: styled('div', {
    color: 'red',

    '& #a': {
      color: 'blue',
    },
  })({ children: <div id="a" /> }),
  expect: (
    <div className="a">
      <div id="a" />
    </div>
  ),
  css: css`
    .a {
      color: red;

      & #a {
        color: blue;
      }
    }
  `,
})

createUnitTest({
  name: 'nesting id selectors with & (no space)',
  test: styled('div', {
    color: 'red',

    '&#a': {
      color: 'blue',
    },
  })({ children: <div id="a" /> }),
  expect: (
    <div className="a">
      <div id="a" />
    </div>
  ),
  css: css`
    .a {
      color: red;

      &#a {
        color: blue;
      }
    }
  `,
})

createUnitTest({
  name: 'nesting * selectors',
  test: styled('div', {
    color: 'red',

    '*': {
      color: 'blue',
    },
  })({ children: <div /> }),
  expect: (
    <div className="a">
      <div />
    </div>
  ),
  css: css`
    .a {
      color: red;
      * {
        color: blue;
      }
    }
  `,
})

createUnitTest({
  name: 'nesting * selectors with &',
  test: styled('div', {
    color: 'red',

    '& *': {
      color: 'blue',
    },
  })({ children: <div /> }),
  expect: (
    <div className="a">
      <div />
    </div>
  ),
  css: css`
    .a {
      color: red;
      & * {
        color: blue;
      }
    }
  `,
})

createUnitTest({
  name: 'nesting * selectors with & (no space)',
  test: styled('div', {
    color: 'red',

    '&*': {
      color: 'blue',
    },
  })({ children: <div /> }),
  expect: (
    <div className="a">
      <div />
    </div>
  ),
  css: css`
    .a {
      color: red;
      &* {
        color: blue;
      }
    }
  `,
})

createUnitTest({
  name: 'nesting class selectors',
  test: styled('div', {
    color: 'red',

    '.name': {
      color: 'blue',
    },
  })({ children: <div className="name" /> }),
  expect: (
    <div className="a">
      <div className="name" />
    </div>
  ),
  css: css`
    .a {
      color: red;
      .name {
        color: blue;
      }
    }
  `,
})

createUnitTest({
  name: 'nesting class selectors with &',
  test: styled('div', {
    color: 'red',

    '& .name': {
      color: 'blue',
    },
  })({ children: <div className="name" /> }),
  expect: (
    <div className="a">
      <div className="name" />
    </div>
  ),
  css: css`
    .a {
      color: red;
      & .name {
        color: blue;
      }
    }
  `,
})

const A = styled('div', {
  color: 'red',

  '&.name': {
    color: 'blue',
  },
})
createUnitTest({
  name: 'nesting class selectors with & (no space)',
  test: (
    <>
      <A>
        <div className="name" />
      </A>
      <A className="name" />
    </>
  ),
  expect: (
    <>
      <div className="a">
        <div className="name" />
      </div>
      <div className="a name" />
    </>
  ),
  css: css`
    .a {
      color: red;
      &.name {
        color: blue;
      }
    }
  `,
})
