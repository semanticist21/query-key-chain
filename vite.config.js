// vite.config.ts
import { defineConfig } from "vite";

import typescript from "@rollup/plugin-typescript";
import path from "path";
import { typescriptPaths } from "rollup-plugin-typescript-paths";

const __dirname = path.resolve();

export default defineConfig({
  plugins: [typescript()],
  resolve: {
    alias: [
      {
        find: "@",
        replacement: path.resolve(__dirname, "./src"),
      },
    ],
  },
  build: {
    manifest: true,
    minify: true,
    reportCompressedSize: true,
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      fileName: "index",
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: [],
      plugins: [
        typescriptPaths({
          preserveExtensions: true,
        }),
        typescript({
          sourceMap: false,
          declaration: true,
          outDir: "dist",
        }),
      ],
    },
  },
});
