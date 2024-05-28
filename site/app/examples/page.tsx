import { css, styled, type CSSProp } from 'restyle'

export default function Page() {
  return (
    <>
      <h2>Overriding css prop styles</h2>
      <OverridingCssPropStyles />

      <h2>Precedence</h2>
      <PrecedenceExample />
    </>
  )
}

function Button({
  children,
  css: cssProp,
}: {
  children: React.ReactNode
  css?: CSSProp
}) {
  const [classNames, styles] = css({
    padding: '0.5rem 1rem',
    border: 'none',
    backgroundColor: 'dodgerblue',
    color: 'white',
    ':hover': {
      backgroundColor: 'royalblue',
    },
    ...cssProp,
  })
  return (
    <>
      <button className={classNames}>{children}</button>
      {styles}
    </>
  )
}

/** The order of rules matters and the last key/value wins. */
function OverridingCssPropStyles() {
  return (
    <Button
      css={{
        backgroundColor: 'tomato',
        ':hover': {
          backgroundColor: 'red',
        },
      }}
    >
      Click me
    </Button>
  )
}

// Don't do this
// function OverridingCssStyles() {
//   const [classNames, styles] = css({ backgroundColor: 'tomato' })
//   return (
//     <>
//       <Button className={classNames}>Click me</Button>
//       {styles}
//     </>
//   )
// }

/**
 * Order of the values themeselves does not matter since these are based on precedence from
 * low, medium, and high. The following example will have a red border and a larger blue left border.
 */
const PrecedenceExample = styled('div', {
  height: '1rem',
  borderLeftWidth: '3px',
  borderLeft: '2px solid blue',
  border: '1px solid red',
})
