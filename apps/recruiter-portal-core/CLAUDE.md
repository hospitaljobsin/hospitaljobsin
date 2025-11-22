# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Recruiter Portal Core Overview

The Recruiter Portal Core is a Next.js 15.5.4 application with React 19 that serves as the recruitment platform interface for healthcare recruiters. It provides organization selection, new organization creation, invitation handling, and serves as the entry point to the broader recruiter dashboard ecosystem.

## Common Development Commands

### Development & Building
```bash
# Start development server with Turbopack (port 5003)
pnpm --filter recruiter-portal-core dev

# Production build
pnpm --filter recruiter-portal-core build

# Start production server (port 5003)
pnpm --filter recruiter-portal-core start

# Build for AWS Lambda deployment with OpenNext
pnpm --filter recruiter-portal-core package
```

### Code Quality & Relay
```bash
# Run ESLint
pnpm --filter recruiter-portal-core lint

# Run Relay compiler (also runs automatically in watch mode)
pnpm --filter recruiter-portal-core relay
```

### Package Management
- **pnpm** is enforced as the package manager (via preinstall hook)
- **Node.js 22+** is required
- The Relay compiler runs automatically and generates files in `__generated__/`

## High-Level Architecture

### Technology Stack
- **Framework**: Next.js 15.5.4 with App Router and React 19
- **Language**: TypeScript with strict mode
- **Styling**: TailwindCSS with HeroUI component library
- **Data Fetching**: React Relay for type-safe GraphQL operations
- **State Management**: React hooks for local state, Relay for server state
- **Form Handling**: React Hook Form with Zod validation
- **Authentication**: JWT-based with session cookies
- **Deployment**: AWS Lambda via SST/CDK with OpenNext

### Application Structure
```
recruiter-portal-core/
├── app/                      # Next.js App Router pages and layouts
│   ├── (base)/              # Route group for authenticated layout
│   │   ├── layout.tsx       # Dashboard layout with header
│   │   ├── select/          # Organization selection page
│   │   ├── new/             # New organization creation
│   │   └── invites/         # Invitation handling
│   ├── page.tsx             # Landing page (public)
│   ├── providers.tsx        # Global providers configuration
│   └── globals.css          # Global styles
├── components/              # Reusable React components organized by feature
│   ├── landing/             # Landing page components
│   ├── layout/              # Layout components (header, footer)
│   ├── select/              # Organization selection components
│   ├── new-organization/    # New org creation components
│   ├── invite-detail/       # Invitation handling components
│   └── forms/               # Form components with validation
├── lib/                     # Utility libraries, configurations, and helpers
│   ├── env/                 # Environment variable validation (T3 OSS)
│   ├── hooks/               # Custom React hooks
│   ├── relay/               # Relay GraphQL configuration
│   ├── session.ts           # Session management
│   ├── links.ts             # Navigation link helpers
│   └── constants.ts         # App constants
├── __generated__/           # Relay compiler-generated GraphQL types and queries (auto-generated)
└── public/                  # Static assets
```

## Key Architectural Patterns

### Provider Architecture
The application uses a comprehensive provider stack:
- `HeroUIProvider` - Theme and component library provider
- `RelayEnvironmentProvider` - GraphQL environment
- `ThemeProvider` - Next.js themes (forced to light mode)
- `NavigationGuardProvider` - Route protection
- `ProgressProvider` - Loading progress indicators

### View Component Pattern
All major features follow a **View pattern** for consistency:
- `LandingView.tsx` - Landing page composition
- `SelectView.tsx` - Organization selection interface
- `NewOrganizationView.tsx` - New organization creation
- `InviteDetailView.tsx` - Invitation handling

Each View uses Relay fragments and preloaded queries for data fetching.

### Relay GraphQL Integration
- **Schema Location**: `../../schema/schema.graphql` (shared across monorepo)
- **Environment Separation**: Server and client environments in `lib/relay/environments/`
- **Type Safety**: Relay compiler generates TypeScript types automatically
- **Error Handling**: Automatic redirect on `UNAUTHENTICATED` errors
- **Preloaded Queries**: Server-side data fetching with client-side hydration

## Routing Architecture

### App Router Structure
- Uses **Next.js 13+ App Router** with route groups for layout organization
- **Authentication Required**: Routes in `(base)/` require authentication
- **Public Routes**: Landing page and invitation handling accessible without auth
- **Dynamic Routes**: Parameterized content for invitations

### Key Route Patterns
- `/` - Landing page (public, marketing content)
- `/select` - Organization selection (requires authentication)
- `/new` - New organization creation (requires authentication)
- `/invites/[token]` - Invitation handling (public with token validation)

### Route Protection
Middleware enforces authentication rules:
- **Authenticated Routes**: `/select`, `/new`
- **Anonymous Routes**: `/`
- **Public Routes**: API routes, static assets, health checks

## State Management Patterns

### Relay Architecture
- **Separate Environments**: Client and server environments with different network handling
- **Error Handling**: Automatic redirect on `UNAUTHENTICATED` errors
- **Caching**: 5-second cache for queries with proper cache invalidation
- **Preloading**: Queries are preloaded and passed as references to client components

### Session Management
- Cookie-based authentication via accounts service
- JWT token handling with proper signing/verification
- Sudo mode support for elevated permissions
- Organization context for multi-tenant access

