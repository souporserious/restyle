import {
  CodeBlock,
  CodeInline,
  parseCodeProps,
  parsePreProps,
} from 'renoun/components'
import type { MDXComponents } from 'renoun/mdx'

export function useMDXComponents() {
  return {
    code: (props) => {
      return <CodeInline {...parseCodeProps(props)} />
    },
    pre: (props) => {
      return <CodeBlock allowErrors {...parsePreProps(props)} />
    },
  } satisfies MDXComponents
}
