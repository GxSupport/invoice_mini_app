# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Telegram Web App built with React + TypeScript + Vite, utilizing the `@telegram-apps/telegram-ui` and `@telegram-apps/sdk-react` libraries for Telegram-specific UI components and SDK integration. The project includes authentication flow, routing, and cloud storage integration.

## Development Commands

### Core Commands
- `npm run dev` - Start the development server with HMR
- `npm run build` - Build for production
- `npm run lint` - Run ESLint to check code quality
- `npm run preview` - Preview the production build locally

## Key Dependencies

- **React 18** - Core framework with TypeScript support
- **@telegram-apps/telegram-ui** - Telegram Web App UI components
- **@telegram-apps/sdk-react** - Telegram SDK for React with hooks
- **react-router-dom** - Client-side routing
- **axios** - HTTP client for API calls
- **eruda** - Mobile debugging console
- **Vite** - Build tool and dev server with TypeScript paths support
- **ESLint** - Code linting with React-specific rules

## Architecture Overview

### Application Structure
- `src/main.jsx` - Entry point with Telegram SDK initialization and environment mocking
- `src/components/Root.tsx` - Root component wrapper
- `src/components/App.tsx` - Main app component with routing and theme management
- `src/navigation/routes.tsx` - Route definitions and components mapping

### Authentication System
- **Authentication Hook**: `src/hooks/useAuth.ts` - Manages auth state with dual storage (CloudStorage + localStorage fallback)
- **API Layer**: `src/api/auth.ts` - Authentication API calls (login, register, verify, profile, logout)
- **Auth Guard**: `src/components/AuthGuard.tsx` - Route protection component
- **User Verification**: Built-in Telegram user verification via `initRawData`

### Key Features
- **Dual Storage Strategy**: Uses Telegram CloudStorage in production, localStorage in development with automatic fallback
- **Theme Integration**: Automatic dark/light theme detection from Telegram
- **Platform Adaptation**: iOS-specific styling for macOS/iOS platforms
- **Environment Mocking**: Development environment mocking for non-Telegram contexts
- **TypeScript Paths**: `@/*` alias configured for clean imports

### Project Structure
- `src/components/` - Reusable UI components
- `src/pages/` - Route-specific page components
- `src/api/` - API service layer
- `src/hooks/` - Custom React hooks
- `src/types/` - TypeScript type definitions
- `src/css/` - CSS utilities and helpers
- `src/navigation/` - Routing configuration

## Configuration

### TypeScript Setup
- Path aliases configured (`@/*` → `./src/*`)
- Strict mode enabled with comprehensive type checking
- Vite integration with `vite-tsconfig-paths`

### ESLint Configuration
- React Hooks and React Refresh plugins enabled
- Custom rule: `no-unused-vars` with pattern `^[A-Z_]` to ignore uppercase constants
- Modern ESLint flat config format

### Vite Configuration
- React plugin with TypeScript support
- Path resolution with `@` alias pointing to `/src`
- `vite-tsconfig-paths` plugin for TypeScript path mapping

## Development Workflow

1. Run `npm run dev` to start development server
2. Use `npm run lint` to check code quality before commits
3. Build with `npm run build` for production deployment
4. Preview builds with `npm run preview`

No test framework is currently configured in this project.

## Design Patterns & UI Guidelines
### Understanding AppRoot Theming Mechanism
- The AppRoot component is pivotal in implementing a dynamic theming system within your application. It employs a sophisticated approach to CSS variables and React context to seamlessly adapt to various themes and platforms. This section delves into the inner workings of this system, explaining how themes are managed and applied internally.

### CSS Variables: The Backbone of Theming
- At the heart of the AppRoot theming system lie CSS variables, which are utilized to create a flexible and adaptable styling framework. These variables are divided into two main categories: Basic Variables and Custom Variables. Both play a crucial role in tailoring the application's appearance to match both Telegram's theme and any additional stylistic preferences.
### Basic Variables
Basic Variables are designed to inherit styles directly from Telegram or fall back on predefined styles within the library. This ensures that the application remains consistent with the user's current Telegram theme settings.

- Telegram Style Inheritance: When available, Basic Variables dynamically adopt values from Telegram's theme, aligning the application's appearance with the platform's chosen theme.
- Library Defaults: In scenarios where Telegram theme data isn't available or not support in current version, these variables revert to a set of default styles specified within the library, maintaining a coherent and user-friendly interface.
### Custom Variables
Custom Variables offer an extension to the theming capabilities, allowing for more nuanced and specific styling adjustments that go beyond the scope of Telegram's native themes.

- Enhanced Styling Flexibility: These variables enable the definition of unique stylistic elements like accent colors, providing opportunities for brand alignment and distinct visual design.
- Brand Identity Support: By leveraging Custom Variables, developers can ensure that the application not only adheres to Telegram's theming but also reflects the brand's identity through consistent use of colors, typography, and other design elements.
### Internal Mechanism for Theme and Platform Adaptation
AppRoot intelligently leverages React context and CSS variables to dynamically adjust the application's styling based on the current theme (light, dark, or Telegram custom themes) and platform (iOS, Android, web). Here's an overview of how this process unfolds internally:

