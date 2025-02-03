/**
 * CSS Attribute Selectors
 * @see https://www.w3schools.com/cssref/css_selectors.php#:~:text=CSS%20Attribute%20Selectors
 */

import { styled } from '../../../src/styled.js'
import { createUnitTest } from '../../createUnitTest.js'

createUnitTest({
  name: 'attribute selector',
  test: styled('div', {
    color: 'red',

    '[lang]': {
      color: 'blue',
    },
  })({ children: <div lang="en" /> }),
  expect: (
    <div className="a">
      <div lang="en" />
    </div>
  ),
  css: (css) => css`
    .a {
      color: red;
      [lang] {
        color: blue;
      }
    }
  `,
})

createUnitTest({
  name: 'attribute value selector',
  test: styled('div', {
    color: 'red',

    '[lang="it"]': {
      color: 'blue',
    },
  })({ children: <div lang="it" /> }),
  expect: (
    <div className="a">
      <div lang="it" />
    </div>
  ),
  css: (css) => css`
    .a {
      color: red;
      [lang='it'] {
        color: blue;
      }
    }
  `,
})

createUnitTest({
  name: 'attribute contains word selector',
  test: styled('div', {
    color: 'red',

    '[title~="flower"]': {
      color: 'blue',
    },
  })({ children: <div title="beautiful flower" /> }),
  expect: (
    <div className="a">
      <div title="beautiful flower" />
    </div>
  ),
  css: (css) => css`
    .a {
      color: red;
      [title~='flower'] {
        color: blue;
      }
    }
  `,
})

createUnitTest({
  name: 'attribute starts with value selector',
  test: styled('div', {
    color: 'red',

    '[lang|="en"]': {
      color: 'blue',
    },
  })({ children: <div lang="en-US" /> }),
  expect: (
    <div className="a">
      <div lang="en-US" />
    </div>
  ),
  css: (css) => css`
    .a {
      color: red;
      [lang|='en'] {
        color: blue;
      }
    }
  `,
})

createUnitTest({
  name: 'attribute begins with value selector',
  test: styled('div', {
    color: 'red',

    '[href^="https"]': {
      color: 'blue',
    },
  })({ children: <a href="https://example.com" /> }),
  expect: (
    <div className="a">
      <a href="https://example.com" />
    </div>
  ),
  css: (css) => css`
    .a {
      color: red;
      [href^='https'] {
        color: blue;
      }
    }
  `,
})

createUnitTest({
  name: 'attribute ends with value selector',
  test: styled('div', {
    color: 'red',

    '[href$=".pdf"]': {
      color: 'blue',
    },
  })({ children: <a href="document.pdf" /> }),
  expect: (
    <div className="a">
      <a href="document.pdf" />
    </div>
  ),
  css: (css) => css`
    .a {
      color: red;
      [href$='.pdf'] {
        color: blue;
      }
    }
  `,
})

createUnitTest({
  name: 'attribute contains value selector',
  test: styled('div', {
    color: 'red',

    '[href*="w3schools"]': {
      color: 'blue',
    },
  })({ children: <a href="https://www.w3schools.com" /> }),
  expect: (
    <div className="a">
      <a href="https://www.w3schools.com" />
    </div>
  ),
  css: (css) => css`
    .a {
      color: red;
      [href*='w3schools'] {
        color: blue;
      }
    }
  `,
})

createUnitTest({
  name: 'nesting attribute selector with &',
  test: styled('div', {
    color: 'red',

    '& [lang]': {
      color: 'blue',
    },
  })({ children: <div lang="en" /> }),
  expect: (
    <div className="a">
      <div lang="en" />
    </div>
  ),
  css: (css) => css`
    .a {
      color: red;
      & [lang] {
        color: blue;
      }
    }
  `,
})

createUnitTest({
  name: 'nesting attribute value selector with &',
  test: styled('div', {
    color: 'red',

    '& [lang="it"]': {
      color: 'blue',
    },
  })({ children: <div lang="it" /> }),
  expect: (
    <div className="a">
      <div lang="it" />
    </div>
  ),
  css: (css) => css`
    .a {
      color: red;
      & [lang='it'] {
        color: blue;
      }
    }
  `,
})

createUnitTest({
  name: 'nesting attribute contains word selector with &',
  test: styled('div', {
    color: 'red',

    '& [title~="flower"]': {
      color: 'blue',
    },
  })({ children: <div title="beautiful flower" /> }),
  expect: (
    <div className="a">
      <div title="beautiful flower" />
    </div>
  ),
  css: (css) => css`
    .a {
      color: red;
      & [title~='flower'] {
        color: blue;
      }
    }
  `,
})

createUnitTest({
  name: 'nesting attribute starts with value selector with &',
  test: styled('div', {
    color: 'red',

    '& [lang|="en"]': {
      color: 'blue',
    },
  })({ children: <div lang="en-US" /> }),
  expect: (
    <div className="a">
      <div lang="en-US" />
    </div>
  ),
  css: (css) => css`
    .a {
      color: red;
      & [lang|='en'] {
        color: blue;
      }
    }
  `,
})

