/**
 * CSS Attribute Selectors
 * @see https://www.w3schools.com/cssref/css_selectors.php#:~:text=CSS%20Attribute%20Selectors
 */

import { styled } from '../../../src/styled.js'
import { createUnitTest } from '../../createUnitTest.js'

createUnitTest({
  name: 'deeply nesting attribute selectors',
  test: styled('div', {
    color: 'red',

    '[lang]': {
      color: 'green',

      '[title]': {
        color: 'blue',
      },
    },
  })({
    children: (
      <>
        <div lang="en">
          <div title="example" />
        </div>
        <div title="example" />
      </>
    ),
  }),
  expect: (
    <div className="a">
      <div lang="en">
        <div title="example" />
      </div>
      <div title="example" />
    </div>
  ),
  css: (css) => css`
    .a {
      color: red;
      [lang] {
        color: green;
        [title] {
          color: blue;
        }
      }
    }
  `,
})

createUnitTest({
  name: 'deeply nesting attribute value selectors',
  test: styled('div', {
    color: 'red',

    '[lang="en"]': {
      color: 'green',

      '[title="example"]': {
        color: 'blue',
      },
    },
  })({
    children: (
      <>
        <div lang="en">
          <div title="example" />
        </div>
        <div title="example" />
      </>
    ),
  }),
  expect: (
    <div className="a">
      <div lang="en">
        <div title="example" />
      </div>
      <div title="example" />
    </div>
  ),
  css: (css) => css`
    .a {
      color: red;
      [lang='en'] {
        color: green;
        [title='example'] {
          color: blue;
        }
      }
    }
  `,
})

createUnitTest({
  name: 'deeply nesting attribute contains word selectors',
  test: styled('div', {
    color: 'red',

    '[lang~="en"]': {
      color: 'green',

      '[title~="example"]': {
        color: 'blue',
      },
    },
  })({
    children: (
      <>
        <div lang="en">
          <div title="example" />
        </div>
        <div title="example" />
      </>
    ),
  }),
  expect: (
    <div className="a">
      <div lang="en">
        <div title="example" />
      </div>
      <div title="example" />
    </div>
  ),
  css: (css) => css`
    .a {
      color: red;
      [lang~='en'] {
        color: green;
        [title~='example'] {
          color: blue;
        }
      }
    }
  `,
})

createUnitTest({
  name: 'deeply nesting attribute starts with value selectors',
  test: styled('div', {
    color: 'red',

    '[lang|="en"]': {
      color: 'green',

      '[title|="example"]': {
        color: 'blue',
      },
    },
  })({
    children: (
      <>
        <div lang="en">
          <div title="example" />
        </div>
        <div title="example" />
      </>
    ),
  }),
  expect: (
    <div className="a">
      <div lang="en">
        <div title="example" />
      </div>
      <div title="example" />
    </div>
  ),
  css: (css) => css`
    .a {
      color: red;
      [lang|='en'] {
        color: green;
        [title|='example'] {
          color: blue;
        }
      }
    }
  `,
})

createUnitTest({
  name: 'deeply nesting attribute begins with value selectors',
  test: styled('div', {
    color: 'red',

    '[lang^="en"]': {
      color: 'green',

      '[title^="example"]': {
        color: 'blue',
      },
    },
  })({
    children: (
      <>
        <div lang="en">
          <div title="example" />
        </div>
        <div title="example" />
      </>
    ),
  }),
  expect: (
    <div className="a">
      <div lang="en">
        <div title="example" />
      </div>
      <div title="example" />
    </div>
  ),
  css: (css) => css`
    .a {
      color: red;
      [lang^='en'] {
        color: green;
        [title^='example'] {
          color: blue;
        }
      }
    }
  `,
})

createUnitTest({
  name: 'deeply nesting attribute ends with value selectors',
  test: styled('div', {
    color: 'red',

    '[lang$="en"]': {
      color: 'green',

      '[title$="example"]': {
        color: 'blue',
      },
    },
  })({
    children: (
      <>
        <div lang="en">
          <div title="example" />
        </div>
        <div title="example" />
      </>
    ),
  }),
  expect: (
    <div className="a">
      <div lang="en">
        <div title="example" />
      </div>
      <div title="example" />
    </div>
  ),
  css: (css) => css`
    .a {
      color: red;
      [lang$='en'] {
        color: green;
        [title$='example'] {
          color: blue;
        }
      }
    }
  `,
})

createUnitTest({
  name: 'deeply nesting attribute contains value selectors',
  test: styled('div', {
    color: 'red',

    '[lang*="en"]': {
      color: 'green',

      '[title*="example"]': {
        color: 'blue',
      },
    },
  })({
    children: (
      <>
        <div lang="en">
          <div title="example" />
        </div>
        <div title="example" />
      </>
    ),
  }),
  expect: (
    <div className="a">
      <div lang="en">
        <div title="example" />
      </div>
      <div title="example" />
    </div>
  ),
  css: (css) => css`
    .a {
      color: red;
      [lang*='en'] {
        color: green;
        [title*='example'] {
          color: blue;
        }
      }
    }
  `,
})

