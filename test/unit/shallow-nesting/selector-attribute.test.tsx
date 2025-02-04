/**
 * CSS Attribute Selectors
 * @see https://www.w3schools.com/cssref/css_selectors.php#:~:text=CSS%20Attribute%20Selectors
 */

import { createNestingTest } from '../../createNestingTest.js'

createNestingTest({
  name: 'attribute selector',
  css: {
    backgroundColor: 'red',

    '[lang]': {
      backgroundColor: 'blue',
    },
  },
  children: (This) => (
    <This lang="en">
      <div lang="en" />
    </This>
  ),
})

createNestingTest({
  name: 'attribute value selector',
  css: {
    backgroundColor: 'red',

    '[lang="it"]': {
      backgroundColor: 'blue',
    },
  },
  children: (This) => (
    <This lang="it">
      <div lang="it" />
    </This>
  ),
})

createNestingTest({
  name: 'attribute contains word selector',
  css: {
    backgroundColor: 'red',

    '[title~="flower"]': {
      backgroundColor: 'blue',
    },
  },
  children: (This) => (
    <This title="beautiful flower">
      <div title="beautiful flower" />
    </This>
  ),
})

createNestingTest({
  name: 'attribute equal to or starts with value selector',
  css: {
    backgroundColor: 'red',

    '[lang|="en"]': {
      backgroundColor: 'blue',
    },
  },
  children: (This) => (
    <>
      <This lang="en-US">
        <div lang="en-US" />
      </This>
      <This lang="en">
        <div lang="en" />
      </This>
    </>
  ),
})

createNestingTest({
  name: 'attribute begins with value selector',
  css: {
    backgroundColor: 'red',

    '[href^="https"]': {
      backgroundColor: 'blue',
    },
  },
  children: <a href="https://example.com" />,
})

createNestingTest({
  name: 'attribute ends with value selector',
  css: {
    backgroundColor: 'red',

    '[href$=".pdf"]': {
      backgroundColor: 'blue',
    },
  },
  children: (
    <>
      <a href="document.pdf" />
      <a href="document.png" />
    </>
  ),
})

createNestingTest({
  name: 'attribute contains value selector',
  css: {
    backgroundColor: 'red',

    '[href*="w3schools"]': {
      backgroundColor: 'blue',
    },
  },
  children: (
    <>
      <a href="https://www.w3schools.com" />
      <a href="https://www.example.com" />
    </>
  ),
})
