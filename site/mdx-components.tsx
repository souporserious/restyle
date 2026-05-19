import { CodeBlock } from 'renoun/components'
import type { MDXComponents } from 'renoun/mdx'
import type { ComponentProps } from 'react'

function InlineCode({ className, ...props }: ComponentProps<'code'>) {
  return (
    <code
      {...props}
      className={[
        'rounded-md bg-gray-900 px-2 py-1 font-mono font-bold text-white',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    />
  )
}

function HeadingTwo({ className, ...props }: ComponentProps<'h2'>) {
  return (
    <h2
      {...props}
      className={[
        'text-2xl sm:text-3xl font-extrabold text-violet-400',
        '[&_a]:text-inherit [&_a]:no-underline',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    />
  )
}

function HeadingThree({ className, ...props }: ComponentProps<'h3'>) {
  return (
    <h3
      {...props}
      className={[
        'text-2xl font-semibold text-cyan-600',
        '[&_a]:text-inherit [&_a]:no-underline',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    />
  )
}

export function useMDXComponents() {
  return {
    code: InlineCode,
    h2: HeadingTwo,
    h3: HeadingThree,
    CodeBlock: (props) => {
      return <CodeBlock allowErrors {...props} />
    },
  } satisfies MDXComponents
}
