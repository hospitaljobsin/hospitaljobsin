# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## CMS Overview

The CMS is a Payload CMS 3.63.0 application that serves as the content management system for the Hospital Jobs platform. It provides a comprehensive admin interface for content creation, media management, and SEO optimization with real-time preview capabilities.

## Common Development Commands

### Development & Building
```bash
# Start development server with live preview (port 5004)
pnpm --filter cms dev

# Production build
pnpm --filter cms build

# Start production server (port 5004)
pnpm --filter cms start

# Development with production build simulation
pnpm --filter cms dev:prod

# Build for AWS Lambda deployment with OpenNext
pnpm --filter cms package
```

### Code Quality & Testing
```bash
# Run all tests (integration + E2E)
pnpm --filter cms test

# Run integration tests only
pnpm --filter cms test:int

# Run E2E tests only
pnpm --filter cms test:e2e

# Lint code
pnpm --filter cms lint

# Lint and fix code
pnpm --filter cms lint:fix
```

### Payload CMS Commands
```bash
# Generate Payload TypeScript types
pnpm --filter cms generate:types

# Generate import maps for Payload
pnpm --filter cms generate:importmap

# Run Payload CLI
pnpm --filter cms payload
```

### Package Management
- **pnpm** is enforced as the package manager (via preinstall hook)
- **Node.js 18.20.2+** or **20.9.0+** is required
- Uses `cross-env NODE_OPTIONS=--no-deprecation` for compatibility

## High-Level Architecture

### Technology Stack
- **Headless CMS**: Payload CMS 3.63.0
- **Framework**: Next.js 15.4.7 with App Router and React 19
- **Database**: MongoDB with Payload's MongoDB adapter
- **Storage**: AWS S3 for media assets
- **Styling**: TailwindCSS with custom design system
- **UI Components**: Radix UI primitives for accessibility
- **Testing**: Vitest for integration tests, Playwright for E2E tests

### Application Structure
```
cms/
├── src/
│   ├── app/                    # Next.js App Router (admin interface)
│   ├── components/            # React components
│   │   ├── ui/                # UI component library
│   │   ├── Card/              # Card components
│   │   ├── Media/             # Media components
│   │   └── AdminBar/          # Admin-specific components
│   ├── collections/           # Payload content collections
│   │   ├── Pages/             # Page content structure
│   │   ├── Posts/             # Blog/post content
│   │   ├── Media/             # Media assets
│   │   ├── Categories/        # Content categories
│   │   └── Users/             # User management
│   ├── blocks/                # Reusable content blocks
│   │   ├── Content/           # Content column layouts
│   │   ├── CallToAction/      # CTA blocks
│   │   ├── ArchiveBlock/      # Archive/listing blocks
│   │   ├── FAQ/               # FAQ components
│   │   ├── Form/              # Form blocks
│   │   └── MediaBlock/        # Media embedding blocks
│   ├── fields/                # Custom field configurations
│   ├── utilities/             # Utility functions
│   ├── access/                # Access control patterns
│   ├── hooks/                 # Collection hooks (revalidation, etc.)
│   ├── providers/             # Context providers
│   ├── plugins/               # Payload plugins configuration
│   └── heros/                 # Hero section configurations
├── payload.config.ts          # Main Payload configuration
├── next-sitemap.config.cjs    # SEO sitemap configuration
└── playwright.config.ts       # E2E test configuration
```

## Key Architectural Patterns

### Payload CMS Architecture
- **Headless CMS**: Content-only backend with separate frontend
- **Collection-based**: Content organized into collections (Pages, Posts, Media, etc.)
- **Block System**: Reusable content blocks for flexible page layouts
- **Plugin Ecosystem**: Extensive use of Payload plugins for enhanced functionality
- **Live Preview**: Real-time content preview during editing

### Component Organization
- **Block-based Architecture**: Reusable content blocks for flexible layouts
- **UI Component Library**: Custom components built on Radix UI primitives
- **Field Components**: Custom form fields for the admin interface
- **Layout Components**: Header, Footer, and navigation management

### Content Architecture
- **Page Builder**: Block-based page creation with hero sections
- **Rich Text**: Lexical editor for advanced text editing
- **Media Management**: S3 integration with optimized delivery
- **SEO Integration**: Automatic metadata generation and sitemaps

## Content Collections and Features

### Primary Collections
- **Pages**: Full-featured pages with hero sections, content blocks, and SEO
- **Posts**: Blog posts with authors, categories, reading time, and E-E-A-T fields
- **Media**: S3-stored media with optimization and CDN delivery
- **Categories**: Hierarchical content organization
- **Users**: User management with custom fields for expert credentials

### Content Blocks
- **Content**: Multi-column layouts with rich text editor
- **CallToAction**: Headlines with configurable links
- **MediaBlock**: Image and video embedding with optimization
- **ArchiveBlock**: Dynamic content listings and archives
- **FAQ**: Question-answer pairs with expandable functionality
- **Form**: Contact and form builder integration

### Custom Fields
- **Link Field**: Multi-type link field (internal, external, email)
- **Link Group**: Multiple link groups for navigation
- **Lexical Editor**: Advanced rich text with custom configuration

## Plugin Ecosystem

