# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Spendthrift is an expense tracking application built with Next.js 16, React 19, and TypeScript. The project uses the Next.js App Router architecture.

## Common Commands

### Development
```bash
npm run dev        # Start development server (localhost:3000)
npm run build      # Build production bundle
npm start          # Start production server
npm run lint       # Run ESLint
npm run format     # Format code with Prettier
```

## Architecture

### Next.js App Router Structure
- **App Directory**: All routes and pages live in `src/app/`
- **Root Layout**: `src/app/layout.tsx` - defines metadata and global HTML structure
- **Home Page**: `src/app/page.tsx` - main landing page
- **Global Styles**: `src/app/globals.css`

### Path Aliases
- `@/*` maps to `./src/*` - use this for all imports from the src directory

### TypeScript Configuration
- Target: ES2017
- Strict mode enabled
- JSX: react-jsx (modern transform, no React import needed in components)

### Code Style
Prettier is integrated with ESLint:
- Double quotes for strings
- Semicolons required
- 2-space indentation
- 80 character line width
- ES5 trailing commas
- Arrow function parentheses always included

ESLint warnings (not errors) on Prettier violations - run `npm run format` to auto-fix.
