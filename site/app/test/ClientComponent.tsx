'use client'
import { css } from 'restyle'
import { useState } from 'react'

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

export function ClientComponent() {
  const [count, setCount] = useState(0.1)
  const opacity = Math.min(Math.max(count, 0), 1).toFixed(1)
  return (
    <>
      <div>
        <button
          onClick={() => {
            setCount(count + 0.1)
          }}
        >
          +
        </button>
        <button
          onClick={() => {
            setCount(count - 0.1)
          }}
        >
          -
        </button>
        <div style={{ opacity }}>One</div>
        <Box
          tag="h1"
          cssProp={{
            paddingTop: 10,
            paddingBottom: 10,
            opacity,
          }}
        >
          One
        </Box>
        {count}
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
    </>
  )
}
