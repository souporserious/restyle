import createMDXPlugin from '@next/mdx'
import { rehypePlugins, remarkPlugins } from 'renoun/mdx'

const withMDX = createMDXPlugin({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins,
    rehypePlugins,
  },
})

export default withMDX({
  output: 'export',
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  transpilePackages: ['restyle'],
})
