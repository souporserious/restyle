import {
  CodeBlock,
  CodeInline,
  Copyright,
  GitProviderLink,
  GitProviderLogo,
  MDXComponents,
  RenderedHTML,
} from 'mdxts/components'
import { MdxtsLogoLink } from 'mdxts/assets'
import { css } from 'restyle'

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
    <button className={classNames} onClick={onClick}>
      {children}
      {styles}
    </button>
  );
}
`

function Button({
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

      <main>
        <section className="px-12 pt-32 pb-24 bg-indigo-50">
          <div className="flex flex-col gap-8 max-w-screen-md mx-auto text-center">
            <div className="flex flex-col items-center justify-center gap-6">
              <h1 className="flex justify-start">
                <img
                  src="logo-light.png"
                  alt="restyle logo"
                  title="restyle"
                  className="h-8"
                />
              </h1>
              <h2
                className="text-4xl sm:text-6xl font-extrabold text-violet-400"
                css={{ textWrap: 'balance', lineHeight: 1.2 }}
              >
                Zero Config <br />
                CSS Styles for React
              </h2>
            </div>
            <p
              className="text-xl text-violet-900"
              css={{ textWrap: 'balance' }}
            >
              The simplest way to add CSS to React.
              <br />
              No build configuration required.
            </p>
            <div className="flex gap-4 m-auto">
              <CodeInline
                allowCopy
                value={`npm install restyle`}
                language="bash"
                paddingX="0.8em"
                paddingY="0.5em"
              />
              <GitProviderLink className="flex items-center gap-2 px-3 py-2 text-white bg-gray-800 rounded-md">
                <GitProviderLogo />
              </GitProviderLink>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 py-20 gap-8">
            <div className="flex flex-col gap-4">
              <h3 className="text-2xl font-extrabold text-violet-400">Input</h3>
              <CodeBlock
                value={`${exampleCode}\nexport default function Example() {\nreturn <Button backgroundColor="tomato" onClick={() => alert()}>Click me!</Button>\n}`}
                language="tsx"
              />
            </div>
            <div className="flex flex-col gap-4">
              <h3 className="text-2xl font-extrabold text-violet-400">
                Output
              </h3>
              <RenderedHTML>
                <Button backgroundColor="tomato">Click me!</Button>
              </RenderedHTML>
            </div>
          </div>
        </section>

        <FeaturesGrid />

        <section className="prose max-w-screen-md mx-auto px-2 py-24 text-lg">
          <Examples
            components={
              {
                h2: (props) => (
                  <h2
                    {...props}
                    className="text-2xl sm:text-3xltext-3xl font-extrabold text-violet-400"
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
      </main>

      <footer
        className="text-center p-4 bg-slate-50"
        css={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'end',
          gap: '1rem',
        }}
      >
        <div css={{ display: 'flex', alignItems: 'baseline', gap: '0.5ch' }}>
          <span className="text-sky-800">Built with</span>{' '}
          <MdxtsLogoLink
            className="text-violet-500"
            style={{ height: '0.8rem' }}
          />
        </div>
        <span
          className="text-sky-800"
          css={{ display: 'inline-flex', gap: '0.5ch' }}
        >
          <Copyright showLabel={false} />
          <a
            href="https://souporserious.com/"
            rel="noopener"
            target="_blank"
            className="text-violet-500"
          >
            souporserious
          </a>
        </span>
      </footer>
    </>
  )
}
