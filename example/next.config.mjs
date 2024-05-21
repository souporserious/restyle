import { createMdxtsPlugin } from 'mdxts/next'

const withMdxtsPlugin = createMdxtsPlugin({
  theme: 'houston',
  gitSource: 'https://github.com/souporserious/restyle',
  siteUrl: 'https://restyle.vercel.app/',
})

export default withMdxtsPlugin({
  output: 'export',
  typescript: {
    ignoreBuildErrors: true,
  },
})
