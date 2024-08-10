'use client'
import { styled } from 'restyle'
import { useState } from 'react'

const Button = styled('button', {
  color: 'dodgerblue',
  fontSize: '2rem',
})

export function ClientComponent() {
  const [hover, setHover] = useState(false)
  const [active, setActive] = useState(false)

  return (
    <Button
      css={{
        backgroundColor: hover ? 'lightblue' : 'white',
        color: active ? 'green' : 'red',
      }}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
      onClick={() => setActive(!active)}
    >
      {active ? 'On' : 'Off'}
    </Button>
  )
}
