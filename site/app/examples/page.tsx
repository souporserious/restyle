import { css, type CSSProp } from 'restyle'

export default function Page() {
  return (
    <>
      <h2>Overriding css prop styles</h2>
      <OverridingCssPropStyles />
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
