import { CodeBlock } from '../components/CodeBlock'

export function CodeBlockExamples() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        maxWidth: 400,
        gap: '1rem',
      }}
    >
      <CodeBlock value="const a = 'a';" />
      <CodeBlock value="const b = 2;" />
    </div>
  )
}