createUnitTest({
  name: 'deeply nesting attribute selectors with &',
  fails: true,
  test: styled('div', {
    color: 'red',

    '[lang]': {
      color: 'green',

      '& [title]': {
        color: 'blue',
      },
    },
  })({
    children: (
      <>
        <div lang="en">
          <div title="example" />
        </div>
        <div title="example" />
      </>
    ),
  }),
  expect: (
    <div className="a">
      <div lang="en">
        <div title="example" />
      </div>
      <div title="example" />
    </div>
  ),
  css: (css) => css`
    .a {
      color: red;
      [lang] {
        color: green;
        & [title] {
          color: blue;
        }
      }
    }
  `,
})

createUnitTest({
  name: 'deeply nesting attribute value selectors with &',
  fails: true,
  test: styled('div', {
    color: 'red',

    '[lang="en"]': {
      color: 'green',

      '& [title="example"]': {
        color: 'blue',
      },
    },
  })({
    children: (
      <>
        <div lang="en">
          <div title="example" />
        </div>
        <div title="example" />
      </>
    ),
  }),
  expect: (
    <div className="a">
      <div lang="en">
        <div title="example" />
      </div>
      <div title="example" />
    </div>
  ),
  css: (css) => css`
    .a {
      color: red;
      [lang='en'] {
        color: green;
        & [title='example'] {
          color: blue;
        }
      }
    }
  `,
})

createUnitTest({
  name: 'deeply nesting attribute contains word selectors with &',
  fails: true,
  test: styled('div', {
    color: 'red',

    '[lang~="en"]': {
      color: 'green',

      '& [title~="example"]': {
        color: 'blue',
      },
    },
  })({
    children: (
      <>
        <div lang="en">
          <div title="example" />
        </div>
        <div title="example" />
      </>
    ),
  }),
  expect: (
    <div className="a">
      <div lang="en">
        <div title="example" />
      </div>
      <div title="example" />
    </div>
  ),
  css: (css) => css`
    .a {
      color: red;
      [lang~='en'] {
        color: green;
        & [title~='example'] {
          color: blue;
        }
      }
    }
  `,
})

createUnitTest({
  name: 'deeply nesting attribute starts with value selectors with &',
  fails: true,
  test: styled('div', {
    color: 'red',

    '[lang|="en"]': {
      color: 'green',

      '& [title|="example"]': {
        color: 'blue',
      },
    },
  })({
    children: (
      <>
        <div lang="en">
          <div title="example" />
        </div>
        <div title="example" />
      </>
    ),
  }),
  expect: (
    <div className="a">
      <div lang="en">
        <div title="example" />
      </div>
      <div title="example" />
    </div>
  ),
  css: (css) => css`
    .a {
      color: red;
      [lang|='en'] {
        color: green;
        & [title|='example'] {
          color: blue;
        }
      }
    }
  `,
})

createUnitTest({
  name: 'deeply nesting attribute begins with value selectors with &',
  fails: true,
  test: styled('div', {
    color: 'red',

    '[lang^="en"]': {
      color: 'green',

      '& [title^="example"]': {
        color: 'blue',
      },
    },
  })({
    children: (
      <>
        <div lang="en">
          <div title="example" />
        </div>
        <div title="example" />
      </>
    ),
  }),
  expect: (
    <div className="a">
      <div lang="en">
        <div title="example" />
      </div>
      <div title="example" />
    </div>
  ),
  css: (css) => css`
    .a {
      color: red;
      [lang^='en'] {
        color: green;
        & [title^='example'] {
          color: blue;
        }
      }
    }
  `,
})

createUnitTest({
  name: 'deeply nesting attribute ends with value selectors with &',
  fails: true,
  test: styled('div', {
    color: 'red',

    '[lang$="en"]': {
      color: 'green',

      '& [title$="example"]': {
        color: 'blue',
      },
    },
  })({
    children: (
      <>
        <div lang="en">
          <div title="example" />
        </div>
        <div title="example" />
      </>
    ),
  }),
  expect: (
    <div className="a">
      <div lang="en">
        <div title="example" />
      </div>
      <div title="example" />
    </div>
  ),
  css: (css) => css`
    .a {
      color: red;
      [lang$='en'] {
        color: green;
        & [title$='example'] {
          color: blue;
        }
      }
    }
  `,
})

createUnitTest({
  name: 'deeply nesting attribute contains value selectors with &',
  fails: true,
  test: styled('div', {
    color: 'red',

    '[lang*="en"]': {
      color: 'green',

      '& [title*="example"]': {
        color: 'blue',
      },
    },
  })({
    children: (
      <>
        <div lang="en">
          <div title="example" />
        </div>
        <div title="example" />
      </>
    ),
  }),
  expect: (
    <div className="a">
      <div lang="en">
        <div title="example" />
      </div>
      <div title="example" />
    </div>
  ),
  css: (css) => css`
    .a {
      color: red;
      [lang*='en'] {
        color: green;
        & [title*='example'] {
          color: blue;
        }
      }
    }
  `,
})