- Theme Detection and Application: Upon initialization, AppRoot detects the current theme settings (from Telegram or manually set preferences) and updates the CSS variables accordingly. This process ensures that the theme is consistently applied across the application.
- Platform-Specific Styling: In addition to theme management, AppRoot also detects the user's platform and applies platform-specific styles to optimize the user experience. This might include adjustments to typography, element sizing, and interaction feedback, aligning with platform conventions.
- Contextual Theme and Platform Information: Through the use of React context, AppRoot provides nested components with access to current theme and platform information. This allows for conditional rendering or styling adjustments deep within the component tree, based on the overall application context.
### Summary
The AppRoot theming system is a sophisticated framework designed to ensure visual consistency and adaptability across different themes and platforms. By combining CSS variables with React context, it offers a robust solution for managing theme and platform-specific styling, all while keeping the application aligned with Telegram's theming capabilities and the brand's visual identity.

Through this internal mechanism, AppRoot abstracts away the complexities of dynamic theming, allowing developers to focus on building feature-rich and visually appealing applications that provide a seamless user experience across all platforms and themes.

### Telegram UI Component Patterns

This project follows Telegram Web App design guidelines using `@telegram-apps/telegram-ui`. Key patterns and conventions:

#### Layout Structure
- **AppRoot**: Always wrap the entire app with `AppRoot` component for theme and platform consistency
- **Page Component**: Use custom `Page` wrapper for back button management and navigation
- **List + Section Pattern**: Primary layout structure using `List` containing `Section` elements
- **Cell Pattern**: Individual interactive elements within sections

#### Component Hierarchy
```tsx
<AppRoot appearance={theme} platform={platform}>
  <Page back={boolean}>
    <List>
      <Section header="Title" footer="Description">
        <Cell>Content</Cell>
        <Cell>Content</Cell>
      </Section>
    </List>
  </Page>
</AppRoot>
```

#### Form Patterns
- **Input Fields**: Use `Input` component with `header` and `placeholder` props
- **Validation**: Show field errors with `status="error"` and custom error text
- **Submit Buttons**: Use `Button` with `size="l"`, `stretched`, and `loading` props
- **Form Structure**: Wrap inputs in `Cell` components within a `Section`

#### Error Handling Patterns
- **Field Errors**: Display inline error messages below inputs with destructive color
- **Global Errors**: Use `Banner` component for form-level error messages
- **Loading States**: Show loading indicators on buttons and disable form during submission

#### Navigation Patterns
- **Routing**: Use React Router with `HashRouter` for Telegram Web App compatibility
- **Links**: Custom `Link` component wrapping router links
- **Back Button**: Integrate with Telegram's native back button via `Page` component
- **Protected Routes**: Use `AuthGuard` for route protection

#### Theme Integration
- **Dynamic Theming**: Automatically detect and apply Telegram's theme (light/dark)
- **Platform Adaptation**: Adjust UI for iOS vs base platforms
- **CSS Variables**: Use Telegram's CSS custom properties for colors:
  - `--tg-theme-button-color` - Primary button color
  - `--tg-theme-hint-color` - Secondary text color
  - `--tg-theme-destructive-text-color` - Error text color
  - `--tg-theme-link-color` - Link color

#### Data Display Patterns
- **Avatar + Text**: Use `Avatar` with `Text` for user representation
- **Before/After Icons**: Use `before` prop in `Cell` for icons or images
- **Placeholder States**: Use `Placeholder` component for empty states
- **Dividers**: Use `Divider` for visual separation

#### Interactive Patterns
- **Cell Interactions**: Use `onClick`, `interactiveAnimation="opacity"` for clickable cells
- **Form Validation**: Real-time validation with error state management
- **Loading States**: Consistent loading indicators across components
- **Disabled States**: Proper disabled states for forms and buttons

#### Authentication Flow Pattern
- **Dual Storage**: CloudStorage (production) + localStorage (development) fallback
- **User Verification**: Telegram user verification via `initRawData`
- **Route Protection**: `AuthGuard` component for protected routes
- **Error Recovery**: Graceful error handling with user feedback

#### Best Practices
1. **Consistency**: Always use Telegram UI components over custom HTML elements
2. **Accessibility**: Leverage built-in accessibility features of Telegram UI components
3. **Performance**: Use proper React patterns (hooks, memoization) for optimal performance
4. **Localization**: Support multiple languages with proper text management
5. **Responsive**: Ensure components work across different screen sizes and orientations
6. **Platform Integration**: Leverage Telegram-specific features (haptic feedback, theme detection)

#### Component Naming Conventions
- **Pages**: `PageName` + `Page` suffix (e.g., `LoginPage`)
- **Components**: PascalCase with descriptive names
- **Hooks**: `use` prefix for custom hooks (e.g., `useAuth`)
- **Types**: Descriptive interfaces with proper TypeScript types

#### File Organization
- Group related components in feature-based folders
- Separate API calls, types, and utility functions
- Use TypeScript path aliases (`@/*`) for clean imports
- Co-locate component assets (images, styles) when needed


