import {
  CodeBlock,
  CodeInline,
  GitProviderLink,
  MDXComponents,
} from 'mdxts/components'
import { Copyright } from 'mdxts/components/Copyright'
import { MdxtsLogoLink } from 'mdxts/assets'

import Examples from './Examples.mdx'
import { FeaturesGrid } from './FeaturesGrid'

const exampleCode = `
import { css } from 'restyle'

export function Button({
  children,
  padding = '0.5rem 1rem',
  borderRadius = '4px',
  backgroundColor = 'dodgerblue',
  color = 'white',
  onClick,
}) {
  const [classNames, styles] = css({
    border: 'none',
    padding,
    borderRadius,
    backgroundColor,
    color,
  });

  return (
    <>
      <button className={classNames} onClick={onClick}>
        {children}
      </button>
      {styles}
    </>
  );
}
`

export default function Page() {
  return (
    <>
      <header className="flex items-center justify-center p-4 bg-yellow-100">
        <p className="text-yellow-800">
          This library requires a{' '}
          <a
            className="font-bold"
            href="https://react.dev/community/versioning-policy#all-release-channels"
            target="_blank"
            rel="noopener noreferrer"
          >
            <strong>React Canary</strong>
          </a>{' '}
          version since it utilizes the new{' '}
          <a
            className="font-bold"
            href="https://react.dev/reference/react-dom/components/style#rendering-an-inline-css-stylesheet"
            target="_blank"
            rel="noopener noreferrer"
          >
            style hoisting feature
          </a>
          .
        </p>
      </header>

      <main className="flex flex-col min-h-screen max-w-screen-xl p-8 mx-auto gap-8">
        <div className="flex-1 grid grid-cols-1 md:grid-cols-8 items-center gap-16">
          <div className="md:col-span-4 flex flex-col justify-center space-y-6">
            <div className="space-y-8">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                <img
                  src="logo-light.png"
                  alt="restyle logo"
                  title="restyle"
                  className="w-40"
                />
              </h1>
              <p className="text-4xl font-bold leading-snug">
                A <mark className="bg-amber-200">really good</mark> <br />
                <mark className="bg-amber-200">CSS-in-JS</mark> library
                <br />
                for React
              </p>
            </div>
            <div className="flex gap-4">
              <CodeInline
                allowCopy
                value={`npm install restyle`}
                language="bash"
                paddingX="0.8em"
                paddingY="0.5em"
              />
              <GitProviderLink className="flex items-center gap-2 px-6 py-2 font-bold tracking-wider text-white bg-gray-800 rounded-md">
                GitHub
              </GitProviderLink>
            </div>
          </div>
          <CodeBlock
            value={exampleCode}
            language="tsx"
            highlightedLines="1,11-17,21,24"
            className={{ container: 'md:col-span-4' }}
          />
        </div>
      </main>

      <FeaturesGrid />

      <section className="prose max-w-screen-md mx-auto px-2 py-24 text-lg">
        <Examples
          components={
            {
              h2: (props) => (
                <h2
                  {...props}
                  className="text-3xl font-extrabold text-violet-400"
                />
              ),
              h3: (props) => (
                <h3
                  {...props}
                  className="text-2xl font-semibold text-cyan-600"
                />
              ),
              pre: (props) => <MDXComponents.pre allowErrors {...props} />,
            } satisfies MDXComponents as any
          }
        />
      </section>

      <footer
        className="text-center p-4 bg-slate-50"
        css={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'end',
          gap: '1.5rem',
        }}
      >
        <div css={{ display: 'flex', alignItems: 'baseline', gap: '0.5ch' }}>
          <span className="text-gray-500 dark:text-gray-400">Built with</span>{' '}
          <MdxtsLogoLink style={{ height: '0.8rem' }} />
        </div>
        <span
          className="text-gray-400"
          css={{ display: 'inline-flex', gap: '0.5ch' }}
        >
          <Copyright showLabel={false} />
          <a
            href="https://souporserious.com/"
            rel="noopener"
            target="_blank"
            className="text-gray-700"
          >
            souporserious
          </a>
        </span>
      </footer>
    </>
  )
}
