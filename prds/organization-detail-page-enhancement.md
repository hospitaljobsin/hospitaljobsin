# PRD: Organization Detail Page Enhancement

## Overview

Enhance the organization detail page with trust and credibility signals to improve SEO scores and user engagement by adding a homepage banner, social links, and employee benefits section.

## Goals

- Improve SEO score through richer content and structured data
- Signal trust and credibility to both users and search engines
- Provide organizations with tools to showcase their brand and culture
- Increase user engagement on organization detail pages

## Features

### 1. Homepage Banner

- Large, prominent banner at the top of organization detail pages
- Separate from existing `bannerUrl` (used for social media previews)
- New field: `homePageBannerUrl`
- User-uploadable via organization general settings

### 2. Social Media Links

- Display organization's social media presence
- Supported platforms: LinkedIn, YouTube, Instagram, Facebook
- User-editable via organization general settings
- Structured as embedded document in backend

### 3. Employee Benefits Section

- Showcase organization perks and programs
- Each benefit includes:
  - Poster image
  - Markdown-formatted description
- User-editable via dedicated settings page
- Example: Kauvery Hospital's Flying Angels program

## Technical Implementation Plan

### Phase 1: Backend - Data Models & Schema

#### Step 1.1: Update Organization Model

**File:** `server/app/organizations/models.py`

- Add `home_page_banner_url: str | None` field to Organization model (stores actual URL or None)
- Create `SocialLinks` embedded document with fields:
  - `linkedin_url: str | None`
  - `youtube_url: str | None`
  - `instagram_url: str | None`
  - `facebook_url: str | None`
- Add `social_links: SocialLinks | None` field to Organization model

#### Step 1.2: Create Employee Benefits Model

**File:** `server/app/organizations/models.py`

- Create `EmployeeBenefit` embedded document:
  - `id: str` (UUID)
  - `title: str`
  - `description: str` (markdown)
  - `poster_image_url: str`
  - `order: int`
  - `created_at: datetime`
  - `updated_at: datetime`
- Add `employee_benefits: list[EmployeeBenefit]` field to Organization model

#### Step 1.3: Create Database Migration

**File:** `server/migrations/forward/XX_add_org_enhancements.py`

- Migration to add new fields to existing organizations
- Set default values (None/empty list)

### Phase 2: Backend - GraphQL Schema

#### Step 2.1: Define GraphQL Types

**File:** `server/app/organizations/schema.py`

- Create `SocialLinksType` with fields matching model
- Create `EmployeeBenefitType` with fields matching model
- Add fields to `OrganizationType`:
  - `home_page_banner_url: str` (non-nullable - always returns placeholder if None in DB, similar to `avatarUrl` and `bannerUrl`)
  - `social_links: SocialLinksType | None`
  - `employee_benefits: list[EmployeeBenefitType]`
- Add resolver for `home_page_banner_url` that returns placeholder URL if database value is None

#### Step 2.2: Create Mutations

**File:** `server/app/organizations/mutation.py`

Update existing `update_organization` mutation:

- Add `home_page_banner_url: str | None` to `UpdateOrganizationInput`
- Add `social_links: SocialLinksInput | None` to `UpdateOrganizationInput`
- Create `SocialLinksInput` with optional fields:
  - `linkedin_url: str | None`
  - `youtube_url: str | None`
  - `instagram_url: str | None`
  - `facebook_url: str | None`

Add new mutations as repository methods:

1. `create_employee_benefit`

   - Input: `CreateEmployeeBenefitInput`
     - `organization_id: str`
     - `title: str`
     - `description: str`
     - `poster_image_url: str`
   - Returns: `EmployeeBenefitType`

2. `update_employee_benefit`

   - Input: `UpdateEmployeeBenefitInput`
     - `organization_id: str`
     - `benefit_id: str`
     - `title: str | None`
     - `description: str | None`
     - `poster_image_url: str | None`
   - Returns: `EmployeeBenefitType`

3. `delete_employee_benefit`

   - Input: `DeleteEmployeeBenefitInput`
     - `organization_id: str`
     - `benefit_id: str`
   - Returns: `bool`

4. `reorder_employee_benefits`
   - Input: `ReorderEmployeeBenefitsInput`
     - `organization_id: str`
     - `benefit_ids: list[str]` (ordered)
   - Returns: `list[EmployeeBenefitType]`

