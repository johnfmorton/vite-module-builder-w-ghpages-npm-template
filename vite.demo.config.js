// This is the config file used to compile demo site that will be published to GitHub Pages.
import { defineConfig } from 'vite'
const path = require('path')

export default defineConfig({
    root: 'demo', // Set the root to the demo directory
    base: process.env.NODE_ENV === 'production'
        ? 'https://johnfmorton.github.io/vite-module-builder-w-ghpages-npm-template/' // for production/GitHub Pages
        : '/', // for development
    build: {
        outDir: '../_site', // This is directory where the demo site will be built. It will be published to GitHub Pages. It is not the same as the directory where the module will be built. It also is in the .gitignore file so you will not see it in the repo.
        emptyOutDir: true,
        minify: true,
    },
})
