import esbuild from 'esbuild';

esbuild.build({
  entryPoints: ['server/index.ts'],
  bundle: true,
  platform: 'node',
  packages: 'external',
  format: 'esm',
  outfile: 'dist/index.js',
}).catch(() => process.exit(1));
