// This is the config file used to compile the module that will be published to NPM.
const path = require('path')
const { defineConfig } = require('vite')
import banner from 'vite-plugin-banner'
import pkg from './package.json'

// Now in UTC time. Format time as YYYY-MM-DDTHH:mm:ss.sssZ.
const now = new Date().toISOString()

module.exports = defineConfig({
    build: {
        lib: {
            entry: path.resolve(__dirname, 'lib/vite-module-builder-w-ghpages-npm-template.ts'),
            name: 'vite-module-builder-w-ghpages-npm-template',
            formats: ['es', 'cjs', 'umd'], // Specify the formats you want to build: ['es', 'cjs', 'umd'] - if you remove cjs or umd, it will not be built and you must remove references to it in the package.json file.
            fileName: (format) => `vite-module-builder-w-ghpages-npm-template.${format}.js`,
        },
        minify: false,
        outDir: 'dist',
        emptyOutDir: true,
    },
    plugins: [
        banner(`/**
 * name: ${pkg.name}
 * version: v${pkg.version}
 * description: ${pkg.description}
 * author: ${pkg.author}
 * repository: ${pkg.repository.url}
 * build date: ${new Date().toISOString()}
 */`),
    ],
})
