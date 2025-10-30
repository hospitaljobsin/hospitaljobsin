# ClusterJobsList Relay Integration - PRD

## Executive Summary

Migrate the ClusterJobsList component from mock data to production-ready Relay GraphQL integration with cursor-based pagination, real-time filtering, and optimized data fetching for map-based job browsing.

**Current State:** Component uses mock data with simulated pagination
**Backend Status:** ✅ **COMPLETE** - `clusterJobs` GraphQL field is implemented and ready
**Target State:** Full Relay integration with GraphQL queries, fragments, and connection-based pagination
**Expected Impact:** Production-ready map job browsing with real data, improved performance, and seamless integration with existing job search infrastructure

**Technical Stack:** React Relay, GraphQL, TypeScript, IntersectionObserver API

---

## Problem Statement

### Current Implementation Issues

1. **Mock Data Dependency:** Component currently generates fake job data, preventing production deployment
2. **No Real Pagination:** Simulated pagination doesn't reflect actual backend capabilities
3. **Missing Filter Integration:** Filters don't actually query the backend
4. **Incomplete Type Safety:** Mock data types don't match actual GraphQL schema
5. **No Data Caching:** Missing Relay's automatic caching and normalization benefits

### User Impact

- **Cannot Browse Real Jobs:** Users see placeholder data instead of actual job listings
- **Inaccurate Counts:** Cluster job counts don't reflect reality
- **No Filter Effectiveness:** Applying filters doesn't change results
- **Poor Performance:** No query optimization or data reuse

---

## Solution Overview

Implement **Full Relay GraphQL Integration** using the existing `clusterJobs` backend field:

### Core Features

1. **GraphQL Fragment Definition:** Define ClusterJobsListFragment with proper pagination
2. **Cursor-Based Pagination:** Use Relay's @connection directive for infinite scroll
3. **Filter Integration:** Support all existing job filters (experience, salary, work mode, etc.)
4. **H3 Index Querying:** Query jobs by H3 geospatial index
5. **Optimistic Updates:** Leverage Relay's caching for instant UI updates

---

## Backend GraphQL Schema (Already Implemented ✅)

The backend `clusterJobs` field is already implemented with the following signature:

```graphql
type Query {
  """
  Get paginated jobs within a specific H3 hexagon cluster for drill-down.
  """
  clusterJobs(
    """
    H3 hexagon index to retrieve jobs from
    """
    h3Index: String!

    """
    H3 resolution level used for clustering
    """
    h3Resolution: Int!

    """
    Filter by work mode
    """
    workMode: [JobWorkModeFilter!] = null

    """
    Filter by job type
    """
    jobType: [JobTypeFilter!] = null

    """
    Search term for full-text search
    """
    searchTerm: String = null

    """
    Location filter for proximity search
    """
    location: String = null

    """
    Proximity radius in kilometers
    """
    proximityKm: Float = null

    """
    Minimum years of experience required
    """
    minExperience: Int = null

    """
    Maximum years of experience required
    """
    maxExperience: Int = null

    """
    Minimum salary for the job
    """
    minSalary: Int = null

    """
    Maximum salary for the job
    """
    maxSalary: Int = null

    """
    Returns items before the given cursor
    """
    before: ID = null

    """
    Returns items after the given cursor
    """
    after: ID = null

    """
    How many items to return after the cursor?
    """
    first: Int = null

    """
    How many items to return before the cursor?
    """
    last: Int = null
  ): JobConnection!
}

type JobConnection {
  pageInfo: PageInfo!
  edges: [JobEdge!]!
  totalCount: Int
}

type JobEdge {
  cursor: String!
  node: Job!
}

type Job {
  id: ID!
  slug: String!
  title: String!
  location: String
  minSalary: Int
  maxSalary: Int
  currency: Currency!
  minExperience: Int
  maxExperience: Int
  type: JobType
  workMode: WorkMode
  skills: [String!]!
  organization: Organization
  # ... other fields
}
```

---

## Frontend Implementation Guide

### Step 1: Define GraphQL Fragments

Create the fragment structure for ClusterJobsList component:

