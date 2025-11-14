# Blog SEO Improvement PRD

## Executive Summary

**Current State:** Blog SEO audit score of 20.7/100 (CRITICAL)
**Target State:** 75+/100 (GOOD) within 4 weeks
**Expected Impact:** 200-400% increase in organic traffic, 30-50% increase in qualified job applications

## Audit Findings

### Overall Score: 20.7/100 ⚠️ CRITICAL

#### Score Breakdown by Category

| Category                  | Score | Status     | Key Issue                                                          |
| ------------------------- | ----- | ---------- | ------------------------------------------------------------------ |
| On-Page SEO               | 9%    | ✗ Critical | Missing title optimization, meta description, schema markup        |
| Technical SEO             | 31.1% | ✗ Critical | Needs mobile testing, Core Web Vitals verification, indexing check |
| Authority & Trust (E-A-T) | 15%   | ✗ Critical | No author bio, medical disclaimer, or publication dates            |
| User Experience           | 26%   | ✗ Critical | Weak CTAs, insufficient visual elements, poor structure            |
| Off-Page SEO              | 30%   | ✗ Poor     | Limited backlinks, minimal social signals                          |

## Critical Context

Healthcare career content is classified as **YMYL (Your Money or Your Life)**, meaning Google requires:

- Strong credibility markers
- Career information disclaimers
- Author credentials (recruitment/HR expertise)
- Industry expert review statements
- High-quality backlinks from healthcare career authorities

## Implementation Plan

### Phase 1: Critical Priorities (Week 1) - Target: +20-25 points

#### 1. E-E-A-T Signals for YMYL Content (+7 points)

**Objective:** Establish credibility and expertise for healthcare content

**Tasks:**

- [x] Add `careerDisclaimer` field to CMS Posts collection
  - Type: Rich text
  - Required: Yes for career advice posts
  - Display: Prominent box at top of article
  - Example text: "This article provides general career guidance for healthcare professionals. Salary ranges, job requirements, and certification details may vary by location, employer, and individual circumstances. Always verify current requirements with employers and certification bodies."
- [x] Add `credentials` field to CMS Users/Authors collection
  - Type: Text
  - Example: "Healthcare Recruitment Specialist, 10+ years experience"
- [x] Add `reviewedBy` field to Posts collection
  - Type: Relationship to Users
  - Display: "Reviewed by [Name], [Credentials]"
  - Example: "Reviewed by Senior HR Manager with 15+ years in healthcare recruitment"
- [x] Use existing Payload CMS `updatedAt` field
  - Already auto-tracked by Payload
  - Display: "Last Updated: [Date]"
  - Fetch in GraphQL query

**Files to modify:**

- `apps/cms/src/collections/Posts/index.ts`
- `apps/cms/src/collections/Users.ts`
- `apps/seeker-portal/app/(base-layout)/blog/[slug]/page.tsx`
- `apps/seeker-portal/components/blog/BlogPostDetail.tsx`

**Success Metrics:**

- Career information disclaimer visible on all posts
- Author credentials (recruitment/HR expertise) displayed with bio
- Updated date shown in metadata and on page

#### 2. Enhanced Schema Markup (+5 points)

**Objective:** Help Google understand content structure and earn rich results

**Tasks:**

- [x] Add FAQPage schema support
  - Create FAQ block in CMS
  - Generate FAQPage JSON-LD when FAQ block is present
- [x] Add BreadcrumbList schema
  - Home > Blog > Category > Post
  - Hardcoded in page template (not a CMS field)
- [x] Add Organization schema for Hospital Jobs
  - Represents Hospital Jobs company (publisher)
  - Include logo, social profiles, contact info
  - Hardcoded in page template (not a CMS field)
  - Links to existing Article.publisher field
- [x] Enhance Article schema (not BlogPosting)
  - Use Article schema for authoritative YMYL content positioning
  - Add `dateModified` (from updatedAt field)
  - Add `wordCount` (calculated from content)
  - Add `articleSection` (from categories)
  - Better for healthcare career content than BlogPosting

**Files to modify:**

- `apps/cms/src/blocks/FAQ/config.ts` (create)
- `apps/seeker-portal/app/(base-layout)/blog/[slug]/page.tsx`

**Note:** Organization and BreadcrumbList schemas are hardcoded in the page template and represent site-level information, not per-post CMS fields.

**Success Metrics:**

- FAQ rich results in Google Search
- Breadcrumb navigation in search results
- Enhanced article snippets

#### 3. Updated Date Display (+3 points)

**Objective:** Show content freshness to users and search engines

**Tasks:**

- [x] Fetch existing `updatedAt` field from Payload CMS
  - Already auto-tracked by Payload (no new field needed)
  - Add to GraphQL query
- [x] Display "Last Updated" date prominently
- [x] Include in JSON-LD schema as `dateModified`
- [x] Show both published and updated dates when different

**Files to modify:**

