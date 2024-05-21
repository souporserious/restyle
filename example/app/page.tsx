import { CodeBlock, GitProviderLink } from 'mdxts/components'
import { MdxtsLogoLink } from 'mdxts/assets'

import { Button } from './Button'
import { FeaturesGrid } from './FeaturesGrid'

const exampleCode = `
import React from 'react'
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
          This package requires{' '}
          <a
            className="font-bold"
            href="https://react.dev/reference/react-dom/components/style"
            target="_blank"
            rel="noopener noreferrer"
          >
            <strong>React Canary</strong>
          </a>
          .
        </p>
      </header>

      <main className="flex flex-col min-h-screen max-w-screen-xl p-8 mx-auto gap-8">
        <div className="flex-1 grid grid-cols-1 md:grid-cols-8 items-center gap-16">
          <div className="md:col-span-4 flex flex-col justify-center w-[max-content] space-y-6">
            <div className="space-y-8">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                <img
                  src="logo-light.png"
                  alt="restyle logo"
                  title="restyle"
                  className="w-48"
                />
              </h1>
              <p className="text-4xl font-bold leading-snug">
                A <mark className="bg-yellow-300">really good</mark> <br />
                <mark className="bg-yellow-300">CSS-in-JS</mark> library
                <br />
                for React
              </p>
            </div>
            <div className="flex gap-4">
              <CodeBlock value="npm install restyle" language="bash" />
              <GitProviderLink className="flex items-center gap-2 px-6 py-2 font-bold tracking-wider text-white bg-gray-800 rounded-md">
                GitHub
              </GitProviderLink>
            </div>
          </div>
          <div className="md:col-span-4 flex flex-col gap-6">
            <CodeBlock value={exampleCode} language="tsx" />
            <div className="grid grid-cols-3 gap-4">
              <Button>Primary</Button>
              <Button backgroundColor="#ff6347">Danger</Button>
              <Button backgroundColor="#2f9a2f">Success</Button>
            </div>
          </div>
        </div>
      </main>

      <FeaturesGrid />

      <footer className="flex items-baseline justify-center p-4 gap-2">
        <span className="text-gray-500 dark:text-gray-400">Built with</span>
        <MdxtsLogoLink className="h-3" style={{ fill: 'black' }} />
      </footer>
    </>
  )
}