```typescript
// apps/seeker-portal/components/search/map/ClusterJobsList.tsx
import { graphql } from "relay-runtime";
import { usePaginationFragment, useFragment } from "react-relay";

const ClusterJobsListFragment = graphql`
  fragment ClusterJobsListFragment on Query
  @argumentDefinitions(
    h3Index: { type: "String!" }
    h3Resolution: { type: "Int!" }
    searchTerm: { type: "String" }
    location: { type: "String" }
    proximityKm: { type: "Float" }
    minExperience: { type: "Int" }
    minSalary: { type: "Int" }
    maxSalary: { type: "Int" }
    workMode: { type: "[JobWorkModeFilter!]" }
    jobType: { type: "[JobTypeFilter!]" }
  ) {
    ...ClusterJobsListInternalFragment
      @arguments(
        h3Index: $h3Index
        h3Resolution: $h3Resolution
        searchTerm: $searchTerm
        location: $location
        proximityKm: $proximityKm
        minExperience: $minExperience
        minSalary: $minSalary
        maxSalary: $maxSalary
        workMode: $workMode
        jobType: $jobType
      )
    viewer {
      ...JobControlsAuthFragment
    }
  }
`;

const ClusterJobsListInternalFragment = graphql`
  fragment ClusterJobsListInternalFragment on Query
  @refetchable(queryName: "ClusterJobsListRefetchQuery")
  @argumentDefinitions(
    cursor: { type: "ID" }
    count: { type: "Int", defaultValue: 20 }
    h3Index: { type: "String!" }
    h3Resolution: { type: "Int!" }
    searchTerm: { type: "String" }
    location: { type: "String" }
    proximityKm: { type: "Float" }
    minExperience: { type: "Int" }
    minSalary: { type: "Int" }
    maxSalary: { type: "Int" }
    workMode: { type: "[JobWorkModeFilter!]" }
    jobType: { type: "[JobTypeFilter!]" }
  ) {
    clusterJobs(
      after: $cursor
      first: $count
      h3Index: $h3Index
      h3Resolution: $h3Resolution
      searchTerm: $searchTerm
      location: $location
      proximityKm: $proximityKm
      minExperience: $minExperience
      minSalary: $minSalary
      maxSalary: $maxSalary
      workMode: $workMode
      jobType: $jobType
    )
      @connection(
        key: "ClusterJobsListFragment_clusterJobs"
        filters: [
          "h3Index"
          "h3Resolution"
          "searchTerm"
          "location"
          "proximityKm"
          "minExperience"
          "minSalary"
          "maxSalary"
          "workMode"
          "jobType"
        ]
      ) {
      totalCount
      edges {
        node {
          id
          ...CompactJobCardFragment
          ...JobControlsFragment
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;
```

### Step 2: Update Component Implementation

Replace mock data logic with Relay hooks:

```typescript
// apps/seeker-portal/components/search/map/ClusterJobsList.tsx
"use client";

import { Skeleton } from "@heroui/react";
import { useCallback, useEffect, useRef, useTransition } from "react";
import { useFragment, usePaginationFragment } from "react-relay";
import type { ClusterJobsListFragment$key } from "@/__generated__/ClusterJobsListFragment.graphql";
import type { ClusterJobsListInternalFragment$key } from "@/__generated__/ClusterJobsListInternalFragment.graphql";
import type { ClusterJobsListRefetchQuery } from "@/__generated__/ClusterJobsListRefetchQuery.graphql";
import CompactJobCard from "./CompactJobCard";

interface ClusterJobsListProps {
  queryRef: ClusterJobsListFragment$key;
  h3Index: string;
  h3Resolution: number;
  clusterInfo?: {
    count: number;
    center: [number, number];
  } | null;
  filters: {
    searchTerm: string | null;
    location: string | null;
    minExperience: number | null;
    minSalary: number | null;
    maxSalary: number | null;
    proximityKm: number;
    workMode: readonly string[];
    jobType: readonly string[];
  };
  onJobSelect?: (jobId: string) => void;
  className?: string;
}

export default function ClusterJobsList({
  queryRef,
  h3Index,
  h3Resolution,
  clusterInfo,
  filters,
  onJobSelect,
  className = "",
}: ClusterJobsListProps) {
  const [_isPending, startTransition] = useTransition();
  const root = useFragment(ClusterJobsListFragment, queryRef);

  const { data, loadNext, hasNext, isLoadingNext, refetch } =
    usePaginationFragment<
      ClusterJobsListRefetchQuery,
      ClusterJobsListInternalFragment$key
    >(ClusterJobsListInternalFragment, root);

  const observerRef = useRef<HTMLDivElement | null>(null);
  const hasMountedRef = useRef(false);

  const connection = data.clusterJobs;
  const jobs = connection?.edges.map((edge) => edge.node) || [];
  const totalCount = connection?.totalCount || 0;
  const hasNextPage = connection?.pageInfo.hasNextPage || false;

  // Set up IntersectionObserver for infinite scroll
  useEffect(() => {
    if (!observerRef.current || !hasNextPage || isLoadingNext) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isLoadingNext) {
          loadNext(20);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(observerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [hasNextPage, isLoadingNext, loadNext]);

  // Refetch when filters change
  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }

    const debounceTimeout = setTimeout(() => {
      startTransition(() => {
        refetch(
          {
            h3Index,
            h3Resolution,
            searchTerm: filters.searchTerm || undefined,
            location: filters.location || undefined,
            proximityKm: filters.proximityKm || undefined,
            minExperience: filters.minExperience || undefined,
            minSalary: filters.minSalary || undefined,
            maxSalary: filters.maxSalary || undefined,
            workMode: filters.workMode as any,
            jobType: filters.jobType as any,
          },
          { fetchPolicy: "network-only" }
        );
      });
    }, 300);

    return () => clearTimeout(debounceTimeout);
  }, [
    refetch,
    h3Index,
    h3Resolution,
    filters.searchTerm,
    filters.location,
    filters.proximityKm,
    filters.minExperience,
    filters.minSalary,
    filters.maxSalary,
    filters.workMode,
    filters.jobType,
  ]);

  if (jobs.length === 0 && !hasNextPage) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <p className="text-sm text-foreground-500 mb-2">
          No jobs found in this cluster
        </p>
        <p className="text-xs text-foreground-400">
          Try adjusting your filters or selecting a different area
        </p>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Cluster Header */}
      {clusterInfo && (
        <div className="mb-4 p-3 bg-primary-50 rounded-lg border border-primary-200">
          <h3 className="text-sm font-semibold text-primary-900 mb-1">
            Selected Cluster
          </h3>
          <p className="text-xs text-primary-700">
            {totalCount} jobs in this area
          </p>
          <p className="text-xs text-primary-600">
            Center: {clusterInfo.center[0].toFixed(4)},{" "}
            {clusterInfo.center[1].toFixed(4)}
          </p>
        </div>
      )}

      {/* Jobs List */}
      <div className="space-y-2">
        {jobs.map((job) => (
          <CompactJobCard
            key={job.id}
            job={job}
            authQueryRef={root.viewer}
            onClick={() => onJobSelect?.(job.id)}
            className="border border-divider hover:border-primary-200"
          />
        ))}

        {/* Infinite scroll trigger element */}
        {hasNextPage && jobs.length > 0 && (
          <div ref={observerRef} className="py-4">
            {isLoadingNext && (
              <div className="space-y-2">
                {Array.from({ length: 3 }, (_, i) => (
                  <div
                    key={`loading-${i}`}
                    className="p-3 border border-divider rounded-lg"
                  >
                    <Skeleton className="h-4 w-3/4 rounded mb-2" />
                    <Skeleton className="h-3 w-1/2 rounded mb-2" />
                    <div className="flex gap-2">
                      <Skeleton className="h-3 w-16 rounded" />
                      <Skeleton className="h-3 w-16 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* No More Results */}
        {!hasNextPage && jobs.length > 0 && (
          <p className="text-center text-xs text-foreground-500 py-2">
            All jobs in this cluster loaded
          </p>
        )}
      </div>
    </div>
  );
}
```

### Step 3: Update Parent Component Query

Update the parent component to include the ClusterJobsList fragment:

```typescript
// apps/seeker-portal/components/search/map/JobMapView.tsx (or parent component)
import { graphql } from "relay-runtime";
import { useLazyLoadQuery } from "react-relay";

const JobMapViewQuery = graphql`
  query JobMapViewQuery(
    $h3Index: String!
    $h3Resolution: Int!
    $searchTerm: String
    $location: String
    $proximityKm: Float
    $minExperience: Int
    $minSalary: Int
    $maxSalary: Int
    $workMode: [JobWorkModeFilter!]
    $jobType: [JobTypeFilter!]
  ) {
    ...ClusterJobsListFragment
      @arguments(
        h3Index: $h3Index
        h3Resolution: $h3Resolution
        searchTerm: $searchTerm
        location: $location
        proximityKm: $proximityKm
        minExperience: $minExperience
        minSalary: $minSalary
        maxSalary: $maxSalary
        workMode: $workMode
        jobType: $jobType
      )
  }
`;
```

### Step 4: Remove Mock Data

Remove all mock data generation logic from the ClusterJobsList component:

- Remove `generateMockJobs` function
- Remove `mockJobs` state
- Remove simulated pagination logic
- Remove any setTimeout/setInterval for mock data

---

## Implementation Checklist

### Frontend Tasks

- [ ] **Define GraphQL Fragments**

  - [ ] Create `ClusterJobsListFragment`
  - [ ] Create `ClusterJobsListInternalFragment` with `@refetchable`
  - [ ] Add proper `@argumentDefinitions` for all filter parameters

- [ ] **Update Component Logic**

  - [ ] Replace mock data with `usePaginationFragment` hook
  - [ ] Implement filter refetch logic with debouncing
  - [ ] Set up IntersectionObserver for infinite scroll
  - [ ] Handle loading and error states

- [ ] **Update Parent Component**

  - [ ] Add ClusterJobsList fragment to parent query
  - [ ] Pass `queryRef` prop to ClusterJobsList
  - [ ] Ensure h3Index and h3Resolution are provided

- [ ] **Remove Mock Data**

  - [ ] Delete all mock data generation code
  - [ ] Remove simulated pagination logic
  - [ ] Clean up unused imports and functions

- [ ] **Testing**
  - [ ] Test infinite scroll behavior
  - [ ] Test filter changes and refetch
  - [ ] Test cluster switching
  - [ ] Verify proper error handling

---

## Success Metrics

### Functional Requirements

- ✅ Real job data loads from GraphQL API
- ✅ Infinite scroll works with cursor-based pagination
- ✅ Filters properly refetch data
- ✅ H3 cluster queries return correct jobs
- ✅ Job counts are accurate

### Performance Requirements

- ✅ Initial load < 500ms
- ✅ Pagination load < 300ms
- ✅ Filter refetch < 400ms
- ✅ Smooth 60fps scrolling
- ✅ Efficient cache utilization

### User Experience

- ✅ Seamless infinite scroll
- ✅ No loading flicker
- ✅ Accurate job counts
- ✅ Fast filter application
- ✅ Proper error handling

---

## Risk Mitigation

### Technical Risks

**Risk:** Filter changes causing full refetch
**Mitigation:** Use Relay's connection filters to maintain cache when possible

**Risk:** Stale data in cache
**Mitigation:** Implement proper cache invalidation, use network-only for critical updates

---

## Timeline

**Total Estimated Time:** 2-3 days

- **Day 1:** Fragment definition and component migration
- **Day 2:** Testing, optimization, and bug fixes
- **Day 3:** Final polish and deployment

---

## Acceptance Criteria

1. ✅ ClusterJobsList loads real jobs from GraphQL API
2. ✅ Infinite scroll works smoothly with cursor pagination
3. ✅ All filters (experience, salary, work mode, job type) work correctly
4. ✅ H3 cluster mode queries jobs by geospatial index
5. ✅ Job counts are accurate and match cluster data
6. ✅ Performance meets requirements (<500ms initial load)
7. ✅ Error states are handled gracefully
8. ✅ Component is fully typed with TypeScript
9. ✅ No mock data remains in the codebase
10. ✅ Integration tests pass for all scenarios

---

## Notes

- The backend `clusterJobs` field is **already implemented** and ready to use
- The `h3Resolution` parameter is required by the backend - ensure it's passed from the parent component
- Use the existing `CompactJobCardFragment` for job card data
- Follow the same patterns used in `SearchJobsList` for consistency
- Ensure proper error boundaries are in place for production
