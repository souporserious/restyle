import { CodeBlock, RenderedHTML } from 'mdxts/components'
import { css } from 'restyle'

function Box({
  children,
  tag,
  cssProp,
}: {
  children: React.ReactNode
  tag: string
  cssProp: React.CSSProperties
}) {
  const Element = tag as any
  const [classNames, styles] = css(cssProp)
  return (
    <Element className={classNames}>
      {children}
      {styles}
    </Element>
  )
}

const sourceText = `
<Box
    tag="h1"
    cssProp={{
    paddingTop: 10,
    paddingBottom: 10,
    }}
>
    One
</Box>
<Box
    tag="p"
    cssProp={{
    padding: 5,
    paddingTop: 10,
    paddingBottom: 10,
    }}
>
    Two
</Box>
`

export default function Test() {
  return (
    <>
      <div css={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
        <CodeBlock allowErrors value={sourceText} language="tsx" />

        <RenderedHTML>
          <div>
            <Box
              tag="h1"
              cssProp={{
                paddingTop: 10,
                paddingBottom: 10,
              }}
            >
              One
            </Box>
            <Box
              tag="p"
              cssProp={{
                padding: 5,
                paddingTop: 10,
                paddingBottom: 10,
              }}
            >
              Two
            </Box>
          </div>
        </RenderedHTML>
      </div>

      {/* <div>
        <Box
          tag="h1"
          cssProp={{
            paddingTop: 10,
            paddingBottom: 10,
          }}
        >
          One
        </Box>
        <Box
          tag="p"
          cssProp={{
            padding: 5,
            paddingTop: 10,
            paddingBottom: 10,
          }}
        >
          Two
        </Box>
      </div> */}
    </>
  )
}
