import { createRequire } from 'node:module'
import { fileURLToPath, URL } from 'node:url'
import { copyFileSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

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
    plugins: [
      ...plugins,
      // Plugin to copy mailer.html to dist during build and fix CSS paths
      {
        name: 'copy-mailer-html',
        closeBundle() {
          if (command === 'build') {
            const rootDir = fileURLToPath(new URL('./', import.meta.url))
            const sourceFile = resolve(rootDir, 'mailer.html')
            const destFile = resolve(rootDir, 'dist', 'mailer.html')
            const indexHtmlFile = resolve(rootDir, 'dist', 'index.html')
            
            try {
              // Read the built index.html to find the CSS file path
              const indexHtml = readFileSync(indexHtmlFile, 'utf-8')
              const cssMatch = indexHtml.match(/<link[^>]+href="([^"]+\.css)"[^>]*>/)
              
              if (!cssMatch) {
                console.warn('Could not find CSS file in index.html')
                copyFileSync(sourceFile, destFile)
                return
              }
              
              const cssPath = cssMatch[1]
              
              // Read mailer.html and replace CSS links and i18n script
              let mailerHtml = readFileSync(sourceFile, 'utf-8')
              
              // Replace the CSS links with the bundled CSS file
              mailerHtml = mailerHtml.replace(
                /<link rel="stylesheet" href="\/src\/assets\/(base|main)\.css">/g,
                ''
              )
              
              // Insert the bundled CSS link before the closing </head> tag
              mailerHtml = mailerHtml.replace(
                '</head>',
                `    <link rel="stylesheet" crossorigin href="${cssPath}">\n  </head>`
              )
              
              // Write the updated mailer.html
              writeFileSync(destFile, mailerHtml)
              console.log('✓ Copied and updated mailer.html to dist with correct CSS path')
            } catch (error) {
              console.error('Failed to copy/update mailer.html:', error)
            }
          }
        },
      },
    ],
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