5. `create_organization_home_page_banner_presigned_url`
   - Input: `content_type: str`
   - Returns: `CreatePresignedURLPayloadType`
   - Note: File name is randomly generated (follows pattern of `create_organization_logo_presigned_url`)

### Phase 3: Backend - Business Logic

#### Step 3.1: Update Organization Service

**File:** `server/app/organizations/services.py`

- Update `OrganizationService.update` method to handle new fields:
  - `home_page_banner_url`
  - `social_links` (nested update)
- Add validation for URLs (social links, banner)
- Add validation for image URLs

**File:** `server/app/organizations/schema.py`

- Add resolver method for `home_page_banner_url` field:
  - If `organization.home_page_banner_url` exists, return it
  - Otherwise, return placeholder URL (similar to existing `avatar_url` and `banner_url` logic)
  - Placeholder should be a default banner image or gradient

#### Step 3.2: Create Employee Benefits Service Methods

**File:** `server/app/organizations/services.py`

Add methods to `OrganizationService` class:

- `create_employee_benefit(org_id, data)` - Add benefit, auto-increment order
- `update_employee_benefit(org_id, benefit_id, data)` - Update specific benefit
- `delete_employee_benefit(org_id, benefit_id)` - Remove benefit, reorder remaining
- `reorder_employee_benefits(org_id, benefit_ids)` - Update order field
- Add permission checks (must be org admin) in each method

### Phase 4: Backend - Integration Tests

#### Step 4.1: Test Organization Updates

**File:** `server/tests/integration/organizations/test_mutations/test_update_organization.py`

- Test updating `home_page_banner_url` via `update_organization` mutation
- Test updating `social_links` (all platforms) via `update_organization` mutation
- Test validation (invalid URLs)
- Test permissions

#### Step 4.2: Test Employee Benefits CRUD

**File:** `server/tests/integration/organizations/test_mutations/test_create_employee_benefit.py`

- Test creating benefit

**File:** `server/tests/integration/organizations/test_mutations/test_update_employee_benefit.py`

- Test updating benefit

**File:** `server/tests/integration/organizations/test_mutations/test_delete_employee_benefit.py`

- Test deleting benefit

**File:** `server/tests/integration/organizations/test_mutations/test_reorder_employee_benefits.py`

- Test reordering benefits

in all these test cases,

- Test permissions (only org admins)
- Test all possible edge cases (invalid org_id, benefit_id) etc

### Phase 5: Frontend - GraphQL Schema & Types

#### Step 5.1: Regenerate GraphQL Schema

**Command:**

```bash
cd server && uv run strawberry export-schema app.schema:schema > ../schema/schema.graphql
```

#### Step 5.2: Update Relay Queries

**File:** `apps/recruiter-dashboard/app/[organizationSlug]/settings/page.tsx`

- Update the `graphql` tagged query string to include new fields:
  - `homePageBannerUrl`
  - `socialLinks { linkedinUrl youtubeUrl instagramUrl facebookUrl }`
- Relay compiler will auto-generate compiled queries in `__generated__` directory

**File:** `apps/seeker-portal/app/organizations/[slug]/page.tsx`

- Update the `graphql` tagged query string to include:
  - `homePageBannerUrl`
  - `socialLinks { linkedinUrl youtubeUrl instagramUrl facebookUrl }`
  - `employeeBenefits { id title description posterImageUrl order }`
- Relay compiler will auto-generate compiled queries in `__generated__` directory

### Phase 6: Frontend - Recruiter Dashboard Settings

#### Step 6.1: Update Existing General Settings Page

**File:** `apps/recruiter-dashboard/app/[organizationSlug]/settings/page.tsx`

Add new sections to existing settings page:

- Homepage Banner Upload
  - Image upload component
  - Preview
  - Recommended dimensions (e.g., 1920x400)
  - Update `update_organization` mutation to include `homePageBannerUrl`
- Social Links
  - Input fields for each platform (LinkedIn, YouTube, Instagram, Facebook)
  - URL validation
  - Optional fields
  - Update `update_organization` mutation to include `socialLinks`

#### Step 6.2: Create Employee Benefits Settings Page

**File:** `apps/recruiter-dashboard/app/[organizationSlug]/settings/employee-benefits/page.tsx`

Features:

