import { build } from 'esbuild'

build({
  entryPoints: ['src/main.ts'],
  bundle: true,
  minify: true,
  outfile: 'dist/main.js',
  platform: 'node',
  target: 'node20',
  format: 'esm',
  packages: 'external'
}).catch(() => process.exit(1))
