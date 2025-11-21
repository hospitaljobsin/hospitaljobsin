# PRD: CMS Authentication Sharing for Draft Content Access

## Executive Summary

Enable Payload CMS authentication cookies/tokens to be accessible from the seeker portal (`hospitaljobs.in`) so that draft posts can be fetched and displayed in live preview mode.

## Problem Statement

### Current State
- **Payload CMS** runs at `content.hospitaljobs.in` with its own authentication
- **Seeker Portal** runs at `hospitaljobs.in`
- **Issue**: When CMS users try to preview draft posts, the seeker portal cannot access draft content because it lacks CMS authentication credentials
- CMS auth cookies are scoped to `content.hospitaljobs.in` and not accessible from `hospitaljobs.in`

### Desired State
- CMS authentication is accessible from seeker portal
- Draft posts can be fetched and displayed in live preview
- Minimal changes to existing systems

## Goals

1. Share Payload CMS authentication with seeker portal
2. Enable draft content fetching from seeker portal
3. Maintain security (only authenticated CMS users can see drafts)

## Technical Solution

### Option 1: Shared Cookie Domain (Recommended)

Configure Payload CMS cookies to use the parent domain `.hospitaljobs.in` so they're accessible from all subdomains.

#### Implementation

**1. Update Payload CMS Cookie Configuration**

```typescript
// apps/cms/src/payload.config.ts
export default buildConfig({
  // ... existing config

  admin: {
    // ... existing admin config
  },

  // Configure cookie settings
  cookiePrefix: 'payload',

  // Custom cookie configuration
  express: {
    // This will be passed to express-session or similar
    cookie: {
      domain: process.env.NODE_ENV === 'production'
        ? '.hospitaljobs.in'  // Shared across all subdomains
        : '.localtest.me',     // Development
      secure: true,
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
    }
  }
});
```

**2. Update Seeker Portal to Include CMS Cookies**

