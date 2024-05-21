import { CodeInline } from 'mdxts/components'

const features = [
  {
    title: 'Zero-runtime CSS in JS',
    description: 'Add styles without any runtime overhead.',
  },
  {
    title: 'Generates atomic class names',
    description: 'Optimized for minimal CSS style generation.',
  },
  {
    title: 'De-duplicates styles',
    description: 'Reuses styles for smaller bundles.',
  },
  {
    title: 'Isomorphic styling',
    description: 'Compatible with server and client rendering.',
  },
  {
    title: 'Encourages encapsulation',
    description: 'Keeps styles scoped and maintainable.',
  },
  {
    title: (
      <>
        Supports <CodeInline value="css" language="ts" /> prop with JSX pragma
      </>
    ),
    description: 'Apply styles directly to your JSX elements.',
  },
  {
    title: 'Loads styles on demand',
    description: 'Only injects styles when they are used.',
  },
  {
    title: 'Ship CSS in NPM packages',
    description: 'Distribute styles with your NPM packages.',
  },
  {
    title: (
      <>
        <CodeInline value="837" language="ts" /> bytes minified and gzipped
      </>
    ),
    description: `Tiny core size for optimal performance.`,
  },
]

export function FeaturesGrid() {
  return (
    <section className="py-12" css={{ position: 'relative', overflow: 'clip' }}>
      <div
        css={{
          position: `absolute`,
          inset: '-50%',
          filter: `blur(24rem)`,
          backgroundImage: `linear-gradient(305deg, color(display-p3 1 0 0), color(display-p3 1 0.5 0), color(display-p3 1 1 0), color(display-p3 0 1 0), color(display-p3 0 0 1), color(display-p3 0.294 0 0.51), color(display-p3 0.545 0 0.85))`,
          zIndex: -1,
        }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-white text-center mb-6">
          Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-md font-semibold text-gray-800 mb-1">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
