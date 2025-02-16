import path from 'node:path';
// vite.config.ts
import typescript from '@rollup/plugin-typescript';
import {typescriptPaths} from 'rollup-plugin-typescript-paths';
import {defineConfig} from 'vite';
import {coverageConfigDefaults} from 'vitest/dist/config.js';

const __dirname = path.resolve();

export default defineConfig({
  plugins: [typescript()],
  resolve: {
    alias: [
      {
        find: '@',
        replacement: path.resolve(__dirname, './src'),
      },
    ],
  },
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: [...coverageConfigDefaults.exclude, 'src/type'],
    },
  },
  build: {
    manifest: true,
    minify: true,
    reportCompressedSize: true,
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      fileName: 'index',
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: ['zod'],
      plugins: [
        typescriptPaths({
          preserveExtensions: true,
        }),
        typescript({
          sourceMap: false,
          declaration: true,
          outDir: 'dist',
        }),
      ],
    },
  },
});
