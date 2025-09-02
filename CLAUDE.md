# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Telegram Web App built with React + Vite, utilizing the `@telegram-apps/telegram-ui` library for Telegram-specific UI components. The project follows a minimal React setup with modern tooling.

## Development Commands

### Core Commands
- `npm run dev` - Start the development server with HMR
- `npm run build` - Build for production
- `npm run lint` - Run ESLint to check code quality
- `npm run preview` - Preview the production build locally

### Project Structure
- `src/` - Main source code
  - `main.jsx` - Application entry point
  - `App.jsx` - Root React component using Telegram UI AppRoot
  - `index.css` - Global styles
  - `App.css` - Component-specific styles
  - `assets/` - Static assets (React logo, etc.)
- `public/` - Static files served by Vite (contains vite.svg)
- `vite.config.js` - Vite configuration with React plugin
- `eslint.config.js` - ESLint configuration with React hooks and refresh plugins

## Key Dependencies

- **React 18** - Core framework
- **@telegram-apps/telegram-ui** - Telegram Web App UI components
- **Vite** - Build tool and dev server
- **ESLint** - Code linting with React-specific rules

## Architecture Notes

- Uses modern React 18 with StrictMode enabled
- Integrates Telegram Web App UI through `AppRoot` component
- Follows Vite's React template structure
- ESLint configured with React Hooks and React Refresh plugins
- Custom ESLint rule: `no-unused-vars` with pattern `^[A-Z_]` to ignore uppercase variables

## Development Workflow

1. Run `npm run dev` to start development
2. Use `npm run lint` to check code quality before commits  
3. Build with `npm run build` for production deployment
4. Preview builds with `npm run preview`

No test framework is currently configured in this project.