```typescript
// apps/seeker-portal/src/lib/payload.ts
export async function fetchDraftPost(slug: string) {
  // Cookies are automatically included in same-domain requests
  const response = await fetch(
    `https://content.hospitaljobs.in/api/posts?where[slug][equals]=${slug}&draft=true`,
    {
      credentials: 'include', // Include cookies
      headers: {
        'Content-Type': 'application/json',
      }
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch draft post');
  }

  return response.json();
}
```

**3. Update Live Preview Configuration**

```typescript
// apps/cms/src/utilities/generatePreviewPath.ts
export const generatePreviewPath = ({
  collection,
  slug,
}: {
  collection: string;
  slug: string;
}): string => {
  const baseUrl = process.env.NEXT_PUBLIC_SEEKER_PORTAL_URL || 'https://hospitaljobs.in';

  // Preview URL will automatically have access to CMS cookies
  return `${baseUrl}/preview/${collection}/${slug}`;
};
```

**4. Create Preview Route in Seeker Portal**

```typescript
// apps/seeker-portal/src/app/preview/posts/[slug]/route.ts
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const cookieStore = cookies();

  // Check if user has CMS auth cookie
  const payloadToken = cookieStore.get('payload-token');

  if (!payloadToken) {
    return new Response('Unauthorized - CMS login required', { status: 401 });
  }

  // Fetch draft post with CMS authentication
  const response = await fetch(
    `https://content.hospitaljobs.in/api/posts?where[slug][equals]=${params.slug}&draft=true`,
    {
      headers: {
        Cookie: `payload-token=${payloadToken.value}`,
      }
    }
  );

  if (!response.ok) {
    return new Response('Draft not found', { status: 404 });
  }

  const { docs } = await response.json();
  const post = docs[0];

  // Redirect to post page with draft data
  redirect(`/blog/${params.slug}?draft=true&draftData=${encodeURIComponent(JSON.stringify(post))}`);
}
```

### Option 2: JWT Token Passing (Alternative)

If cookie sharing doesn't work, pass JWT token via URL parameter.

#### Implementation

**1. Generate Preview URL with Token**

```typescript
// apps/cms/src/utilities/generatePreviewPath.ts
export const generatePreviewPath = async ({
  collection,
  slug,
  req,
}: {
  collection: string;
  slug: string;
  req: PayloadRequest;
}): Promise<string> => {
  const baseUrl = process.env.NEXT_PUBLIC_SEEKER_PORTAL_URL || 'https://hospitaljobs.in';

  // Get JWT token from request
  const token = req.user?.token || req.headers.authorization?.replace('Bearer ', '');

  // Pass token as query parameter
  return `${baseUrl}/preview/${collection}/${slug}?token=${token}`;
};
```

**2. Validate Token in Seeker Portal**

```typescript
// apps/seeker-portal/src/app/preview/posts/[slug]/route.ts
import { redirect } from 'next/navigation';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  if (!token) {
    return new Response('Unauthorized - Token required', { status: 401 });
  }

  // Fetch draft post with token
  const response = await fetch(
    `https://content.hospitaljobs.in/api/posts?where[slug][equals]=${params.slug}&draft=true`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    }
  );

  if (!response.ok) {
    return new Response('Draft not found or invalid token', { status: 404 });
  }

  const { docs } = await response.json();
  const post = docs[0];

  redirect(`/blog/${params.slug}?draft=true&draftData=${encodeURIComponent(JSON.stringify(post))}`);
}
```

## Implementation Plan

### Phase 1: Cookie Configuration (Week 1)

#### Step 1.1: Update Payload CMS Cookie Settings
- [ ] Configure cookie domain to `.hospitaljobs.in` (production) and `.localtest.me` (dev)
- [ ] Test cookie accessibility across subdomains
- [ ] Verify existing CMS functionality still works

**Files to modify:**
- `apps/cms/src/payload.config.ts`
- `apps/cms/.env` (add cookie domain config)

#### Step 1.2: Test Cookie Sharing
- [ ] Log into CMS at `content.hospitaljobs.in`
- [ ] Verify cookie is accessible from `hospitaljobs.in` (check browser DevTools)
- [ ] Confirm cookie attributes (domain, secure, httpOnly, sameSite)

### Phase 2: Seeker Portal Integration (Week 1)

#### Step 2.1: Create Preview Route
- [ ] Create preview route handler in seeker portal
- [ ] Extract CMS auth cookie from request
- [ ] Fetch draft content from Payload API
- [ ] Handle authentication errors

**New files:**
- `apps/seeker-portal/src/app/preview/posts/[slug]/route.ts`

#### Step 2.2: Update Live Preview Config
- [ ] Update `generatePreviewPath` to point to seeker portal preview route
- [ ] Test preview button in CMS
- [ ] Verify draft content loads correctly

**Files to modify:**
- `apps/cms/src/utilities/generatePreviewPath.ts`

### Phase 3: Draft Content Display (Week 2)

#### Step 3.1: Handle Draft Data in Seeker Portal
- [ ] Update post page to accept draft data
- [ ] Add draft indicator banner
- [ ] Style draft content differently

**Files to modify:**
- `apps/seeker-portal/src/app/blog/[slug]/page.tsx`

#### Step 3.2: Error Handling
- [ ] Handle missing authentication
- [ ] Handle expired tokens
- [ ] Handle non-existent drafts
- [ ] Add user-friendly error messages

### Phase 4: Testing (Week 2)

#### Step 4.1: Manual Testing
- [ ] Test draft preview from CMS
- [ ] Test with expired session
- [ ] Test with non-CMS user
- [ ] Test across different browsers

#### Step 4.2: E2E Tests
- [ ] Create E2E test for draft preview flow
- [ ] Test authentication edge cases
- [ ] Test error scenarios

**New files:**
- `e2e/tests/cms-draft-preview.spec.ts`

## Configuration Changes

### Development Environment

```bash
# apps/cms/.env
COOKIE_DOMAIN=.localtest.me
NEXT_PUBLIC_SEEKER_PORTAL_URL=https://localtest.me
```

### Production Environment

```bash
# apps/cms/.env
COOKIE_DOMAIN=.hospitaljobs.in
NEXT_PUBLIC_SEEKER_PORTAL_URL=https://hospitaljobs.in
```

## Security Considerations

### 1. Cookie Security
- Use `secure: true` in production (HTTPS only)
- Use `httpOnly: true` to prevent XSS attacks
- Use `sameSite: 'lax'` to prevent CSRF while allowing navigation

### 2. Draft Content Access
- Only authenticated CMS users can access drafts
- Validate authentication on every draft request
- Don't cache draft content

### 3. CORS Configuration
- Ensure Payload API allows requests from seeker portal domain
- Include credentials in cross-origin requests

## Edge Cases & Error Handling

### 1. Expired Session
- **Scenario**: CMS session expires during preview
- **Handling**: Show "Session expired, please log in to CMS" message

### 2. Non-Existent Draft
- **Scenario**: Draft is deleted before preview loads
- **Handling**: Show "Draft not found" error, redirect to published version if exists

### 3. Unauthenticated Access
- **Scenario**: User tries to access preview URL without CMS login
- **Handling**: Show "CMS authentication required" message with login link

### 4. Cookie Blocked
- **Scenario**: Browser blocks third-party cookies
- **Handling**: Fall back to JWT token passing method (Option 2)

## Testing Checklist

- [ ] CMS login creates cookie with correct domain
- [ ] Cookie is accessible from seeker portal
- [ ] Draft content fetches successfully with cookie
- [ ] Preview displays draft content correctly
- [ ] Unauthenticated users cannot access drafts
- [ ] Expired sessions are handled gracefully
- [ ] Error messages are user-friendly
- [ ] Works across Chrome, Firefox, Safari

## Success Criteria

### Must Have
- ✅ CMS authentication accessible from seeker portal
- ✅ Draft posts display in live preview
- ✅ Only authenticated CMS users can see drafts
- ✅ No breaking changes to existing functionality

### Nice to Have
- Draft indicator banner in preview
- Smooth error handling
- E2E test coverage

## Timeline

- **Week 1**: Cookie configuration + preview route implementation
- **Week 2**: Draft display + testing

**Total Duration**: 2 weeks

## Rollback Plan

If cookie sharing doesn't work:
1. Revert cookie domain to subdomain-specific
2. Implement JWT token passing (Option 2)
3. Update preview URL generation to include token

## Conclusion

This minimal solution enables draft content preview by sharing Payload CMS authentication with the seeker portal through a shared cookie domain. The implementation is straightforward, secure, and doesn't require changes to the Python backend or complex authentication systems.
