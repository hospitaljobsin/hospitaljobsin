# Phase 2: Quick Reference Guide

## What Was Changed

### 1. Image Optimization (`CMSImage.tsx`)
```typescript
// Usage in blog posts
<CMSImage
  src={post.heroImage.url}
  alt={post.title}
  fill
  priority  // ← NEW: For hero images above the fold
  sizes="(max-width: 1200px) 100vw, 1200px"
/>

// For images below the fold (automatic lazy loading)
<CMSImage
  src={image.url}
  alt={image.alt}
  width={800}
  height={600}
  // No priority prop = lazy loading
/>
```

### 2. Font Loading (`layout.tsx`)
```typescript
const workSans = Work_Sans({
  variable: '--font-work-sans',
  subsets: ['latin'],
  display: 'swap'  // ← NEW: Prevents invisible text
});
```

### 3. Mobile Meta Tags (`layout.tsx`)
```typescript
viewport: {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true
},
themeColor: [
  { media: '(prefers-color-scheme: light)', color: '#ffffff' },
  { media: '(prefers-color-scheme: dark)', color: '#000000' }
]
```

### 4. Sitemap Updates (`sitemap.ts`)
```typescript
// Now uses updatedAt for blog posts
lastModified: post.updatedAt
  ? new Date(post.updatedAt)
  : post.publishedAt
    ? new Date(post.publishedAt)
    : new Date()
```

### 5. OpenGraph Metadata (`blog/[slug]/page.tsx`)
```typescript
openGraph: {
  // ...
  publishedTime: publishedTime,
  modifiedTime: modifiedTime,  // ← NEW: Shows content freshness
  // ...
}
```

## Testing Checklist

- [ ] Run `npm run build` to verify no build errors
- [ ] Test blog post page loads correctly
- [ ] Verify hero image loads with priority
- [ ] Check images below fold lazy load
- [ ] Test on mobile device (viewport meta tag)
- [ ] Verify theme-color in mobile browser
- [ ] Check sitemap.xml includes blog posts
- [ ] Verify lastmod dates in sitemap
- [ ] Test PageSpeed Insights score
- [ ] Submit sitemap to Google Search Console

## Performance Targets

| Metric | Before | Target | How to Measure |
|--------|--------|--------|----------------|
| LCP | TBD | < 2.5s | PageSpeed Insights |
| FID | TBD | < 100ms | PageSpeed Insights |
| CLS | TBD | < 0.1 | PageSpeed Insights |
| Mobile Score | TBD | 90+ | PageSpeed Insights |

## Manual Steps Required

1. **Google Search Console**
   - Go to: https://search.google.com/search-console
   - Add property: hospitaljobs.in
   - Verify ownership (DNS or HTML file)
   - Submit sitemap: https://hospitaljobs.in/sitemap.xml
   - Monitor indexing status

2. **Performance Testing**
   - Test URL: https://pagespeed.web.dev/
   - Enter: https://hospitaljobs.in/blog/[any-post-slug]
   - Check Core Web Vitals scores
   - Document before/after results

3. **Mobile Testing**
   - Test URL: https://search.google.com/test/mobile-friendly
   - Enter blog post URL
   - Verify passes mobile-friendly test

## Rollback Plan

If issues occur, revert these files:
```bash
git checkout HEAD~1 -- apps/seeker-portal/components/blog/CMSImage.tsx
git checkout HEAD~1 -- apps/seeker-portal/app/layout.tsx
git checkout HEAD~1 -- apps/seeker-portal/app/sitemap.ts
git checkout HEAD~1 -- apps/seeker-portal/app/(base-layout)/blog/[slug]/page.tsx
```

## Support

For questions or issues:
1. Check implementation summary: `prds/phase-2-implementation-summary.md`
2. Review Next.js Image docs: https://nextjs.org/docs/app/building-your-application/optimizing/images
3. Check Core Web Vitals guide: https://web.dev/vitals/
