import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import * as path from 'path'
import dts from 'vite-plugin-dts'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    dts({
      cleanVueFileName: true,
      include: 'src/**',
      outputDir: 'dist/types',
      staticImport: true,
    }),
  ],
  resolve: {
    alias: [
      {
        find: '@',
        replacement: '../src',
      },
    ],
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      formats: ['es', 'umd'],
      name: 'MarmosetViewer',
      fileName: (format) => `vue-marmoset-viewer.${format}.js`,
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
})
