# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Seeker Portal Overview

The Seeker Portal is a Next.js 15.5.4 application with React 19 that serves as the job search and application platform for medical professionals. It features modern web technologies including TypeScript, TailwindCSS, HeroUI components, Relay GraphQL, and XState for state management.

## Common Development Commands

### Development & Building
```bash
# Start development server with Turbopack (port 5000)
pnpm --filter seeker-portal dev

# Production build
pnpm --filter seeker-portal build

# Start production server (port 5000)
pnpm --filter seeker-portal start

# Build for AWS Lambda deployment with OpenNext
pnpm --filter seeker-portal package
```

### Code Quality & Relay
```bash
# Run ESLint
pnpm --filter seeker-portal lint

# Run Relay compiler (also runs automatically in watch mode)
pnpm --filter seeker-portal relay
```

### Package Management
- **pnpm** is enforced as the package manager (via preinstall hook)
- **Node.js 22+** is required
- The Relay compiler runs automatically and generates files in `__generated__/`

## High-Level Architecture

### Technology Stack
- **Framework**: Next.js 15.5.4 with App Router and React 19
- **Language**: TypeScript with strict mode
- **Styling**: TailwindCSS 4.1.13 with custom typography extensions
- **UI Components**: HeroUI 2.8.4 as the primary component library
- **Data Fetching**: React Relay for type-safe GraphQL operations
- **State Management**: XState 5.22.0 for complex state, React hooks for local state
- **Form Handling**: React Hook Form with Zod validation
- **URL State**: Nuqs for URL search parameter synchronization
- **Maps**: Leaflet with marker clustering for geographic job search
- **Monitoring**: Sentry for error tracking, PostHog for analytics

### Application Structure
```
seeker-portal/
├── app/                      # Next.js App Router pages and layouts
│   ├── (base-layout)/        # Route group for base layout
│   ├── (landing)/           # Landing pages
│   ├── search/              # Job search functionality
│   │   ├── map/             # Map-based job search
│   │   └── [speciality]/    # Speciality-specific routes
│   ├── organizations/       # Organization listings
│   └── api/                 # API routes
├── components/              # Reusable React components organized by feature
│   ├── blog/               # Blog-related components
│   ├── cms/                # CMS integration components
│   ├── forms/              # Form components and validation
│   ├── job-detail/         # Job detail page components
│   ├── landing/            # Landing page components
│   ├── layout/             # Layout components (header, footer, navigation)
│   ├── my-alerts/          # User alert management
│   ├── my-jobs/            # User job application tracking
│   ├── search/             # Job search functionality
│   └── shared/             # Cross-cutting components
├── lib/                    # Utility libraries, configurations, and helpers
│   ├── env/                # Environment variable validation (T3 OSS)
│   ├── hooks/              # Custom React hooks
│   ├── relay/              # Relay GraphQL configuration
│   └── map/                # Map-related utilities (Leaflet integration)
├── __generated__/          # Relay compiler-generated GraphQL types and queries (auto-generated)
├── public/                 # Static assets
└── .sst/                   # SST (Serverless Stack) deployment configuration
```

## Key Architectural Patterns

### Provider Architecture
The application uses a comprehensive provider stack in `app/providers.tsx`:
- `HeroUIProvider` - Theme and component library provider
- `RelayEnvironmentProvider` - GraphQL environment
- `ThemeProvider` - Next.js themes (forced to light mode)
- `GoogleOAuthProvider` - Google authentication
- `NavigationGuardProvider` - Route protection
- `NuqsAdapter` - URL state management
- `ProgressProvider` - Loading progress indicators

### Relay GraphQL Integration
- **Schema Location**: `../../schema/schema.graphql` (shared across monorepo)
- **Environment Separation**: Server and client environments in `lib/relay/environments/`
- **Type Safety**: Relay compiler generates TypeScript types automatically
- **Persisted Queries**: Production optimization with query persistence
- **Preloaded Queries**: Server-side data fetching with client-side hydration

### Component Organization
- **Feature-based Structure**: Components grouped by business functionality
- **Shared Components**: Cross-cutting UI elements in `components/shared/`
- **Form Components**: Reusable form patterns with validation
- **Layout Components**: Header, footer, navigation, and page structure

### State Management Patterns
- **XState**: Available for complex state machines (multi-step forms, workflows)
- **React Hooks**: Local component state management
- **Nuqs**: URL state synchronization for shareable application state
- **Relay**: Server state management with GraphQL
- **React Hook Form + Zod**: Form state and validation

## Routing Architecture