### Core Payload Plugins
- **SEO Plugin**: Automatic metadata generation, sitemaps, and Open Graph
- **Search Plugin**: Full-text search with indexing
- **Redirects**: URL management and 301 redirects
- **Form Builder**: Contact forms with email notifications
- **Nested Docs**: Hierarchical content organization
- **Sentry Integration**: Error tracking and performance monitoring

### Storage and Media
- **S3 Storage**: AWS S3 integration for media assets
- **Image Optimization**: Automatic image resizing and format optimization
- **CDN Integration**: CloudFront integration for fast media delivery

## Development Patterns and Conventions

### Code Standards
- **TypeScript**: Strict mode with comprehensive type checking
- **ESLint**: Next.js configuration with custom rules
- **Biome**: Code formatting and linting for consistency
- **Testing**: Comprehensive test suite with integration and E2E tests

### Component Patterns
- **Radix UI**: Accessible component primitives
- **TailwindCSS**: Utility-first styling with custom design tokens
- **Composition**: Component composition over inheritance
- **Type Safety**: Full TypeScript integration with generated types

### File Organization
- **Feature-based Structure**: Components organized by functionality
- **Custom Fields**: Reusable field configurations
- **Hooks**: Collection lifecycle hooks for custom logic
- **Utilities**: Shared utility functions and helpers

## Testing Strategy

### Integration Tests (Vitest)
- **Collection Tests**: Test collection configurations and hooks
- **Component Tests**: UI component testing with jsdom
- **API Tests**: Endpoint and integration testing

### E2E Tests (Playwright)
- **Admin Interface**: Full admin workflow testing
- **Content Creation**: End-to-end content management flows
- **Preview Testing**: Live preview functionality verification

### Quality Assurance
- **Type Checking**: Comprehensive TypeScript validation
- **Linting**: Code quality and consistency checks
- **Bundle Analysis**: Performance optimization monitoring

## Important Configuration Files

### `payload.config.ts`
- **Database Configuration**: MongoDB connection and settings
- **Collections**: All content collections configuration
- **Plugins**: Plugin initialization and configuration
- **Admin**: Admin interface customization and branding
- **Access Control**: User permissions and role management

### `next.config.js`
- **Payload Integration**: Custom Next.js configuration for Payload
- **Sentry Integration**: Error tracking and monitoring
- **Image Optimization**: Custom image loader configuration
- **Headers**: Security headers and caching configuration

### `tailwind.config.mjs`
- **Custom Design System**: Brand colors, typography, and spacing
- **Component Styling**: Custom component configurations
- **Responsive Design**: Mobile-first approach with breakpoints

## Key Features and Functionality

### Content Management
- **Visual Page Builder**: Drag-and-drop content creation
- **Rich Text Editing**: Advanced text editing with Lexical
- **Media Management**: S3 integration with optimization
- **Version Control**: Draft/publish workflows with revision history
- **Multi-language Support**: Internationalization capabilities

### SEO and Performance
- **Automatic Sitemaps**: XML sitemap generation
- **Meta Tags**: Comprehensive SEO metadata management
- **Open Graph**: Social media sharing optimization
- **Performance Monitoring**: Sentry integration for error tracking
- **Image Optimization**: Automatic image compression and format conversion

### User Experience
- **Live Preview**: Real-time content preview during editing
- **Responsive Admin**: Mobile-friendly admin interface
- **Accessibility**: WCAG compliant components
- **Search Functionality**: Full-text content search

## Integration Points

### External Services
- **AWS S3**: Media storage and CDN delivery
- **Sentry**: Error tracking and performance monitoring
- **PostHog**: Analytics and user behavior tracking
- **Email Service**: Form submission notifications

### Platform Integration
- **Seeker Portal**: Content delivery integration with main platform
- **GraphQL API**: Content delivery via GraphQL endpoints
- **Webhook Integration**: Real-time content updates
- **Cache Invalidation**: Automatic cache clearing on content changes

## Performance Optimizations

### Build Optimizations
- **Code Splitting**: Automatic Next.js code splitting
- **Bundle Analysis**: @next/bundle-analyzer for optimization insights
- **Tree Shaking**: Unused code elimination
- **Image Optimization**: Next.js Image component with WebP support

### Runtime Optimizations
- **Caching**: Intelligent caching strategies
- **Lazy Loading**: Component and image lazy loading
- **CDN Integration**: Fast content delivery via CloudFront
- **Database Optimization**: Indexed queries and efficient data fetching

## Special Considerations

### Content Workflow
- **Draft Mode**: Content staging and review workflows
- **Scheduled Publishing**: Automated content publishing
- **User Roles**: Granular permission management
- **Audit Trail**: Content change tracking and history

### Healthcare Industry Focus
- **E-E-A-T Fields**: Expertise, Authoritativeness, and Trustworthiness
- **Author Credentials**: Professional verification and display
- **Medical Content**: Specialized content structure for healthcare
- **Compliance**: Healthcare industry compliance considerations

### Development Workflow
- **Hot Reload**: Live preview during development
- **Type Generation**: Automatic TypeScript type generation
- **Testing**: Comprehensive test coverage
- **Documentation**: Inline documentation and best practices
