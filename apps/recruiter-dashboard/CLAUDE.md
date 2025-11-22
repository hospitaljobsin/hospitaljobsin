# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Recruiter Dashboard Overview

The Recruiter Dashboard is a Next.js 15.5.4 application with React 19 that serves as the comprehensive platform for healthcare recruiters to manage job postings, track applications, and communicate with candidates. It features advanced AI capabilities through CopilotKit integration and modern web technologies including TypeScript, TailwindCSS, HeroUI components, and Relay GraphQL.

## Common Development Commands

### Development & Building
```bash
# Start development server with Turbopack (port 5001)
pnpm --filter recruiter-dashboard dev

# Production build
pnpm --filter recruiter-dashboard build

# Start production server (port 5001)
pnpm --filter recruiter-dashboard start

# Build for AWS Lambda deployment with OpenNext
pnpm --filter recruiter-dashboard package
```

### Code Quality & Relay
```bash
# Run ESLint
pnpm --filter recruiter-dashboard lint

# Run Relay compiler (also runs automatically in watch mode)
pnpm --filter recruiter-dashboard relay
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
- **AI Integration**: CopilotKit for AI-powered assistance
- **Charts**: Recharts for data visualization
- **Authentication**: JWT-based with session cookies

### Application Structure
```
recruiter-dashboard/
├── app/                      # Next.js App Router pages and layouts
│   ├── (base)/              # Route group for authenticated layout
│   │   ├── (dashboard)/     # Dashboard pages and main application views
│   │   └── jobs/            # Job management pages
│   ├── layout.tsx           # Root layout with providers
│   └── providers.tsx        # Global providers configuration
├── components/              # Reusable React components organized by feature
│   ├── layout/             # Layout components (sidebar, header)
│   ├── dashboard/          # Dashboard-specific components
│   ├── job-detail/         # Job management components
│   ├── org-settings/       # Organization settings
│   ├── new-job/            # Job posting components
│   └── chat-interface/     # Communication features with candidates
├── lib/                    # Utility libraries, configurations, and helpers
│   ├── env/                # Environment variable validation (T3 OSS)
│   ├── hooks/              # Custom React hooks
│   └── relay/              # Relay GraphQL configuration
├── __generated__/          # Relay compiler-generated GraphQL types and queries (auto-generated)
└── public/                 # Static assets
```

## Key Architectural Patterns

### Provider Architecture
The application uses a comprehensive provider stack similar to other apps in the monorepo:
- `HeroUIProvider` - Theme and component library provider
- `RelayEnvironmentProvider` - GraphQL environment
- `ThemeProvider` - Next.js themes (forced to light mode)
- `NavigationGuardProvider` - Route protection
- `CopilotKitProvider` - AI assistance integration

### Relay GraphQL Integration
- **Schema Location**: `../../schema/schema.graphql` (shared across monorepo)
- **Environment Separation**: Server and client environments in `lib/relay/environments/`
- **Type Safety**: Relay compiler generates TypeScript types automatically
- **Persisted Queries**: Production optimization with query persistence
- **Preloaded Queries**: Server-side data fetching with client-side hydration

### Component Organization
- **Feature-based Structure**: Components grouped by business functionality
- **Layout Components**: Sidebar, header, and navigation structure
- **Dashboard Components**: Analytics, metrics, and overview widgets
- **Job Management**: Job posting, editing, and application tracking
- **Communication**: Chat interface and candidate interaction tools

### State Management Patterns
- **Relay**: Server state management with GraphQL caching
- **React Hooks**: Local component state management
- **Form State**: React Hook Form with Zod validation
- **Organization Context**: Multi-tenant subdomain-based routing

## Routing Architecture

### App Router Structure
- Uses **Next.js 13+ App Router** with route groups for layout organization
- **Authentication Required**: All routes wrapped in `(base)/` route group
- **Dynamic Routes**: Parameterized content for jobs, applicants, and settings
- **Subdomain Support**: Organization-based routing

### Key Route Patterns
- `/dashboard` - Main dashboard with analytics and overview
- `/jobs/[slug]` - Job detail pages with tabbed interface
- `/jobs/[slug]/applicants/[applicantSlug]` - Applicant details and communication
- `/settings/*` - Organization settings and configuration
- `/new-job` - Multi-step job creation wizard

## Important Configuration Files

### `next.config.ts`
- MDX support for content pages
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
- **Port 5001** for development (distinct from other apps)
- CopilotKit integration for AI features
- Advanced UI components for data visualization
- PDF viewing capabilities for resumes

## Development Patterns and Conventions

### Code Standards
- **Biome**: Formatting and linting (140 character width, tabs)
- **TypeScript**: Strict mode enabled with comprehensive type checking
- **ESLint**: Next.js configuration with Relay plugin
- **React Compiler**: Experimental optimization enabled

### Security Patterns
- **Content Security Policy**: Comprehensive CSP headers
- **JWT Authentication**: Session-based authentication
- **Subdomain Isolation**: Organization-based data separation
- **Secure Cookies**: HttpOnly, Secure, SameSite cookie handling

## Key Features and Functionality

### Core Recruiter Features
- **Job Management**: Create, edit, and manage job postings with rich editing
- **Applicant Tracking**: Review applications, schedule interviews, manage candidates
- **Communication**: Built-in chat interface for candidate communication
- **Analytics**: Dashboard with hiring metrics and recruitment analytics
- **Organization Settings**: Multi-tenant organization management

### Advanced Features
- **AI Assistance**: CopilotKit integration for job descriptions and communication
- **PDF Viewing**: Integrated resume and document viewer
- **Drag & Drop**: Advanced file management and organization
- **Data Visualization**: Charts and graphs for recruitment analytics
- **Rich Text Editing**: Lexical-based content creation

### Technical Features
- **Multi-Organization Support**: Subdomain-based tenant isolation
- **Real-time Updates**: Live updates for application status changes
- **Performance Monitoring**: Sentry error tracking and React Scan performance
- **Image Handling**: Optimized image upload and processing
- **Responsive Design**: Mobile-friendly interface for on-the-go recruiting

## Integration Points

### Backend Integration
- **GraphQL API**: FastAPI/Python backend at `../../server/`
- **Authentication**: JWT-based auth via accounts service
- **Database**: MongoDB with Beanie ODM
- **File Storage**: AWS S3 for resumes and documents

### Third-Party Services
- **CopilotKit**: AI assistance for content generation and communication
- **Sentry**: Error monitoring and performance tracking
- **PostHog**: Product analytics and user behavior tracking
- **AWS S3**: File storage and CDN integration

### AI/ML Features
- **Content Generation**: AI-powered job description writing
- **Communication Assist**: AI suggestions for candidate outreach
- **Resume Analysis**: Automated resume parsing and screening insights
- **Smart Recommendations**: AI-powered candidate matching

## UI/UX Patterns

### Design System
- **HeroUI**: Primary component library with custom theming
- **TailwindCSS**: Utility-first styling with professional healthcare theme
- **Dark/Light Mode**: Theme support (forced to light for consistency)
- **Responsive Design**: Mobile-optimized interface

### Recruiter-Focused UX
- **Dashboard-Centric**: Overview-driven interface for busy recruiters
- **Workflow Optimization**: Streamlined processes for common tasks
- **Communication Hub**: Integrated messaging and scheduling
- **Data-Driven**: Analytics and insights for recruitment optimization

## Performance Optimizations

### Build Optimizations
- **Turbopack**: Fast development builds with hot reload
- **Code Splitting**: Automatic and manual component splitting
- **Bundle Analysis**: @next/bundle-analyzer for optimization insights
- **Image Optimization**: Next.js Image component with multiple formats

### Runtime Optimizations
- **Relay Caching**: Intelligent GraphQL data caching
- **Suspense Boundaries**: Optimized loading states
- **React.memo**: Component memoization for performance
- **Dynamic Imports**: On-demand loading for non-critical features

## Special Considerations

### Multi-Tenant Architecture
- **Subdomain Routing**: Organization-based URL structure
- **Data Isolation**: Strict separation of organization data
- **Context Awareness**: Organization context throughout application
- **Scoped Resources**: Resource access limited to user's organization

### Healthcare-Specific Features
- **Compliance**: Healthcare industry compliance considerations
- **Specialized Fields**: Medical speciality and role management
- **Professional Communication**: Healthcare-appropriate communication tools
- **Credential Verification**: Professional license and credential tracking