## Development Patterns and Conventions

### Component Patterns
- **Fragment Composition**: Components receive Relay fragments as props
- **Preloaded Queries**: Data fetching handled on server, passed to client components
- **Error Boundaries**: Proper error handling for failed data loading
- **Loading States**: Skeleton components for better UX
- **Client/Server Separation**: Proper use of `"use client"` directive

### Code Organization
- **File Naming**: PascalCase for components, camelCase for utilities
- **Import Structure**: Absolute imports via `@/` alias
- **Type Safety**: Strict TypeScript with proper null checks
- **Constants**: Centralized in `lib/constants.ts`

### Form Patterns
- **React Hook Form**: Performance-optimized form handling
- **Zod Validation**: Schema-based validation with error messages
- **Custom Components**: Reusable form inputs with consistent styling

## Important Configuration Files

### `next.config.ts`
- MDX support with `@next/mdx`
- Sentry integration for error monitoring
- Relay compiler configuration
- React Compiler (experimental) enabled
- Security headers and CSP configuration
- Image optimization with AWS S3 patterns

### `relay.config.json`
- Points to shared schema at `../../schema/schema.graphql`
- TypeScript artifacts in `__generated__/` directory
- Persisted queries for production optimization
- Comprehensive feature flags for modern Relay

### `package.json`
- **Port 5003** for development (distinct from other apps)
- Turnstile CAPTCHA integration for form protection
- PDF viewing capabilities for documentation
- Comprehensive dependency list for modern React development

## Key Features and Functionality

### Core Recruiter Features
- **Landing Page**: Marketing content and value proposition
- **Organization Selection**: Multi-organization support for recruiters
- **Organization Creation**: Onboarding flow for new healthcare organizations
- **Invitation System**: Token-based invitation handling for team members
- **Session Management**: Secure authentication with proper routing

### Technical Features
- **Multi-Tenant Support**: Organization-based routing and data isolation
- **Form Validation**: Comprehensive validation with Zod schemas
- **CAPTCHA Protection**: Turnstile integration for security
- **PDF Viewing**: Built-in document viewer for help content
- **Responsive Design**: Mobile-friendly interface

### Authentication Flow
1. **Anonymous Access**: Landing page and invitation links
2. **Authentication Check**: Middleware validates session cookies
3. **Organization Selection**: Users select their organization
4. **Session Persistence**: Cookie-based with proper domain configuration
5. **Error Handling**: Automatic redirects on authentication failures

## UI/UX Patterns

### Design System
- **HeroUI**: Primary component library with custom theming
- **TailwindCSS**: Utility-first styling with professional healthcare theme
- **Dark/Light Mode**: Theme support (forced to light for consistency)
- **Work Sans**: Primary typography font
- **Framer Motion**: Smooth animations and transitions

### Recruiter-Focused UX
- **Simple Onboarding**: Streamlined organization creation flow
- **Clear Navigation**: Intuitive route structure with proper breadcrumbs
- **Form Optimization**: Efficient form handling with real-time validation
- **Error Handling**: Clear error states and recovery options

## Integration Points

### Backend Integration
- **GraphQL API**: FastAPI/Python backend at `../../server/`
- **Authentication**: JWT-based auth via accounts service
- **Database**: MongoDB with Beanie ODM
- **File Storage**: AWS S3 for document management

### Third-Party Services
- **Turnstile**: Cloudflare CAPTCHA for form protection
- **Sentry**: Error monitoring and performance tracking
- **PostHog**: Product analytics and user behavior tracking
- **AWS S3**: File storage and CDN integration

## Performance Optimizations

### Build Optimizations
- **Turbopack**: Fast development builds with hot reload
- **Code Splitting**: Automatic via Next.js and Relay
- **Bundle Analysis**: @next/bundle-analyzer for optimization insights
- **Image Optimization**: Next.js Image component with multiple formats

### Runtime Optimizations
- **Relay Caching**: Intelligent GraphQL data caching
- **Suspense Boundaries**: Optimized loading states
- **Dynamic Imports**: On-demand loading for non-critical features
- **Progress Indicators**: AppProgressProvider for better UX

## Security Considerations

### Security Headers
- **Content Security Policy**: Comprehensive CSP implementation
- **X-Frame-Options**: Clickjacking protection
- **X-Content-Type-Options**: MIME type sniffing protection
- **Referrer-Policy**: Cross-origin referrer control

### Authentication Security
- **JWT Tokens**: Secure cookie-based authentication
- **Session Management**: Proper token validation and refresh
- **CSRF Protection**: Built-in Next.js CSRF protection
- **CAPTCHA Integration**: Form protection against bots

## Special Considerations

### Multi-Tenant Architecture
- **Organization Context**: Proper organization scoping throughout the application
- **Data Isolation**: Strict separation of organization data
- **Route Protection**: Organization-specific access controls
- **Invitation System**: Secure token-based team member onboarding

### Healthcare Industry Focus
- **Professional Design**: Healthcare-appropriate styling and messaging
- **Compliance Awareness**: Built with healthcare industry considerations
- **Trust Signals**: Professional presentation for healthcare recruiters
- **Accessibility**: WCAG compliance considerations
