'use client'
import { useState, useContext } from 'react'
import { css, type CSSObject } from 'restyle'

import { PreActiveContext } from './Pre'

export const CopyButton = ({
  value,
  className,
  css: cssProp,
}: {
  value: string
  className?: string
  css?: CSSObject
}) => {
  const active = useContext(PreActiveContext)
  const [copied, setCopied] = useState(false)
  const [classNames, Styles] = css({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 'inherit',
    lineHeight: 'inherit',
    padding: '0 0.2rem',
    border: 0,
    backgroundColor: 'transparent',
    cursor: 'pointer',
    ...cssProp,
  })

  if (active === false) {
    return null
  }

  return (
    <button
      className={className ? `${className} ${classNames}` : classNames}
      onClick={() => {
        navigator.clipboard.writeText(value)
        setCopied(true)
        setTimeout(() => setCopied(false), 1000)
      }}
    >
      {copied ? 'Copied!' : 'Copy'}
      <Styles />
    </button>
  )
}

/** Prefer styled helper as it ensures CSS is always attached properly. */
// export const CopyButton = styled(
//   ({
//     value,
//     className,
//     css,
//   }: {
//     value: string
//     className?: string
//     css?: CSSProp
//   }) => {
//     const active = useContext(PreActiveContext)
//     const [copied, setCopied] = useState(false)

//     if (active === false) {
//       return null
//     }

//     return (
//       <button
//         css={css}
//         className={className}
//         onClick={() => {
//           navigator.clipboard.writeText(value)
//           setCopied(true)
//           setTimeout(() => setCopied(false), 1000)
//         }}
//       >
//         {copied ? 'Copied!' : 'Copy'}
//       </button>
//     )
//   },
//   {
//     fontSize: '0.8rem',
//     color: 'dodgerblue',
//   }
// )