### App Router Structure
- Uses **Next.js 13+ App Router** with route groups for layout organization
- Dynamic routes for parameterized content (jobs, organizations, search)
- Extensive URL rewriting for SEO-friendly routes
- MDX support for content pages

### SEO-Optimized URL Patterns
The application implements comprehensive URL rewriting for SEO:
- `/search/:speciality-jobs-in-:location` → `/search/:speciality/jobs-in/:location`
- `/search/jobs-in-:location` → `/search/jobs-in/:location`
- `/organizations/:slug.md` → CMS content integration
- Markdown content rewriting for blog and CMS pages

## Important Configuration Files

### `next.config.ts`
- MDX support with `@next/mdx`
- Sentry integration for error monitoring
- Comprehensive image optimization with WebP/AVIF formats
- Extensive URL rewriting for SEO optimization
- Relay compiler configuration
- React Compiler (experimental) enabled

### `relay.config.json`
- Points to shared schema at `../../schema/schema.graphql`
- Persisted queries configuration for production optimization
- TypeScript import syntax enabled
- Excludes test files and mocks from compilation

### `package.json`
- pnpm enforcement via preinstall hook
- Node.js 22+ requirement
- Comprehensive dependency list including modern React ecosystem

## Development Patterns and Conventions

### Code Standards
- **Biome**: Formatting and linting (140 character width, tabs)
- **TypeScript**: Strict mode enabled with comprehensive type checking
- **ESLint**: Next.js configuration with Relay plugin
- **React Compiler**: Experimental optimization enabled

### Form Patterns
- **React Hook Form**: Form state management with validation
- **Zod**: Schema validation with TypeScript integration
- **Custom Components**: Reusable form components with consistent patterns

### GraphQL and Relay Patterns
- **Fragment Colocation**: Fragments defined in components that use them
- **Type Safety**: All GraphQL operations are fully typed
- **Suspense Integration**: Loading states with error boundaries
- **Serializable Queries**: Preloaded queries for SSR/SSG

### Testing Strategy
- E2E tests handled at monorepo level with Playwright
- No unit test configuration in this specific directory
- Component testing patterns leverage TypeScript for compile-time validation

## UI/UX Patterns

### Design System
- **HeroUI**: Primary component library with custom theming
- **TailwindCSS**: Utility-first styling with custom configuration
- **Lucide React**: Consistent iconography
- **Framer Motion**: Smooth animations and transitions

### Responsive Design
- Mobile-first approach
- Responsive breakpoints defined in Tailwind configuration
- Adaptive layouts for different screen sizes

### Accessibility
- Semantic HTML structure
- ARIA labels and roles where appropriate
- Keyboard navigation support
- Screen reader compatibility

## Key Features and Functionality

### Core Application Features
- **Job Search**: Location, speciality, and keyword-based search with filtering
- **Map View**: Interactive geographic job search with Leaflet integration
- **Job Applications**: Application tracking and management
- **Organization Profiles**: Company information and job listings
- **Resume Builder**: Interactive resume creation and editing
- **User Alerts**: Email notifications for job matches
- **Blog Integration**: Content management with MDX support

### Technical Features
- **Server-Side Rendering**: SEO optimization with SSR/SSG
- **Image Optimization**: WebP/AVIF support with intelligent caching
- **Performance Monitoring**: Sentry error tracking and React Scan performance monitoring
- **Analytics**: PostHog product analytics integration
- **Authentication**: Google OAuth integration with navigation guards

## Integration Points

### Backend Integration
- **GraphQL API**: FastAPI/Python backend at `../../server/`
- **Authentication**: JWT-based auth via accounts service
- **Database**: MongoDB with Beanie ODM
- **File Storage**: AWS S3 for user-generated content

### CMS Integration
- **Payload CMS**: Content management integration
- **Live Preview**: Real-time content editing with @payloadcms/live-preview-react
- **Rich Text**: Lexical editor integration with @payloadcms/richtext-lexical

### Third-Party Services
- **Google OAuth**: Authentication and user identity
- **Sentry**: Error monitoring and performance tracking
- **PostHog**: Product analytics and user behavior tracking
- **AWS S3**: File storage and CDN integration

## Performance Optimizations

### Build Optimizations
- **Turbopack**: Fast development builds
- **Bundle Analysis**: @next/bundle-analyzer for optimization insights
- **Code Splitting**: Automatic and manual code splitting
- **Image Optimization**: Next.js Image component with WebP/AVIF support

### Runtime Optimizations
- **Relay Persisted Queries**: Reduced network overhead
- **Suspense Boundaries**: Optimistic loading states
- **React.memo**: Component memoization where appropriate
- **Virtual Scrolling**: Efficient list rendering with Virtua
