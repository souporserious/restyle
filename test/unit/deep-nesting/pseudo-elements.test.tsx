/**
 * CSS Pseudo-elements
 * @see https://www.w3schools.com/cssref/css_ref_pseudo_elements.php
 *
 * note that because there are a lot of these and they're all very similar, I'm not going to test them all
 * I'll just test a subset of them that should cover all the syntaxes
 *
 * ::before
 * ::after
 * :before
 * :after
 */

import { createNestingTest } from '../../createNestingTest.js'

createNestingTest({
  name: '::before pseudo-element',
  fails: { asPassed: true },
  css: {
    backgroundColor: 'red',
    '::before': {
      content: '"before"',
      backgroundColor: 'blue',
      '::before': {
        content: '"nested"',
        backgroundColor: 'red',
      },
    },
  },
  children: <p>Test</p>,
})

createNestingTest({
  name: '::after pseudo-element',
  fails: { asPassed: true },
  css: {
    backgroundColor: 'red',
    '::after': {
      content: '"after"',
      backgroundColor: 'blue',
      '::after': {
        content: '"nested"',
        backgroundColor: 'red',
      },
    },
  },
  children: <p>Test</p>,
})

createNestingTest({
  name: ':before pseudo-element',
  fails: { asPassed: true },
  css: {
    backgroundColor: 'red',
    ':before': {
      content: '"before"',
      backgroundColor: 'blue',
      ':before': {
        content: '"nested"',
        backgroundColor: 'red',
      },
    },
  },
  children: <p>Test</p>,
})

createNestingTest({
  name: ':after pseudo-element',
  fails: { asPassed: true },
  css: {
    backgroundColor: 'red',
    ':after': {
      content: '"after"',
      backgroundColor: 'blue',
      ':after': {
        content: '"nested"',
        backgroundColor: 'red',
      },
    },
  },
  children: <p>Test</p>,
})