- `apps/seeker-portal/lib/cms.ts` (add updatedAt to GraphQL query)
- `apps/seeker-portal/components/blog/BlogPostDetail.tsx`
- `apps/seeker-portal/app/(base-layout)/blog/[slug]/page.tsx`

**Success Metrics:**

- Updated date visible on all posts
- Metadata includes both published and modified dates

### Phase 2: Technical SEO (Week 2) - Target: +10-15 points

#### 5. Core Web Vitals Optimization (+5 points)

**Objective:** Improve page performance and user experience

**Tasks:**

- [x] Optimize images with next/image
  - Automatic format selection (WebP/AVIF)
  - Responsive sizes
  - Lazy loading below fold
- [x] Add priority loading for hero images
- [x] Optimize font loading
  - Use font-display: swap
  - Preload critical fonts
- [ ] Add loading skeletons
  - Reduce layout shift
- [ ] Implement code splitting
  - Dynamic imports for heavy components

**Target Metrics:**

- LCP (Largest Contentful Paint): < 2.5s
- FID (First Input Delay): < 100ms
- CLS (Cumulative Layout Shift): < 0.1

**Files to modify:**

- `apps/seeker-portal/components/blog/CMSImage.tsx`
- `apps/seeker-portal/app/(base-layout)/blog/[slug]/page.tsx`
- `apps/seeker-portal/app/layout.tsx`

#### 6. Mobile Optimization (+3 points)

**Objective:** Ensure excellent mobile experience

**Tasks:**

- [x] Test responsive design on mobile devices
- [x] Optimize touch targets (min 48x48px)
- [x] Improve mobile navigation
- [x] Add mobile-specific meta tags
  - viewport
  - theme-color
- [ ] Test on real devices

**Success Metrics:**

- Mobile-friendly test passes
- Touch targets meet accessibility standards
- Mobile page speed score > 90

#### 7. Google Search Console Setup (+2 points)

**Objective:** Ensure proper indexing and monitoring

**Tasks:**

- [x] Verify sitemap includes blog posts with updatedAt
  - Sitemap already exists at `/sitemap.xml`
  - Confirm blog posts are included
  - Verify lastmod dates are correct
- [ ] Submit sitemap to Google Search Console
  - Verify domain ownership
  - Monitor indexing status
- [x] Check robots.txt configuration
  - Ensure blog paths are allowed

**Success Metrics:**

- All blog posts indexed in Google
- Sitemap submitted and verified
- No crawl errors

### Phase 3: Content Enhancement (Week 3) - Target: +15-20 points

#### 8. CTA Components (+4 points)

**Objective:** Convert readers into job seekers/applicants

**Tasks:**

- [ ] Create job application CTA component
  - "Find [Certification] Jobs"
  - Link to filtered job search
- [ ] Add certification enrollment CTAs
  - "Get Certified in [Skill]"
  - Link to certification resources
- [ ] Add newsletter signup CTA
  - "Get Weekly Healthcare Job Tips"
- [ ] Track CTA performance
  - Click-through rates
  - Conversion rates

**Files to create:**

- `apps/seeker-portal/components/blog/CTASection.tsx`
- `apps/seeker-portal/components/blog/JobApplicationCTA.tsx`
- `apps/seeker-portal/components/blog/NewsletterCTA.tsx`

**Success Metrics:**

- 5-10% CTA click-through rate
- Increased job applications from blog
- Newsletter signups

#### 10. Enhanced Content Structure (+3 points)

**Objective:** Improve readability and navigation

**Tasks:**

- [ ] Enforce proper heading hierarchy
  - H1 (title) > H2 (sections) > H3 (subsections)
- [ ] Implement jump links for long content
  - Sticky table of contents
  - Smooth scroll
- [ ] Add reading progress indicator
  - Progress bar at top
  - Percentage complete

**Files to create:**

- `apps/seeker-portal/components/blog/ReadingProgress.tsx`
- `apps/seeker-portal/components/blog/JumpLinks.tsx`

**Success Metrics:**

- Improved time on page
- Reduced scroll depth abandonment
- Better user engagement

#### 11. Social Proof & Data Visualization (+3 points)

**Objective:** Build trust and engagement with data

**Tasks:**

- [ ] Add statistics block to CMS
  - Highlight key numbers
  - Source attribution
- [ ] Create data visualization components
  - Charts for salary data
  - Graphs for job trends
- [ ] Add testimonial blocks
  - Success stories
  - Job placement stats

**Files to create:**

- `apps/cms/src/blocks/Statistics/config.ts`
- `apps/seeker-portal/components/blog/StatisticsBlock.tsx`
- `apps/seeker-portal/components/blog/DataVisualization.tsx`

**Success Metrics:**

- Increased social shares
- Improved trust signals
- Higher conversion rates

### Phase 4: Off-Page & Monitoring (Week 4) - Target: +5-10 points

#### 12. Social Sharing Optimization (+2 points)

**Objective:** Increase social media visibility and traffic

**Tasks:**

- [ ] Enhance Open Graph images
  - Custom OG images per post
  - Include branding
  - Optimal dimensions (1200x630)
