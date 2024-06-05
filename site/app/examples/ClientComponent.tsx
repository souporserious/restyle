'use client'
import { styled } from 'restyle'
import { useState } from 'react'

const Button = styled('button', {
  color: 'dodgerblue',
  fontSize: '2rem',
})

export function ClientComponent() {
  const [on, setOn] = useState(false)
  return (
    <Button
      css={{
        color: on ? 'green' : 'red',
      }}
      onClick={() => setOn(!on)}
    >
      {on ? 'On' : 'Off'}
    </Button>
  )
}
