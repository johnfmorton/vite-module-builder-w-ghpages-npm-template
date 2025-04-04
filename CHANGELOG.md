# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.0.0] - 2025-04-04

- Updated the demo site to use the latest version of Tailwind CSS (^4.1.1)
- Major rewrite to no longer require the `dist` directory to be in the repo
- Rewritten README
- Updated the directory for the demo site from "demo" to "\_site"
- Changed the TS target from "ESNext" to "ES6" in the tsconfig.json file.
- Updated GitHub workflows to use the new directory name and use updated GitHub
  Actions.
- Updated demo page styles for small screens.
- tsconfig.json: Added `lib` property to include `DOM.Iterable`.
- tsconfig.json: Added `forceConsistentCasingInFileNames` property set to
  `true`.
- Added a note about Tailwind CSS not being included in the published module to
  the README.md file.
- `project-setup` has better error correction
- `project-setup` now asks for GitHub username for better customization.
- Demo page CSS works better on iOS

## [1.0.0] - 2023-03-04

- Cleaned up documentation.
- Publishing version 1 after testing the workflow.

## [1.0.0-alpha.1] - 2023-03-01

### Added

- Added `CHANGELOG.md` file. Sorry for the delay on this one, if you've been
  watching this as it has gone through development. I'll try to keep this up to
  date from now on. We're still in an alpha state, so breaking changes will
  still happen, but I will document them here.