- List all benefits (sortable/draggable)
- Add new benefit button → modal/form
- Edit benefit → modal/form
- Delete benefit → confirmation dialog
- Reorder via drag-and-drop
- Form fields:
  - Title (text input)
  - Description (markdown editor)
  - Poster image (upload component)

#### Step 6.3: Create Reusable Components

**File:** `apps/recruiter-dashboard/components/EmployeeBenefitForm.tsx`

- React Hook Form setup
- Zod validation schema
- Image upload handling
- Markdown editor integration

**File:** `apps/recruiter-dashboard/components/EmployeeBenefitList.tsx`

- Drag-and-drop reordering (use `@dnd-kit/core`)
- Benefit card component
- Edit/delete actions

### Phase 7: Frontend - Seeker Portal Display

#### Step 7.1: Update Organization Detail Page

**File:** `apps/seeker-portal/app/organizations/[slug]/page.tsx`

Layout structure:

1. Homepage Banner (full-width, hero section)
2. Organization Info (existing)
3. Social Links (icon bar)
4. Employee Benefits Section
5. Jobs Section (existing)

#### Step 7.2: Create Banner Component

**File:** `apps/seeker-portal/components/OrganizationBanner.tsx`

- Display `homePageBannerUrl` (always available from backend)
- Check if URL is placeholder and style accordingly
- Responsive image handling
- Overlay with organization name/logo

#### Step 7.3: Create Social Links Component

**File:** `apps/seeker-portal/components/OrganizationSocialLinks.tsx`

- Icon buttons for each platform
- Only show platforms with URLs
- Open in new tab
- Accessible labels

#### Step 7.4: Create Employee Benefits Section

**File:** `apps/seeker-portal/components/EmployeeBenefitsSection.tsx`

- Grid/carousel layout
- Benefit cards with:
  - Poster image
  - Title
  - Markdown-rendered description
- Responsive design
- Empty state if no benefits

#### Step 7.5: Create Benefit Card Component

**File:** `apps/seeker-portal/components/EmployeeBenefitCard.tsx`

- Image display
- Title
- Markdown content rendering
- Hover effects
- Accessibility

### Phase 8: SEO Enhancements

#### Step 8.1: Update Metadata

**File:** `apps/seeker-portal/app/organizations/[slug]/page.tsx`

- Add structured data (JSON-LD) for Organization schema
- Include social links in structured data
- Add Open Graph tags for banner image
- Update meta description with benefits summary

#### Step 8.2: Add Structured Data

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "...",
  "url": "...",
  "logo": "...",
  "image": "<homePageBannerUrl>",
  "sameAs": ["linkedinUrl", "youtubeUrl", "instagramUrl", "facebookUrl"],
  "description": "..."
}
```

### Phase 10: Testing & Validation

#### Step 10.1: Integration Tests

- Run all backend integration tests
- Verify CRUD operations
- Test permissions

## Implementation Order

1. **Backend Foundation** (Steps 1.1 - 1.3): Data models and migrations
2. **Backend API** (Steps 2.1 - 3.2): GraphQL schema and business logic
3. **Backend Tests** (Steps 4.1 - 4.2): Integration tests
4. **Schema Regeneration** (Step 5.1): Update frontend schema
5. **Settings UI** (Steps 6.1 - 6.3): Recruiter dashboard settings pages
6. **Public Display** (Steps 7.1 - 7.5): Seeker portal organization page
7. **SEO** (Steps 8.1 - 8.2): Metadata and structured data

## Success Metrics

- SEO score improvement (target: +20 points)
- Increased time on organization detail pages (target: +30%)
- Higher click-through rates from search results (target: +15%)
- Organization adoption rate of new features (target: 60% within 3 months)
- Reduced bounce rate on organization pages (target: -20%)

## Risks & Mitigations

| Risk                                       | Mitigation                                                   |
| ------------------------------------------ | ------------------------------------------------------------ |
| Large image uploads slow down page load    | Implement image optimization, lazy loading, and CDN caching  |
| Organizations upload inappropriate content | Add content moderation, size limits, and format restrictions |
| Complex UI for managing benefits           | Provide clear UX, tooltips, and documentation                |
| Migration issues with existing orgs        | Thorough testing, rollback plan, gradual rollout             |

## Future Enhancements

- Video support for employee benefits
- Testimonials/reviews section
- Awards and certifications display
- Photo gallery
- Company culture videos
- Analytics dashboard for organization page views
