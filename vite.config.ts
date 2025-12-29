import { createRequire } from 'node:module'
import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const require = createRequire(import.meta.url)

// Check if we're in dev mode before any imports
// This prevents vite-plugin-vue-devtools from being loaded in preview/build
const isDevServer = !process.argv.includes('preview') && 
                    !process.argv.includes('build') &&
                    process.env.NODE_ENV !== 'production'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  const plugins: any[] = [vue()]
  
  // Only enable Vue DevTools in development server mode
  // Skip entirely for preview and build to avoid localStorage errors
  if (isDevServer && command === 'serve' && mode === 'development') {
    try {
      // Lazy load the plugin only when needed using require
      const vueDevTools = require('vite-plugin-vue-devtools')
      const devToolsPlugin = vueDevTools.default ? vueDevTools.default() : vueDevTools()
      if (devToolsPlugin) {
        plugins.push(devToolsPlugin)
      }
    } catch {
      // Silently fail if DevTools can't be loaded
    }
  }
  
  return {
    plugins,
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
    },
    server: {
      // Ensure TypeScript files trigger HMR
      watch: {
        ignored: ['!**/src/**/*.ts', '!**/src/**/*.vue'],
      },
    },
    optimizeDeps: {
      // Ensure TypeScript config files are included in dependency optimization
      include: ['src/config/**/*.ts'],
    },
  }
})