createUnitTest({
  name: 'nesting attribute begins with value selector with &',
  test: styled('div', {
    color: 'red',

    '& [href^="https"]': {
      color: 'blue',
    },
  })({ children: <a href="https://example.com" /> }),
  expect: (
    <div className="a">
      <a href="https://example.com" />
    </div>
  ),
  css: (css) => css`
    .a {
      color: red;
      & [href^='https'] {
        color: blue;
      }
    }
  `,
})

createUnitTest({
  name: 'nesting attribute ends with value selector with &',
  test: styled('div', {
    color: 'red',

    '& [href$=".pdf"]': {
      color: 'blue',
    },
  })({ children: <a href="document.pdf" /> }),
  expect: (
    <div className="a">
      <a href="document.pdf" />
    </div>
  ),
  css: (css) => css`
    .a {
      color: red;
      & [href$='.pdf'] {
        color: blue;
      }
    }
  `,
})

createUnitTest({
  name: 'nesting attribute contains value selector with &',
  test: styled('div', {
    color: 'red',

    '& [href*="w3schools"]': {
      color: 'blue',
    },
  })({ children: <a href="https://www.w3schools.com" /> }),
  expect: (
    <div className="a">
      <a href="https://www.w3schools.com" />
    </div>
  ),
  css: (css) => css`
    .a {
      color: red;
      & [href*='w3schools'] {
        color: blue;
      }
    }
  `,
})

createUnitTest({
  name: 'nesting attribute selector with & (no space)',
  test: styled('div', {
    color: 'red',

    '&[lang]': {
      color: 'blue',
    },
  })({ children: <div lang="en" /> }),
  expect: (
    <div className="a">
      <div lang="en" />
    </div>
  ),
  css: (css) => css`
    .a {
      color: red;
      &[lang] {
        color: blue;
      }
    }
  `,
})

createUnitTest({
  name: 'nesting attribute value selector with & (no space)',
  test: styled('div', {
    color: 'red',

    '&[lang="it"]': {
      color: 'blue',
    },
  })({ children: <div lang="it" /> }),
  expect: (
    <div className="a">
      <div lang="it" />
    </div>
  ),
  css: (css) => css`
    .a {
      color: red;
      &[lang='it'] {
        color: blue;
      }
    }
  `,
})

createUnitTest({
  name: 'nesting attribute contains word selector with & (no space)',
  test: styled('div', {
    color: 'red',

    '&[title~="flower"]': {
      color: 'blue',
    },
  })({ children: <div title="beautiful flower" /> }),
  expect: (
    <div className="a">
      <div title="beautiful flower" />
    </div>
  ),
  css: (css) => css`
    .a {
      color: red;
      &[title~='flower'] {
        color: blue;
      }
    }
  `,
})

createUnitTest({
  name: 'nesting attribute starts with value selector with & (no space)',
  test: styled('div', {
    color: 'red',

    '&[lang|="en"]': {
      color: 'blue',
    },
  })({ children: <div lang="en-US" /> }),
  expect: (
    <div className="a">
      <div lang="en-US" />
    </div>
  ),
  css: (css) => css`
    .a {
      color: red;
      &[lang|='en'] {
        color: blue;
      }
    }
  `,
})

createUnitTest({
  name: 'nesting attribute begins with value selector with & (no space)',
  test: styled('div', {
    color: 'red',

    '&[href^="https"]': {
      color: 'blue',
    },
  })({ children: <a href="https://example.com" /> }),
  expect: (
    <div className="a">
      <a href="https://example.com" />
    </div>
  ),
  css: (css) => css`
    .a {
      color: red;
      &[href^='https'] {
        color: blue;
      }
    }
  `,
})

createUnitTest({
  name: 'nesting attribute ends with value selector with & (no space)',
  test: styled('div', {
    color: 'red',

    '&[href$=".pdf"]': {
      color: 'blue',
    },
  })({ children: <a href="document.pdf" /> }),
  expect: (
    <div className="a">
      <a href="document.pdf" />
    </div>
  ),
  css: (css) => css`
    .a {
      color: red;
      &[href$='.pdf'] {
        color: blue;
      }
    }
  `,
})

createUnitTest({
  name: 'nesting attribute contains value selector with & (no space)',
  test: styled('div', {
    color: 'red',

    '&[href*="w3schools"]': {
      color: 'blue',
    },
  })({ children: <a href="https://www.w3schools.com" /> }),
  expect: (
    <div className="a">
      <a href="https://www.w3schools.com" />
    </div>
  ),
  css: (css) => css`
    .a {
      color: red;
      &[href*='w3schools'] {
        color: blue;
      }
    }
  `,
})