createUnitTest({
  name: 'deeply nesting attribute selectors with & (no space)',
  test: styled('div', {
    color: 'red',

    '[lang]': {
      color: 'green',

      '&[title]': {
        color: 'blue',
      },
    },
  })({
    children: (
      <>
        <div lang="en">
          <div title="example" />
        </div>
        <div title="example" />
      </>
    ),
  }),
  expect: (
    <div className="a">
      <div lang="en">
        <div title="example" />
      </div>
      <div title="example" />
    </div>
  ),
  css: (css) => css`
    .a {
      color: red;
      [lang] {
        color: green;
        &[title] {
          color: blue;
        }
      }
    }
  `,
})

createUnitTest({
  name: 'deeply nesting attribute value selectors with & (no space)',
  test: styled('div', {
    color: 'red',

    '[lang="en"]': {
      color: 'green',

      '&[title="example"]': {
        color: 'blue',
      },
    },
  })({
    children: (
      <>
        <div lang="en">
          <div title="example" />
        </div>
        <div title="example" />
      </>
    ),
  }),
  expect: (
    <div className="a">
      <div lang="en">
        <div title="example" />
      </div>
      <div title="example" />
    </div>
  ),
  css: (css) => css`
    .a {
      color: red;
      [lang='en'] {
        color: green;
        &[title='example'] {
          color: blue;
        }
      }
    }
  `,
})

createUnitTest({
  name: 'deeply nesting attribute contains word selectors with & (no space)',
  test: styled('div', {
    color: 'red',

    '[lang~="en"]': {
      color: 'green',

      '&[title~="example"]': {
        color: 'blue',
      },
    },
  })({
    children: (
      <>
        <div lang="en">
          <div title="example" />
        </div>
        <div title="example" />
      </>
    ),
  }),
  expect: (
    <div className="a">
      <div lang="en">
        <div title="example" />
      </div>
      <div title="example" />
    </div>
  ),
  css: (css) => css`
    .a {
      color: red;
      [lang~='en'] {
        color: green;
        &[title~='example'] {
          color: blue;
        }
      }
    }
  `,
})

createUnitTest({
  name: 'deeply nesting attribute starts with value selectors with & (no space)',
  test: styled('div', {
    color: 'red',

    '[lang|="en"]': {
      color: 'green',

      '&[title|="example"]': {
        color: 'blue',
      },
    },
  })({
    children: (
      <>
        <div lang="en">
          <div title="example" />
        </div>
        <div title="example" />
      </>
    ),
  }),
  expect: (
    <div className="a">
      <div lang="en">
        <div title="example" />
      </div>
      <div title="example" />
    </div>
  ),
  css: (css) => css`
    .a {
      color: red;
      [lang|='en'] {
        color: green;
        &[title|='example'] {
          color: blue;
        }
      }
    }
  `,
})

createUnitTest({
  name: 'deeply nesting attribute begins with value selectors with & (no space)',
  test: styled('div', {
    color: 'red',

    '[lang^="en"]': {
      color: 'green',

      '&[title^="example"]': {
        color: 'blue',
      },
    },
  })({
    children: (
      <>
        <div lang="en">
          <div title="example" />
        </div>
        <div title="example" />
      </>
    ),
  }),
  expect: (
    <div className="a">
      <div lang="en">
        <div title="example" />
      </div>
      <div title="example" />
    </div>
  ),
  css: (css) => css`
    .a {
      color: red;
      [lang^='en'] {
        color: green;
        &[title^='example'] {
          color: blue;
        }
      }
    }
  `,
})

createUnitTest({
  name: 'deeply nesting attribute ends with value selectors with & (no space)',
  test: styled('div', {
    color: 'red',

    '[lang$="en"]': {
      color: 'green',

      '&[title$="example"]': {
        color: 'blue',
      },
    },
  })({
    children: (
      <>
        <div lang="en">
          <div title="example" />
        </div>
        <div title="example" />
      </>
    ),
  }),
  expect: (
    <div className="a">
      <div lang="en">
        <div title="example" />
      </div>
      <div title="example" />
    </div>
  ),
  css: (css) => css`
    .a {
      color: red;
      [lang$='en'] {
        color: green;
        &[title$='example'] {
          color: blue;
        }
      }
    }
  `,
})

createUnitTest({
  name: 'deeply nesting attribute contains value selectors with & (no space)',
  test: styled('div', {
    color: 'red',

    '[lang*="en"]': {
      color: 'green',

      '&[title*="example"]': {
        color: 'blue',
      },
    },
  })({
    children: (
      <>
        <div lang="en">
          <div title="example" />
        </div>
        <div title="example" />
      </>
    ),
  }),
  expect: (
    <div className="a">
      <div lang="en">
        <div title="example" />
      </div>
      <div title="example" />
    </div>
  ),
  css: (css) => css`
    .a {
      color: red;
      [lang*='en'] {
        color: green;
        &[title*='example'] {
          color: blue;
        }
      }
    }
  `,
})