- [ ] Add Twitter Card validation
  - Test with Twitter validator
  - Optimize card type
- [ ] Implement Web Share API
  - Native sharing on mobile
  - Fallback for desktop

**Files to modify:**

- `apps/seeker-portal/app/(base-layout)/blog/[slug]/page.tsx`
- `apps/seeker-portal/components/blog/BlogPostDetail.tsx`

**Success Metrics:**

- Increased social shares
- Better social media CTR
- More referral traffic

#### 13. Monitoring & Analytics (+3 points)

**Objective:** Track SEO performance and identify issues

**Tasks:**

- [ ] Set up Google Search Console tracking
  - Verify domain
  - Submit sitemap
  - Monitor impressions/clicks
- [ ] Implement Core Web Vitals monitoring
  - Real user metrics
  - Performance alerts
- [ ] Add structured data testing
  - Validate schemas
  - Monitor rich results
- [ ] Track keyword rankings
  - Target keywords
  - Competitor analysis

**Files to create:**

- `apps/seeker-portal/lib/analytics/seo-tracking.ts`

**Success Metrics:**

- GSC data flowing
- Core Web Vitals tracked
- Keyword rankings monitored

#### 14. Backlink Strategy (External - No code changes)

**Objective:** Build domain authority through quality backlinks

**Tasks:**

- [ ] Create outreach list
  - Nursing colleges
  - Healthcare education portals
  - Medical associations
  - Healthcare job boards
- [ ] Guest posting opportunities
  - Healthcare blogs
  - Industry publications
- [ ] Healthcare association partnerships
  - Content collaborations
  - Resource sharing
- [ ] Create linkable assets
  - Healthcare salary guides
  - Certification comparison tools
  - Career path visualizations

**Success Metrics:**

- 10+ quality backlinks per month
- Increased domain authority
- Referral traffic from backlinks

## Content Gaps to Capture

Since this is HospitalJobs.in content, leverage insider data:

- [ ] Real salary data from platform's hiring trends
- [ ] Regional salary variations across India
- [ ] What employers actually seek (vs. generic lists)
- [ ] Job placement timelines and success rates
- [ ] ROI analysis (certification cost vs. salary increase)
- [ ] Work-life balance by healthcare role

## Measurement Strategy

### Key Metrics to Track Monthly

**Google Search Console:**

- Impressions
- Clicks
- Average position
- Click-through rate

**Core Web Vitals:**

- LCP (Largest Contentful Paint)
- FID (First Input Delay)
- CLS (Cumulative Layout Shift)

**Business Metrics:**

- Organic traffic
- Qualified job applications from blog
- Newsletter signups
- Time on page
- Bounce rate

### Success Criteria

**3 Months:**

- SEO score: 75+/100
- Top 5 rankings for "healthcare certifications for freshers"
- 200-400% increase in organic traffic
- 30-50% increase in qualified job applications

**6 Months:**

- SEO score: 85+/100
- Top 3 rankings for primary keywords
- 500%+ increase in organic traffic
- Established as healthcare career authority

## Technical Requirements

### CMS Schema Changes

**Posts Collection:**

```typescript
{
  careerDisclaimer: richText,
  reviewedBy: relationship(users),
  // updatedAt: Already exists in Payload CMS (auto-tracked)
  faqs: blocks(FAQ),
  internalLinks: array(link),
  ctaSections: blocks(CTA)
}
```

**Users Collection:**

```typescript
{
  credentials: text,
  expertise: array(text),
  linkedIn: url,
  twitter: url
}
```

### New Blocks Required

1. FAQ Block
2. Table Block
3. Statistics Block
4. CTA Block
5. Internal Link Block

### Performance Targets

- Page load time: < 2s
- Time to Interactive: < 3s
- First Contentful Paint: < 1s
- Lighthouse Score: > 90

## Risk Mitigation

**Risk:** Content changes may temporarily affect rankings
**Mitigation:** Implement changes gradually, monitor GSC closely

**Risk:** Schema markup errors may prevent rich results
**Mitigation:** Validate all schemas with Google's testing tool

**Risk:** Performance optimizations may break functionality
**Mitigation:** Test thoroughly on staging, implement feature flags

## Dependencies

- Payload CMS access for schema changes
- Google Search Console access
- Analytics/monitoring tools setup
- Design assets for CTAs and social images

## Timeline Summary

| Week | Focus                 | Expected Score |
| ---- | --------------------- | -------------- |
| 1    | Critical Priorities   | 40-45/100      |
| 2    | Technical SEO         | 55-60/100      |
| 3    | Content Enhancement   | 70-75/100      |
| 4    | Off-Page & Monitoring | 75-80+/100     |

## Approval & Sign-off

- [ ] Product Owner
- [ ] Engineering Lead
- [ ] Content Team
- [ ] Marketing Team

---

**Document Version:** 1.0
**Last Updated:** 2025-01-27
**Owner:** Engineering Team
**Status:** Draft
