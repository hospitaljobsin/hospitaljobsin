# PRD: Server-Side Rendered FAQ Page

## Overview
Create a static, server-side rendered FAQ page on the seeker portal that provides answers to common questions for both job seekers and recruiters using HospitalJobs.in.

## Objectives
- Provide clear, accessible answers to frequently asked questions
- Improve SEO with proper meta tags and structured content
- Maintain consistent branding with HeroUI v2 components
- Ensure fast page load with SSR

## Technical Specifications

### Route
- **Path**: `/faq`
- **Location**: `apps/seeker-portal/app/faq/page.tsx`
- **Rendering**: Server-side rendered (no client components needed)

### SEO Requirements
- **Meta Title**: `FAQ Guide for Job Seekers & Employers | Hospital Jobs`
- **Meta Description**: `Explore our FAQ section to learn how HospitalJobs.in helps job seekers apply for hospital jobs and recruiters post verified openings. Simple, secure, and AI-powered for healthcare hiring in India.`

### Content Structure

#### Section 1: For Job Seekers (10 Questions)
1. What is HospitalJobs.in and how does it work?
2. Is HospitalJobs.in free for job seekers?
3. Can I find both private and government hospital jobs here?
4. How do I apply for a hospital job through the website?
5. Can I upload my resume or CV directly?
6. How can I track my job applications?
7. Can I apply for multiple jobs at once?
8. Can recruiters contact me directly through the website?
9. Can I receive job alerts based on my location or role?
10. Is my personal data safe on HospitalJobs.in?

#### Section 2: For Recruiters & Hospitals (15 Questions)
1. How can hospitals or healthcare recruiters post job openings?
2. Is there a cost to list hospital jobs on HospitalJobs.in?
3. Can I post multiple job openings at once?
4. Can I feature or highlight my job posts for better visibility?
5. How do I check the applications received for a job?
6. Can I download candidate resumes directly from the platform?
7. Are there tools to filter or shortlist applicants?
8. How do I register as an employer or recruiter?
9. Can multiple HR staff access the same hospital account?
10. How can I remove outdated or filled positions?
11. How do I contact HospitalJobs.in support for help?
12. Are all job seekers verified before applying?
13. Can I promote my hospital profile to attract more applicants?
14. Is candidate data secure and protected under privacy policies?
15. Do you offer analytics or insights for posted jobs?

## Design Requirements

### Layout
- Full-width container with max-width constraint
- Two-column layout on desktop (if beneficial), single column on mobile
- Clear visual separation between job seeker and recruiter sections
- Sticky/fixed navigation to jump between sections (optional)

### Components to Use
- HeroUI v2 `Accordion` component for collapsible Q&A items
- HeroUI v2 `Card` or `Divider` for section separation
- Tailwind CSS v4 for spacing and responsive design
- Semantic HTML (`<h1>`, `<h2>`, `<section>`) for accessibility and SEO

### Visual Hierarchy
- Page title (H1): "Frequently Asked Questions"
- Section titles (H2): "For Job Seekers" and "For Recruiters & Hospitals"
- Questions as accordion headers
- Answers as accordion content

## Implementation Checklist
- [ ] Create `/faq` route in seeker portal
- [ ] Add metadata export with title and description
- [ ] Implement page component with HeroUI Accordion
- [ ] Structure content into two sections
- [ ] Add all 25 questions with placeholder/actual answers
- [ ] Ensure mobile responsiveness
- [ ] Verify SSR (no "use client" directive)
- [ ] Test accessibility (keyboard navigation, screen readers)

## Out of Scope
- Dynamic FAQ content from CMS/database
- Search functionality within FAQ
- User feedback/rating on answers
- Related articles or links (unless trivial)

## Success Criteria
- Page loads in <1s on 3G connection
- All questions are visible and expandable
- Meta tags render correctly in search results
- Page is fully accessible (WCAG AA compliant)
- Mobile and desktop layouts work seamlessly
