import React from 'react'
import { css } from 'restyle'

export function Button({
  children,
  padding = '0.5rem 1rem',
  borderRadius = '4px',
  backgroundColor = 'dodgerblue',
  color = 'white',
  onClick,
}: {
  children: React.ReactNode
  padding?: string
  borderRadius?: string
  backgroundColor?: string
  color?: string
  onClick?: () => void
}) {
  const [classNames, styles] = css({
    fontWeight: 'bold',
    border: 'none',
    padding,
    borderRadius,
    backgroundColor,
    color,
  })

  return (
    <>
      <button className={classNames} onClick={onClick}>
        {children}
      </button>
      {styles}
    </>
  )
}
