/**
 * Simple Selectors
 * @see https://www.w3schools.com/cssref/css_selectors.php
 */

import { styled } from '../../../src/styled.js'
import { createUnitTest } from '../../createUnitTest.js'

const css = String.raw

createUnitTest({
  name: 'deeply nesting element selectors',
  test: styled('div', {
    color: 'red',

    div: {
      color: 'green',

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
        <p />
      </>
    ),
  }),
  expect: (
    <div className="a">
      <div>
        <p />
      </div>
      <p />
    </div>
  ),
  css: css`
    .a {
      color: red;
      div {
        color: green;
        p {
          color: blue;
        }
      }
    }
  `,
})

createUnitTest({
  name: 'deeply nesting element selectors with &',
  fails: true,
  test: styled('div', {
    color: 'red',

    div: {
      color: 'green',

      '& p': {
        color: 'blue',
      },
    },
  })({
    children: (
      <>
        <div>
          <p />
        </div>
        <p />
      </>
    ),
  }),

  expect: (
    <div className="abc">
      <div>
        <p />
      </div>
      <p />
    </div>
  ),
  css: css`
    .abc {
      color: red;

      div {
        color: green;

        & p {
          color: blue;
        }
      }
    }
  `,
})

createUnitTest({
  name: 'deeply nesting element selectors with & (no space)',
  test: styled('div', {
    color: 'red',

    div: {
      color: 'green',
      '&p': {
        color: 'blue',
      },
    },
  })({
    children: (
      <>
        <div>
          <p />
        </div>
        <p />
      </>
    ),
  }),
  expect: (
    <div className="a">
      <div>
        <p />
      </div>
      <p />
    </div>
  ),
  css: css`
    .a {
      color: red;
      div {
        color: green;
        &p {
          color: blue;
        }
      }
    }
  `,
})

createUnitTest({
  name: 'deeply nesting id selectors',
  test: styled('div', {
    color: 'red',

    '#a': {
      color: 'green',

      '#b': {
        color: 'blue',
      },
    },
  })({
    children: (
      <>
        <div id="a">
          <div id="b" />
        </div>
        <div id="b" />
      </>
    ),
  }),
  expect: (
    <div className="a">
      <div id="a">
        <div id="b" />
      </div>
      <div id="b" />
    </div>
  ),
  css: css`
    .a {
      color: red;
      #a {
        color: green;
        #b {
          color: blue;
        }
      }
    }
  `,
})

createUnitTest({
  name: 'deeply nesting id selectors with &',
  fails: true,
  test: styled('div', {
    color: 'red',

    '#a': {
      color: 'green',

      '& #b': {
        color: 'blue',
      },
    },
  })({
    children: (
      <>
        <div id="a">
          <div id="b" />
        </div>
        <div id="b" />
      </>
    ),
  }),
  expect: (
    <div className="abc">
      <div id="a">
        <div id="b" />
      </div>
      <div id="b" />
    </div>
  ),
  css: css`
    .abc {
      color: red;
      #a {
        color: green;

        & #b {
          color: blue;
        }
      }
    }
  `,
})

createUnitTest({
  name: 'deeply nesting id selectors with & (no space)',
  test: styled('div', {
    color: 'red',

    '#a': {
      color: 'green',
      '&#b': {
        color: 'blue',
      },
    },
  })({
    children: (
      <>
        <div id="a">
          <div id="b" />
        </div>
        <div id="b" />
      </>
    ),
  }),
  expect: (
    <div className="a">
      <div id="a">
        <div id="b" />
      </div>
      <div id="b" />
    </div>
  ),
  css: css`
    .a {
      color: red;
      #a {
        color: green;
        &#b {
          color: blue;
        }
      }
    }
  `,
})

createUnitTest({
  name: 'deeply nesting * selectors',
  test: styled('div', {
    color: 'red',

    '*': {
      color: 'green',

      '*': {
        color: 'blue',
      },
    },
  })({
    children: (
      <>
        <div>
          <div>
            <div />
          </div>
        </div>
        <div>
          <div />
        </div>
      </>
    ),
  }),
  expect: (
    <div className="a">
      <div>
        <div>
          <div />
        </div>
      </div>
      <div>
        <div />
      </div>
    </div>
  ),
  css: css`
    .a {
      color: red;
      * {
        color: green;
        * {
          color: blue;
        }
      }
    }
  `,
})

createUnitTest({
  name: 'deeply nesting * selectors with &',
  fails: true,
  test: styled('div', {
    color: 'red',

    '*': {
      color: 'green',

      '& *': {
        color: 'blue',
      },
    },
  })({
    children: (
      <>
        <div>
          <div>
            <div />
          </div>
        </div>
        <div>
          <div />
        </div>
      </>
    ),
  }),
  expect: (
    <div className="abc">
      <div>
        <div>
          <div />
        </div>
      </div>
      <div>
        <div />
      </div>
    </div>
  ),
  css: css`
    .abc {
      color: red;
      * {
        color: green;
        & * {
          color: blue;
        }
      }
    }
  `,
})

createUnitTest({
  name: 'deeply nesting * selectors with & (no space)',
  test: styled('div', {
    color: 'red',

    '*': {
      color: 'green',
      '&*': {
        color: 'blue',
      },
    },
  })({
    children: (
      <>
        <div>
          <div>
            <div />
          </div>
        </div>
        <div>
          <div />
        </div>
      </>
    ),
  }),
  expect: (
    <div className="a">
      <div>
        <div>
          <div />
        </div>
      </div>
      <div>
        <div />
      </div>
    </div>
  ),
  css: css`
    .a {
      color: red;
      * {
        color: green;
        &* {
          color: blue;
        }
      }
    }
  `,
})

createUnitTest({
  name: 'deeply nesting class selectors',
  test: styled('div', {
    color: 'red',

    '.name': {
      color: 'green',

      '.name': {
        color: 'blue',
      },
    },
  })({
    children: (
      <>
        <div className="name">
          <div className="name" />
        </div>
        <div className="name" />
      </>
    ),
  }),
  expect: (
    <div className="a">
      <div className="name">
        <div className="name" />
      </div>
      <div className="name" />
    </div>
  ),
  css: css`
    .a {
      color: red;
      .name {
        color: green;
        .name {
          color: blue;
        }
      }
    }
  `,
})

createUnitTest({
  name: 'deeply nesting class selectors with &',
  fails: true,
  test: styled('div', {
    color: 'red',

    '.name': {
      color: 'green',

      '& .name': {
        color: 'blue',
      },
    },
  })({
    children: (
      <>
        <div className="name">
          <div className="name" />
        </div>
        <div className="name" />
      </>
    ),
  }),
  expect: (
    <div className="abc">
      <div className="name">
        <div className="name" />
      </div>
      <div className="name" />
    </div>
  ),
  css: css`
    .abc {
      color: red;
      .name {
        color: green;

        & .name {
          color: blue;
        }
      }
    }
  `,
})

createUnitTest({
  name: 'deeply nesting class selectors with & (no space)',
  fails: true,
  test: styled('div', {
    color: 'red',

    '.name': {
      color: 'green',
      '&.name': {
        color: 'blue',
      },
    },
  })({
    children: (
      <>
        <div className="name">
          <div className="name" />
        </div>
        <div className="name" />
      </>
    ),
  }),
  expect: (
    <div className="a">
      <div className="name">
        <div className="name" />
      </div>
      <div className="name" />
    </div>
  ),
  css: css`
    .a {
      color: red;
      .name {
        color: green;
        &.name {
          color: blue;
        }
      }
    }
  `,
})
