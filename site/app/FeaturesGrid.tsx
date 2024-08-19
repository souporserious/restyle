const features = [
  {
    title: 'Zero runtime',
    description: 'No client runtime when server rendered.',
    color: 'text-indigo-500',
  },
  {
    title: 'Atomic class names',
    description: 'Optimized for minimal CSS generation.',
    color: 'text-green-600',
  },
  {
    title: 'Suspense friendly',
    description: 'Works with Suspense and streaming.',
    color: 'text-yellow-600',
  },
  {
    title: 'Isomorphic styling',
    description: 'Compatible with server and client rendering.',
    color: 'text-blue-500',
  },
  {
    title: 'Encourages encapsulation',
    description: 'Keep styles colocated and maintainable.',
    color: 'text-emerald-500',
  },
  {
    title: (
      <>
        Supports <code className="px-1 rounded bg-red-50">css</code> prop
      </>
    ),
    description: 'Apply styles directly to your JSX elements.',
    color: 'text-red-500',
  },
  {
    title: 'Loads styles on demand',
    description: 'Only injects styles when they are used.',
    color: 'text-cyan-500',
  },
  {
    title: 'Ship CSS in NPM packages',
    description: 'Distribute styles with your NPM packages.',
    color: 'text-lime-500',
  },
  {
    title: (
      <>
        <code className="px-1 rounded bg-pink-50">2kb</code> minified & gzipped
      </>
    ),
    description: `Tiny core size for optimal performance.`,
    color: 'text-pink-500',
  },
] as const

export function FeaturesGrid() {
  return (
    <section
      className="pt-24 pb-36"
      css={{ position: 'relative', overflow: 'clip' }}
    >
      <div
        className="bg-amber-500"
        css={{
          position: `absolute`,
          inset: '-50%',
          zIndex: -1,
          '@media (color-gamut: p3)': {
            filter: `blur(12rem)`,
            backgroundImage: `linear-gradient(305deg, color(display-p3 1 0 0), color(display-p3 1 0.5 0), color(display-p3 1 1 0), color(display-p3 0 1 0), color(display-p3 0 0 1), color(display-p3 0.294 0 0.51), color(display-p3 0.545 0 0.85))`,
          },
        }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white text-center mb-12">
          Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col px-8 py-12 gap-4 bg-white text-center"
            >
              <h3 className={`text-xl font-semibold ${feature.color}`}>
                {feature.title}
              </h3>
              <p className="text-gray-500">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
