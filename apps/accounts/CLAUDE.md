# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Accounts Service Overview

The Accounts service is a Next.js 15.5.4 application with React 19 that serves as the central authentication and user management platform for the Hospital Jobs ecosystem. It features advanced security including WebAuthn passkeys, two-factor authentication, and comprehensive account management capabilities.

## Common Development Commands

### Development & Building
```bash
# Start development server with Turbopack (port 5002)
pnpm --filter accounts dev

# Production build
pnpm --filter accounts build

# Start production server (port 5002)
pnpm --filter accounts start

# Build for AWS Lambda deployment with OpenNext
pnpm --filter accounts package
```

### Code Quality & Relay
```bash
# Run ESLint
pnpm --filter accounts lint

# Run Relay compiler (also runs automatically in watch mode)
pnpm --filter accounts relay
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
- **State Management**: XState for complex workflows, Relay for data fetching
- **Form Handling**: React Hook Form with Zod validation
- **Authentication**: WebAuthn (passkeys), JWT, Two-Factor Authentication
- **Security**: Cloudflare Turnstile captcha, Sudo mode
- **Deployment**: AWS Lambda via SST/CDK with OpenNext

### Application Structure
```
accounts/
├── app/                      # Next.js App Router pages and layouts
│   ├── auth/                 # Authentication pages
│   │   ├── login/            # Login page
│   │   ├── signup/           # Multi-step signup process
│   │   ├── reset-password/   # Password reset flow
│   │   └── 2fa/              # Two-factor authentication
│   ├── settings/             # Account management pages
│   │   ├── account/          # Account settings
│   │   ├── passkeys/         # Passkey management
│   │   ├── sessions/         # Active sessions
│   │   └── privacy/          # Privacy settings
│   ├── request-sudo/         # Sudo mode requests
│   ├── providers.tsx         # Global providers configuration
│   └── globals.css           # Global styles with TailwindCSS
├── components/               # Reusable React components organized by feature
│   ├── auth/                 # Authentication-specific components
│   ├── settings/             # Account management components
│   └── shared/               # Common utilities (Logo, HeadersProvider)
├── lib/                      # Utility libraries, configurations, and helpers
│   ├── env/                  # Environment variable validation (T3 OSS)
│   ├── hooks/                # Custom React hooks
│   ├── relay/                # Relay GraphQL configuration
│   ├── sudoMode.ts           # Sudo mode utilities
│   ├── links.ts              # Navigation link helpers
│   └── constants.ts          # Application constants
├── __generated__/            # Relay compiler-generated GraphQL types and queries (auto-generated)
└── public/                   # Static assets
```

## Key Architectural Patterns

### State Management with XState
The application uses XState for complex authentication workflows:
- **Multi-step Signup**: 4-step process (email → verification → name → registration)
- **Form Workflows**: State machines for complex form interactions
- **Error Handling**: Graceful error states and recovery
- **Context Provider**: `createActorContext` for global state access

### Provider Architecture
- `HeroUIProvider` - Theme and component library provider
- `RelayEnvironmentProvider` - GraphQL environment
- `ThemeProvider` - Next.js themes
- `NavigationGuardProvider` - Route protection
- `XStateProvider` - State machine integration

### Relay GraphQL Integration
- **Schema Location**: `../../schema/schema.graphql` (shared across monorepo)
- **Environment Separation**: Server and client environments
- **Serializable Queries**: Server-side rendering with query preloading
- **Type Safety**: Auto-generated TypeScript types

## Security Architecture

### Multi-Layer Authentication
- **WebAuthn Passkeys**: Modern passwordless authentication
- **Two-Factor Authentication**: Authenticator app + recovery codes
- **Sudo Mode**: Temporary elevated permissions with expiration
- **Session Management**: View and manage active sessions across devices

### Security Integrations
- **Cloudflare Turnstile**: Bot protection and CAPTCHA
- **JWT Tokens**: Secure session management
- **CSRF Protection**: Built-in Next.js security features
- **Sentry Monitoring**: Real-time error tracking and security alerts

## Routing Architecture

### App Router Structure
- **Authentication Routes**: `/auth/*` for login, signup, password management
- **Settings Routes**: `/settings/*` for account management
- **Security Routes**: `/request-sudo` for elevated permissions
- **Error Handling**: Custom 404 and error pages

### Route Protection
- **Middleware Protection**: Authentication and authorization checks
- **Sudo Mode Gates**: Enhanced security for sensitive operations
- **Redirect Logic**: Intelligent navigation based on authentication state

## Development Patterns and Conventions

### Component Organization
- **Feature-based Structure**: Components organized by functionality
- **Client/Server Separation**: Strategic use of `"use client"` directive
- **Loading States**: Skeleton components for better UX
- **Error Boundaries**: Comprehensive error handling

### Form Patterns
- **React Hook Form**: Performance-optimized form handling
- **Zod Validation**: Schema-based validation with error messages
- **Multi-step Forms**: Progressive disclosure for complex workflows
- **Real-time Validation**: Live feedback during form interactions

### Code Standards
- **Biome**: Formatting and linting (140 character width, tabs)
- **TypeScript**: Strict mode enabled
- **ESLint**: Next.js configuration with Relay plugin
- **React Compiler**: Experimental optimization enabled

## Key Features and Functionality

### Authentication Features
- **Modern Login**: Passkey support with traditional password fallback
- **Social Authentication**: OAuth integration options
- **Account Recovery**: Secure password reset and account recovery
- **Device Management**: View and manage trusted devices

### Account Management
- **Profile Settings**: User profile information and preferences
- **Privacy Controls**: Data privacy and sharing preferences
- **Security Settings**: 2FA setup, passkey management
- **Session Control**: Active session overview and management

### Advanced Security
- **Sudo Mode**: Temporary elevated access for sensitive operations
- **Session Analytics**: Device and location tracking for logins
- **Security Notifications**: Alerts for suspicious activities
- **Account Lockout**: Protection against brute force attacks

## Important Configuration Files

### `next.config.ts`
- Sentry integration for comprehensive error monitoring
- Relay compiler configuration with custom features
- React Compiler (experimental) for optimization
- Security headers and CSP configuration
- Image optimization with multiple format support

### `relay.config.json`
- Points to shared schema at `../../schema/schema.graphql`
- TypeScript artifacts in `__generated__/` directory
- Persisted queries for production optimization
- Comprehensive feature flags for modern Relay

### `package.json`
- **Port 5002** for development (distinct from other apps)
- WebAuthn browser integration for passkey support
- QR code generation for 2FA setup
- User agent parsing for session analytics

## Integration Points

### Backend Integration
- **GraphQL API**: FastAPI/Python backend at `../../server/`
- **Authentication Service**: Central auth for all Hospital Jobs services
- **Database**: MongoDB with Beanie ODM for user data
- **Session Store**: Redis for session management

### Third-Party Services
- **WebAuthn**: Native browser passkey integration
- **Sentry**: Error tracking and performance monitoring
- **PostHog**: User analytics and behavior tracking
- **Turnstile**: Cloudflare's advanced CAPTCHA protection

## UI/UX Patterns

### Design System
- **HeroUI**: Primary component library with medical theme
- **TailwindCSS**: Utility-first styling with custom configuration
- **Medical Theme**: Healthcare-appropriate green color scheme
- **Accessibility**: WCAG compliance and proper form handling

### User Experience
- **Progressive Disclosure**: Complex forms broken into manageable steps
- **Clear Feedback**: Loading states, error messages, success confirmations
- **Mobile First**: Responsive design optimized for all devices
- **Security UX**: Clear security indicators and explanations

## Performance Optimizations

### Build Optimizations
- **Turbopack**: Fast development builds with hot reload
- **Code Splitting**: Automatic via Next.js and dynamic imports
- **Bundle Analysis**: @next/bundle-analyzer for optimization insights
- **Image Optimization**: Next.js Image component with WebP/AVIF support

### Runtime Optimizations
- **Suspense Boundaries**: Optimized loading states
- **Relay Caching**: Intelligent GraphQL data caching
- **Dynamic Imports**: On-demand loading for non-critical features
- **Preloading**: Strategic resource preloading for better UX

## Special Considerations

### Healthcare Industry Focus
- **Trust and Security**: Enhanced security measures for sensitive data
- **Professional Design**: Healthcare-appropriate styling and messaging
- **Compliance Awareness**: Built with healthcare industry considerations
- **Accessibility**: WCAG compliance for diverse user needs

### Multi-Service Integration
- **Central Authentication**: Single sign-on for all Hospital Jobs services
- **Cross-Platform**: Works seamlessly with seeker and recruiter portals
- **Session Management**: Unified session handling across services
- **Data Privacy**: Healthcare-appropriate privacy controls

### Development Workflow
- **Type Safety**: Comprehensive TypeScript integration
- **Error Handling**: Robust error boundaries and user feedback
- **Testing Integration**: Playwright E2E tests for critical user flows
- **Monitoring**: Production-ready error tracking and analytics
