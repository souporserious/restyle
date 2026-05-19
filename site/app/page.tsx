import {
  CodeBlock,
  Command,
  Copyright,
  Logo,
} from 'renoun/components'
import type { MDXComponents } from 'renoun/mdx'
import type { ComponentProps } from 'react'

import Examples from './Examples.mdx'
import { FeaturesGrid } from './FeaturesGrid'

const inputCode = `
import { styled } from 'restyle'

const Button = styled('button', {
  padding: '0.5rem 1rem',
  borderRadius: '4px',
  backgroundColor: 'blue',
  color: 'white',
})

export default function Page() {
  return (
    <Button
      css={{
        paddingInline: '0.8rem',
        backgroundColor: 'pink',
      }}
      onClick={() => alert()}
    >
      Click me!
    </Button>
  )
}
`

const outputCode = `
<html>
  <head>
    <style data-precedence="rsl" data-href="xwci5pk">
      .x6vw34k {
        padding: 0.5rem 1rem;
      }
      .x1xg4490 {
        border-radius: 4px;
      }
    </style>
    <style data-precedence="rsm" data-href="x1pc7fh0">
      .x1f9e8ue {
        padding-inline: 0.8rem;
      }
    </style>
    <style data-precedence="rsh" data-href="xbg6jus">
      .x1yju78o {
        background-color: pink;
      }
      .xpzun7g {
        color: white;
      }
    </style>
  </head>
  <body>
    <button class="x6vw34k x1xg4490 x1yju78o xpzun7g x1f9e8ue">
      Click me!
    </button>
  </body>
</html>
`

function InstallCommandContainer({
  className,
  style,
  ...props
}: ComponentProps<'div'>) {
  return (
    <div
      {...props}
      className={[
        'relative inline-flex rounded-md font-mono text-sm sm:text-base shadow-sm',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={{ ...style, backgroundColor: '#111827', color: 'white' }}
    />
  )
}

function InstallCommandTabs({
  className,
  ...props
}: ComponentProps<'div'>) {
  return (
    <div
      {...props}
      className={[
        'absolute inset-y-0 right-3 z-10 flex items-center text-gray-200',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    />
  )
}

function InstallCommandTabButton() {
  return null
}

function InstallCommandTabPanel({
  hidden,
  className,
  style,
  ...props
}: ComponentProps<'pre'>) {
  const command = (props as { 'data-command'?: string })['data-command']

  return (
    <pre
      {...props}
      hidden={command === 'npm' ? undefined : hidden}
      className={[
        'm-0 rounded-md py-3 pl-5 pr-14 leading-normal',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={{ ...style, backgroundColor: '#111827' }}
    />
  )
}

export default function Page() {
  return (
    <>
      <main>
        <section className="px-4 sm:px-12 pt-12 sm:pt-32 pb-24 bg-indigo-50">
          <div className="flex flex-col max-w-screen-md mx-auto text-center">
            <div className="flex flex-col items-center justify-center mb-4 sm:mb-6 gap-6">
              <h1 className="flex justify-start">
                <img
                  src="logo-light.png"
                  alt="restyle logo"
                  title="restyle"
                  className="h-8"
                />
              </h1>
              <h2
                className="text-3xl sm:text-6xl font-extrabold text-violet-400"
                css={{ textWrap: 'balance', lineHeight: 1.2 }}
              >
                Zero Config <br />
                CSS for React
              </h2>
            </div>
            <p
              className="text-lg sm:text-xl leading-relaxed text-violet-900 mb-8 sm:mb-10"
              css={{ textWrap: 'balance' }}
            >
              The easiest way to style your React components.
              <br />
              No build configuration required.
            </p>
            <div className="flex gap-4 m-auto">
              <Command
                variant="install"
                shouldValidate={false}
                components={{
                  Container: InstallCommandContainer,
                  Tabs: InstallCommandTabs,
                  TabButton: InstallCommandTabButton,
                  TabPanel: InstallCommandTabPanel,
                  CopyButton: {
                    css: {
                      backgroundColor: 'transparent',
                      color: '#e5e7eb',
                    },
                  },
                }}
              >
                restyle
              </Command>
              <a
                href="https://github.com/souporserious/restyle"
                rel="noopener"
                target="_blank"
                className="flex items-center gap-2 px-3 py-2 text-white bg-gray-800 rounded-md"
                aria-label="View restyle on GitHub"
              >
                <Logo
                  variant="gitHost"
                  source="https://github.com/souporserious/restyle"
                />
              </a>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 py-20 gap-8">
            <div className="flex flex-col gap-4">
              <h3 className="text-2xl font-extrabold text-violet-400">Input</h3>
              <CodeBlock language="tsx">{inputCode}</CodeBlock>
            </div>
            <div className="flex flex-col gap-4">
              <h3 className="text-2xl font-extrabold text-violet-400">
                Output
              </h3>
              <CodeBlock language="html">{outputCode}</CodeBlock>
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
                    className="text-2xl sm:text-3xl font-extrabold text-violet-400 [&_a]:text-inherit [&_a]:no-underline"
                  />
                ),
                h3: (props) => (
                  <h3
                    {...props}
                    className="text-2xl font-semibold text-cyan-600 [&_a]:text-inherit [&_a]:no-underline"
                  />
                ),
              } satisfies MDXComponents
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
          <a href="https://renoun.dev" className="text-violet-500">
            renoun
          </a>
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
