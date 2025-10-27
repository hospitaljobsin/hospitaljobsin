# Scalable Map View with Dynamic Clustering - PRD

## Executive Summary

Transform the job map view from a limited 100-job display into a scalable, density-aware visualization system using H3 hexagonal hierarchical indexing. This enables displaying thousands of jobs efficiently by showing aggregated clusters at low zoom levels and individual markers only when appropriate.

**Key Inspiration:** Bandana.com's map interface - showing regional aggregation statistics at low zoom, transitioning to individual jobs at high zoom based on density.

---

## Problem Statement

### Current Limitations

1. **Scale Constraint:** Only displays first 100 jobs within viewport
2. **False Representation:** Doesn't show true job distribution across regions
3. **Performance Issues:** Client-side clustering struggles with large datasets
4. **Poor UX at National Scale:** Users can't see job density across India

### Business Impact

- Users miss job opportunities outside initial 100 results
- Cannot understand which regions have most opportunities
- Poor exploration experience for job seekers
- Competitive disadvantage vs. platforms with proper map clustering

---

## Solution Overview

Implement **H3 Hexagonal Hierarchical Geospatial Indexing** for server-side aggregation with dynamic rendering based on zoom level and job density.

### Core Principles

1. **Server-side Aggregation:** Backend computes job clusters using H3 indexes
2. **Zoom-based Resolution:** Finer hexagons as user zooms in
3. **Density-aware Rendering:** Show individual markers only when meaningful (<10 jobs per hexagon at zoom 13+)
4. **Progressive Disclosure:** Gradual detail increase as user explores

### Technology Stack

- **Backend:** H3-py (Uber's H3 Python bindings)
- **Frontend:** Leaflet with custom hexagon rendering
- **Caching:** Redis for aggregated results
- **Storage:** MongoDB with H3 multi-resolution indexes

---

## Technical Architecture

### 1. H3 Hexagonal Indexing System

#### What is H3?

H3 is Uber's open-source hierarchical geospatial indexing system that divides the world into hexagons at 16 resolution levels (0-15).

**Key Characteristics:**

- **Hierarchical:** Each hexagon at resolution N contains 7 hexagons at resolution N+1
- **Consistent Size:** Hexagons at same resolution have similar area (unlike squares)
- **Efficient:** Fast lookups and spatial operations
- **Industry Standard:** Used by Uber, major mapping platforms

#### Resolution to Zoom Level Mapping

| Leaflet Zoom | H3 Resolution | Hexagon Edge Length | Use Case                              |
| ------------ | ------------- | ------------------- | ------------------------------------- |
| 0-3          | 0-1           | 1000-500 km         | Country/Continent view                |
| 4-5          | 2-3           | 250-100 km          | State/Province view                   |
| 6-7          | 4-5           | 50-20 km            | City view                             |
| 8-9          | 6-7           | 10-5 km             | Neighborhood view                     |
| 10-11        | 8-9           | 2-1 km              | District view                         |
| 12           | 10            | 500 m               | Street view                           |
| 13-14        | 11            | 250 m               | Block view                            |
| 15+          | Individual    | N/A                 | Building level - show individual jobs |

**Decision Logic:**

```python
def get_h3_resolution_from_zoom(zoom_level: int) -> int:
    """Map Leaflet zoom level to H3 resolution"""
    if zoom_level <= 3: return 1
    elif zoom_level <= 5: return 3
    elif zoom_level <= 7: return 5
    elif zoom_level <= 9: return 7
    elif zoom_level <= 11: return 9
    elif zoom_level <= 12: return 10
    elif zoom_level <= 14: return 11
    else: return None  # Show individual markers
```

---

## Backend Implementation

### 1. Database Schema Changes

#### Job Document Updates

```python
class Job(Document):
    # ... existing fields ...

    geo: GeoObject | None = Field(default=None)  # Existing

    # NEW: H3 indexes at multiple resolutions for fast aggregation
    h3_indexes: dict[int, str] | None = Field(
        default=None,
        description="H3 indexes at different resolutions (0-11)",
    )
    # Example: {
    #     1: "8175fffffffffff",
    #     3: "8375fffffffffff",
    #     5: "8575fffffffffff",
    #     7: "8775fffffffffff",
    #     9: "8975fffffffffff",
    #     10: "8a75fffffffffff",
    #     11: "8b75fffffffffff",
    # }
```

#### Index Strategy

```python
# Multi-key index for efficient H3 aggregation
IndexModel(
    [("h3_indexes.$**", pymongo.ASCENDING), ("is_active", pymongo.ASCENDING)],
    name="h3_indexes_multikey_active_index",
)

# Existing geo index (keep for bounds filtering)
IndexModel(
    [("geo", pymongo.GEOSPHERE)],
    name="geo_2dsphere_index",
)
```

### 2. H3 Index Computation

```python
# In JobRepo class
import h3

def _compute_h3_indexes(self, geo: GeoObject) -> dict[int, str]:
    """Compute H3 indexes at multiple resolutions for a job location"""
    if not geo or not geo.coordinates:
        return None

    lng, lat = geo.coordinates

    # Compute indexes at resolutions we'll actually use for aggregation
    resolutions = [1, 3, 5, 7, 9, 10, 11]
    h3_indexes = {}

    for resolution in resolutions:
        h3_index = h3.latlng_to_cell(lat, lng, resolution)
        h3_indexes[resolution] = h3_index

    return h3_indexes

async def create(self, ...) -> Job:
    """Create job with H3 indexes"""
    # ... existing code ...

    h3_indexes = self._compute_h3_indexes(geo) if geo else None

    job = Job(
        # ... existing fields ...
        h3_indexes=h3_indexes,
    )

    await job.insert()
    return job
```

### 3. Aggregation Query

```python
async def get_aggregated_jobs_by_h3(
    self,
    bounds: BoundingBox,
    h3_resolution: int,
    # All existing filters
    search_term: str | None = None,
    location: str | None = None,
    proximity_km: float | None = None,
    min_experience: int | None = None,
    min_salary: int | None = None,
    max_salary: int | None = None,
    work_mode: list[WorkModeType] = [],
    job_type: list[JobKindType] = [],
) -> list[JobCluster]:
    """
    Aggregate jobs into H3 hexagons at specified resolution.

    Returns list of clusters with:
    - h3_index: Hexagon identifier
    - count: Number of jobs in hexagon
    - center: Lat/lng of hexagon center
    - bounds: Hexagon boundary vertices
    - sample_jobs: 1-3 sample jobs for preview
    - stats: Salary range, top specialties
    """

    h3_field = f"h3_indexes.{h3_resolution}"

    pipeline: list[dict[str, Any]] = [
        # 1. Filter active jobs
        {"$match": {"is_active": True}},

        # 2. Filter by bounding box (use existing geo index)
        {
            "$match": {
                "geo": {
                    "$geoWithin": {
                        "$box": [
                            [bounds.sw_lng, bounds.sw_lat],
                            [bounds.ne_lng, bounds.ne_lat],
                        ]
                    }
                }
            }
        },

        # 3. Filter by H3 index existence (jobs must have geo)
        {"$match": {h3_field: {"$exists": True}}},

        # 4. Apply other filters (search, salary, experience, etc.)
        # ... same as existing get_all_active() ...

        # 5. Group by H3 index
        {
            "$group": {
                "_id": f"${h3_field}",
                "count": {"$sum": 1},
                "sample_jobs": {
                    "$push": {
                        "_id": "$_id",
                        "title": "$title",
                        "organization": "$organization",
                        "location": "$location",
                        "min_salary": "$min_salary",
                        "max_salary": "$max_salary",
                        "currency": "$currency",
                        "type": "$type",
                        "work_mode": "$work_mode",
                        "geo": "$geo",
                    }
                },
                "min_salary": {"$min": "$min_salary"},
                "max_salary": {"$max": "$max_salary"},
                "specialties": {"$push": "$skills"},
            }
        },

        # 6. Limit sample jobs to 3 per cluster
        {
            "$project": {
                "_id": 0,
                "h3_index": "$_id",
                "count": 1,
                "sample_jobs": {"$slice": ["$sample_jobs", 3]},
                "min_salary": 1,
                "max_salary": 1,
                "specialties": {"$slice": [
                    {"$reduce": {
                        "input": "$specialties",
                        "initialValue": [],
                        "in": {"$setUnion": ["$$value", "$$this"]}
                    }},
                    3
                ]},
            }
        },

        # 7. Limit total clusters (performance)
        {"$limit": 1000},
    ]

    results = await Job.get_motor_collection().aggregate(pipeline).to_list(None)

    # Enhance results with H3 geometry
    clusters = []
    for result in results:
        h3_index = result["h3_index"]

        # Get hexagon center
        lat, lng = h3.cell_to_latlng(h3_index)

        # Get hexagon boundary
        boundary = h3.cell_to_boundary(h3_index)

        clusters.append(
            JobCluster(
                h3_index=h3_index,
                count=result["count"],
                center=GeoObject(coordinates=[lng, lat]),
                bounds=[[lat, lng] for lat, lng in boundary],
                sample_jobs=result["sample_jobs"],
                salary_range={
                    "min": result.get("min_salary"),
                    "max": result.get("max_salary"),
                },
                top_specialties=result.get("specialties", []),
            )
        )

    return clusters
```

### 4. Migration Script

```python
# scripts/backfill_h3_indexes.py
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import h3

async def backfill_h3_indexes():
    """Backfill H3 indexes for existing jobs"""
    client = AsyncIOMotorClient(MONGODB_URI)
    db = client[DB_NAME]
    jobs_collection = db["Job"]

    # Find all jobs with geo but no h3_indexes
    cursor = jobs_collection.find({
        "geo": {"$exists": True, "$ne": None},
        "h3_indexes": None,
    })

    batch_size = 100
    batch = []
    total_updated = 0

    async for job in cursor:
        if not job.get("geo") or not job["geo"].get("coordinates"):
            continue

        lng, lat = job["geo"]["coordinates"]

        h3_indexes = {}
        for resolution in [1, 3, 5, 7, 9, 10, 11]:
            h3_indexes[str(resolution)] = h3.latlng_to_cell(lat, lng, resolution)

        batch.append({
            "filter": {"_id": job["_id"]},
            "update": {"$set": {"h3_indexes": h3_indexes}},
        })

        if len(batch) >= batch_size:
            await jobs_collection.bulk_write([
                UpdateOne(op["filter"], op["update"]) for op in batch
            ])
            total_updated += len(batch)
            print(f"Updated {total_updated} jobs...")
            batch = []

    # Final batch
    if batch:
        await jobs_collection.bulk_write([
            UpdateOne(op["filter"], op["update"]) for op in batch
        ])
        total_updated += len(batch)

    print(f"✅ Total jobs updated: {total_updated}")

if __name__ == "__main__":
    asyncio.run(backfill_h3_indexes())
```

---

## GraphQL Schema Changes

### New Types

```python
@strawberry.type(
    name="JobCluster",
    description="Aggregated job cluster at a specific H3 hexagon",
)
class JobClusterType:
    h3_index: str = strawberry.field(
        description="H3 hexagon index"
    )

    count: int = strawberry.field(
        description="Total number of jobs in this hexagon"
    )

    center: GeoObjectType = strawberry.field(
        description="Center coordinates of hexagon"
    )

    bounds: list[list[float]] = strawberry.field(
        description="Hexagon boundary vertices as [[lat, lng], ...]"
    )

    sample_job_ids: list[str] = strawberry.field(
        description="IDs of sample jobs from this cluster (max 3) - fetch full details on-demand"
    )

    salary_range: SalaryRangeType = strawberry.field(
        description="Min and max salary across all jobs in cluster"
    )

    top_specialties: list[str] = strawberry.field(
        description="Top 3 most common specialties in cluster"
    )

    @classmethod
    def marshal(cls, cluster: JobCluster) -> Self:
        return cls(
            h3_index=cluster.h3_index,
            count=cluster.count,
            center=GeoObjectType.marshal(cluster.center),
            bounds=cluster.bounds,
            sample_job_ids=[str(job_id) for job_id in cluster.sample_job_ids],
            salary_range=SalaryRangeType.marshal(cluster.salary_range),
            top_specialties=cluster.top_specialties,
        )


@strawberry.type(name="SalaryRange")
class SalaryRangeType:
    min_salary: int | None
    max_salary: int | None


@strawberry.type(
    name="JobClusterConnection",
    description="Paginated list of job clusters"
)
class JobClusterConnectionType:
    clusters: list[JobClusterType]
    total_count: int
```

### Updated Query

**IMPORTANT**: We use a **separate query field** (`jobClusters`) instead of modifying the existing `jobs` query. This keeps the API clean and prevents pollution of the existing jobs query with clustering-specific logic.

```python
@strawberry.type(name="Query")
class Query:
    # Existing jobs query - UNCHANGED
    @strawberry.field(description="Get all active jobs")
    async def jobs(
        self,
        search_term: Annotated[str | None, strawberry.argument(...)] = None,
        location: Annotated[str | None, strawberry.argument(...)] = None,
        # ... all existing parameters remain unchanged ...
        info: Info,
    ) -> JobConnectionType:
        """Existing implementation - unchanged"""
        # ... existing code ...

    # NEW: Separate query field for map clustering
    @strawberry.field(description="Fetch job clusters for map view based on zoom level and viewport")
    async def job_clusters(
        self,
        bounds: Annotated[BoundingBoxInput, strawberry.argument(description="Viewport bounding box")],
        zoom_level: Annotated[int, strawberry.argument(description="Current map zoom level (0-15)")],

        # Optional filters - same as jobs query
        search_term: Annotated[str | None, strawberry.argument(...)] = None,
        location: Annotated[str | None, strawberry.argument(...)] = None,
        work_mode: Annotated[list[JobWorkModeFilterEnum], strawberry.argument(...)] = [],
        job_type: Annotated[list[JobTypeFilterEnum], strawberry.argument(...)] = [],
        proximity_km: Annotated[float | None, strawberry.argument(...)] = None,
        min_experience: Annotated[int | None, strawberry.argument(...)] = None,
        max_experience: Annotated[int | None, strawberry.argument(...)] = None,
        min_salary: Annotated[int | None, strawberry.argument(...)] = None,
        max_salary: Annotated[int | None, strawberry.argument(...)] = None,

        info: Info,
    ) -> JobClusterConnectionType:
        """
        Return job clusters for map visualization.

        At low zoom levels (0-10): Returns H3 hexagon clusters with aggregated stats.
        At high zoom levels (11-15): Returns individual jobs as single-job clusters.

        This is a separate query to keep clustering logic isolated from the main jobs query.
        """
        job_repo: JobRepo = info.context.container.job_repo()

        # Determine whether to aggregate or return individual jobs
        should_cluster = zoom_level < 11

        if should_cluster:
            # Calculate H3 resolution from zoom level
            h3_resolution = _get_h3_resolution_from_zoom(zoom_level)

            # Fetch aggregated clusters
            clusters = await job_repo.get_aggregated_jobs_by_h3(
                bounds=BoundingBox(**bounds.__dict__),
                h3_resolution=h3_resolution,
                search_term=search_term,
                location=location,
                work_mode=[mode.to_domain() for mode in work_mode],
                job_type=[jt.to_domain() for jt in job_type],
                proximity_km=proximity_km,
                min_experience=min_experience,
                max_experience=max_experience,
                min_salary=min_salary,
                max_salary=max_salary,
            )

            return JobClusterConnectionType(
                clusters=[JobClusterType.marshal(c) for c in clusters],
                total_count=sum(c.count for c in clusters),
            )
        else:
            # At high zoom: fetch individual jobs and wrap each as a cluster
            paginated_result = await job_repo.get_all_active(
                bounds=BoundingBox(**bounds.__dict__),
                search_term=search_term,
                location=location,
                work_mode=[mode.to_domain() for mode in work_mode],
                job_type=[jt.to_domain() for jt in job_type],
                proximity_km=proximity_km,
                min_experience=min_experience,
                max_experience=max_experience,
                min_salary=min_salary,
                max_salary=max_salary,
                first=1000,  # Max individual jobs on map
            )

            # Convert individual jobs to single-job clusters
            individual_clusters = [
                JobCluster(
                    h3_index=job.h3_indexes[11],  # Use finest resolution
                    count=1,
                    center=job.geo,
                    bounds=h3.h3_to_geo_boundary(job.h3_indexes[11]),
                    sample_jobs=[job],
                    salary_range=SalaryRange(
                        min_salary=job.min_salary,
                        max_salary=job.max_salary,
                    ),
                    top_specialties=[],
                )
                for job in paginated_result.items
                if job.geo and job.h3_indexes
            ]

            return JobClusterConnectionType(
                clusters=[JobClusterType.marshal(c) for c in individual_clusters],
                total_count=len(individual_clusters),
            )


def _get_h3_resolution_from_zoom(zoom_level: int) -> int:
    """Map Leaflet zoom to H3 resolution"""
    if zoom_level <= 3: return 1
    elif zoom_level <= 5: return 3
    elif zoom_level <= 7: return 5
    elif zoom_level <= 9: return 7
    elif zoom_level <= 10: return 9
    else: return 10  # Max clustering resolution
```

---

## Frontend Implementation

### 1. Zoom to Resolution Utility

```typescript
// lib/map/h3Utils.ts
export function getH3ResolutionFromZoom(zoomLevel: number): number {
  if (zoomLevel <= 3) return 1;
  if (zoomLevel <= 5) return 3;
  if (zoomLevel <= 7) return 5;
  if (zoomLevel <= 9) return 7;
  if (zoomLevel <= 11) return 9;
  if (zoomLevel <= 12) return 10;
  return 11;
}

export function shouldShowClusters(
  zoomLevel: number,
  totalJobs: number
): boolean {
  // Show clusters if:
  // 1. Zoom level is low (<15), OR
  // 2. Total jobs in viewport exceeds threshold
  return zoomLevel < 15 || totalJobs > 500;
}
```

### 2. GraphQL Query Updates

```typescript
// Fragment for job clusters
export const JobClusterFragment = graphql`
  fragment JobClusterFragment on JobCluster {
    h3Index
    count
    center {
      coordinates
    }
    bounds
    sampleJobIds # Only IDs - fetch full jobs on-demand when cluster is clicked
    salaryRange {
      minSalary
      maxSalary
    }
    topSpecialties
  }
`;

// Separate query to fetch sample jobs when user clicks/hovers a cluster
export const ClusterSampleJobsQuery = graphql`
  query ClusterSampleJobsQuery($jobIds: [ID!]!) {
    nodes(ids: $jobIds) {
      ... on Job {
        id
        slug
        title
        location
        organization {
          id
          name
          logoUrl
        }
        minSalary
        maxSalary
        currency
      }
    }
  }
`;

// Updated query - uses separate jobClusters field
export const JobClustersMapQuery = graphql`
  query JobClustersMapQuery(
    $bounds: BoundingBoxInput!
    $zoomLevel: Int!
    $searchTerm: String
    $location: String
    $workMode: [JobWorkModeFilter!]!
    $jobType: [JobTypeFilter!]!
    $proximityKm: Float
    $minExperience: Int
    $maxExperience: Int
    $minSalary: Int
    $maxSalary: Int
  ) {
    jobClusters(
      bounds: $bounds
      zoomLevel: $zoomLevel
      searchTerm: $searchTerm
      location: $location
      workMode: $workMode
      jobType: $jobType
      proximityKm: $proximityKm
      minExperience: $minExperience
      maxExperience: $maxExperience
      minSalary: $minSalary
      maxSalary: $maxSalary
    ) {
      clusters {
        ...JobClusterFragment
      }
      totalCount
    }
  }
`;
```

**Note:** This is a **separate query** from the existing `jobs` query. The map view will use `jobClusters` exclusively, keeping the API clean and focused.

### On-Demand Sample Job Loading

To minimize cache size and initial payload, sample jobs are loaded on-demand when users interact with clusters:

```typescript
// components/search/map/ClusterTooltip.tsx
"use client";

import { useLazyLoadQuery } from "react-relay";
import { Suspense, useState } from "react";

function ClusterTooltipContent({ jobIds }: { jobIds: string[] }) {
  const data = useLazyLoadQuery(
    ClusterSampleJobsQuery,
    { jobIds },
    { fetchPolicy: "store-or-network" } // Cache in Relay store
  );

  return (
    <div className="space-y-2">
      {data.nodes.map((job) => (
        <div key={job.id} className="text-sm">
          <div className="font-medium">{job.title}</div>
          <div className="text-gray-600">{job.organization.name}</div>
          <div className="text-gray-500">
            {job.minSalary && job.maxSalary
              ? `${
                  job.currency
                } ${job.minSalary.toLocaleString()} - ${job.maxSalary.toLocaleString()}`
              : "Salary not disclosed"}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ClusterTooltip({ cluster }: { cluster: JobCluster }) {
  const [showJobs, setShowJobs] = useState(false);

  return (
    <Tooltip
      onOpen={() => setShowJobs(true)}
      onClose={() => setShowJobs(false)}
    >
      <div className="p-2">
        <div className="font-bold">{cluster.count} jobs</div>
        <div className="text-sm text-gray-600">
          {cluster.salaryRange.minSalary && cluster.salaryRange.maxSalary
            ? `₹${cluster.salaryRange.minSalary.toLocaleString()} - ₹${cluster.salaryRange.maxSalary.toLocaleString()}`
            : "View jobs for details"}
        </div>
        {cluster.topSpecialties.length > 0 && (
          <div className="text-xs mt-1">
            {cluster.topSpecialties.join(", ")}
          </div>
        )}

        {/* Load sample jobs only when tooltip is shown */}
        {showJobs && cluster.sampleJobIds.length > 0 && (
          <Suspense fallback={<div className="text-xs mt-2">Loading...</div>}>
            <ClusterTooltipContent jobIds={cluster.sampleJobIds} />
          </Suspense>
        )}
      </div>
    </Tooltip>
  );
}
```

**Benefits of this approach:**

- ✅ **Reduced cache size**: ~90% smaller (500 bytes vs 5KB per cluster)
- ✅ **Faster initial load**: No need to fetch/serialize full job objects
- ✅ **Better cache hit rate**: More viewport/filter combinations fit in Redis memory
- ✅ **On-demand loading**: Sample jobs only fetched when user hovers/clicks
- ✅ **Relay caching**: Once loaded, sample jobs are cached in Relay store for instant re-display

### 3. Map Component Logic

```typescript
// components/search/map/JobMapView.tsx
"use client";

import { useMap } from "react-leaflet";
import { useCallback, useState, useEffect } from "react";
import { debounce } from "lodash";

export default function JobMapView({ data, filters, onFiltersChange }) {
  const map = useMap();
  const [zoomLevel, setZoomLevel] = useState(map.getZoom());
  const [bounds, setBounds] = useState(null);

  // Track zoom level
  useEffect(() => {
    const handleZoom = () => {
      setZoomLevel(map.getZoom());
    };

    map.on("zoomend", handleZoom);
    return () => map.off("zoomend", handleZoom);
  }, [map]);

  // Debounced bounds update
  const updateBounds = useCallback(
    debounce(() => {
      const mapBounds = map.getBounds();
      setBounds({
        swLat: mapBounds.getSouth(),
        swLng: mapBounds.getWest(),
        neLat: mapBounds.getNorth(),
        neLng: mapBounds.getEast(),
      });
    }, 300),
    [map]
  );

  useEffect(() => {
    map.on("moveend", updateBounds);
    updateBounds(); // Initial bounds

    return () => map.off("moveend", updateBounds);
  }, [map, updateBounds]);

  // Determine render mode
  const shouldCluster = shouldShowClusters(zoomLevel, data?.totalCount || 0);
  const h3Resolution = getH3ResolutionFromZoom(zoomLevel);

  return (
    <>
      {shouldCluster && data?.clusters ? (
        <JobHexagonClusters
          clusters={data.clusters}
          onClusterClick={handleClusterClick}
        />
      ) : (
        <JobMapMarkers
          jobs={data?.jobs?.edges?.map((e) => e.node) || []}
          onJobClick={handleJobClick}
        />
      )}
    </>
  );
}
```

### 4. Hexagon Cluster Component

```typescript
// components/search/map/JobHexagonClusters.tsx
"use client";

import L from "leaflet";
import { useEffect } from "react";
import { useMap } from "react-leaflet";
import { Polygon, Tooltip } from "react-leaflet";

interface JobHexagonClustersProps {
  clusters: Array<{
    h3Index: string;
    count: number;
    center: { coordinates: [number, number] };
    bounds: Array<[number, number]>;
    salaryRange: { minSalary?: number; maxSalary?: number };
    topSpecialties: string[];
  }>;
  onClusterClick: (h3Index: string, cluster: any) => void;
}

export default function JobHexagonClusters({
  clusters,
  onClusterClick,
}: JobHexagonClustersProps) {
  const map = useMap();

  // Color coding by job count
  const getColorByCount = (count: number): string => {
    if (count < 10) return "#10b981"; // green
    if (count < 50) return "#f59e0b"; // yellow/orange
    if (count < 100) return "#f97316"; // orange
    return "#ef4444"; // red
  };

  return (
    <>
      {clusters.map((cluster) => {
        const color = getColorByCount(cluster.count);

        // Convert H3 boundary to Leaflet LatLng format
        const positions: L.LatLngExpression[] = cluster.bounds.map(
          ([lat, lng]) => [lat, lng] as L.LatLngExpression
        );

        return (
          <Polygon
            key={cluster.h3Index}
            positions={positions}
            pathOptions={{
              color: color,
              fillColor: color,
              fillOpacity: 0.4,
              weight: 2,
            }}
            eventHandlers={{
              click: () => onClusterClick(cluster.h3Index, cluster),
              mouseover: (e) => {
                e.target.setStyle({ fillOpacity: 0.6 });
              },
              mouseout: (e) => {
                e.target.setStyle({ fillOpacity: 0.4 });
              },
            }}
          >
            <Tooltip direction="top" opacity={0.9}>
              <div className="text-sm">
                <div className="font-bold text-lg mb-1">
                  {cluster.count} Jobs
                </div>
                {cluster.salaryRange.minSalary && (
                  <div className="text-xs">
                    ₹{cluster.salaryRange.minSalary.toLocaleString()} - ₹
                    {cluster.salaryRange.maxSalary?.toLocaleString()}
                  </div>
                )}
                {cluster.topSpecialties.length > 0 && (
                  <div className="text-xs mt-1">
                    Top: {cluster.topSpecialties.slice(0, 3).join(", ")}
                  </div>
                )}
                <div className="text-xs mt-1 text-primary">
                  Click to explore →
                </div>
              </div>
            </Tooltip>
          </Polygon>
        );
      })}
    </>
  );
}
```

### 5. Cluster Click Handler

```typescript
const handleClusterClick = useCallback(
  (h3Index: string, cluster: any) => {
    const currentZoom = map.getZoom();

    if (currentZoom >= 14) {
      // At high zoom, show jobs in drawer
      setSelectedCluster(cluster);
      setIsDrawerOpen(true);
    } else {
      // At low zoom, zoom in to cluster center
      const [lng, lat] = cluster.center.coordinates;
      map.setView([lat, lng], currentZoom + 2, {
        animate: true,
        duration: 0.5,
      });
    }
  },
  [map]
);
```

---

---

## Performance Analysis: MongoDB Atlas Search Compatibility

### Current Implementation Reality

The existing `get_all_active()` method in `JobRepo` uses **MongoDB Atlas Search** (NOT standard aggregation pipeline). This has critical implications for our H3 clustering approach.

**Key findings from code review:**

1. **Atlas Search Query Structure**: Current queries use `$search` operator with `compound`, `must`, and `filter` clauses
2. **Geospatial Filtering**: Already supports `geoWithin` with box/circle filters via Atlas Search
3. **No Standard Aggregation Pipeline**: Filters are NOT using `$match`, `$group`, etc. - they use Atlas Search DSL
4. **Performance Priority**: User requirement states "low latency is top priority" - target <200ms

### Critical Performance Concern: Atlas Search + Aggregation

**The Problem:**

MongoDB Atlas Search queries (`$search`) **cannot be combined with standard aggregation pipeline stages** in the same efficient manner. Specifically:

```python
# ❌ THIS WILL BE SLOW - Atlas Search doesn't optimize with $group
pipeline = [
    {"$search": {...}},  # Atlas Search stage
    {"$group": {...}},   # Standard aggregation
]
```

**Why this matters:**

- Our H3 clustering approach in the PRD relies on `$group` to aggregate jobs by H3 index
- Running `$search` → then `$group` means Atlas Search returns ALL matching documents to MongoDB, THEN groups them
- For 10,000+ jobs, this means loading all documents into memory before grouping
- This violates our <200ms latency requirement

### Recommended Solutions (Ranked by Performance)

#### Option 1: Pre-Computed H3 Aggregations (FASTEST - ~50-100ms)

**Approach:** Create a separate `job_clusters` collection with pre-aggregated data updated on job create/update/delete.

**Schema:**

```python
class JobClusterPrecomputed(Document):
    h3_index: str  # H3 index at specific resolution
    resolution: int  # H3 resolution level (0-11)
    count: int
    job_ids: list[ObjectId]  # Reference to jobs
    salary_range: dict
    top_specialties: list[str]
    last_updated: datetime

    class Settings:
        name = "job_clusters_precomputed"
        indexes = [
            IndexModel([("h3_index", 1), ("resolution", 1)]),
            IndexModel([("h3_index", 1)]),
            IndexModel([("resolution", 1)]),
        ]
```

**Pros:**

- ✅ **Ultra-fast reads**: Direct index lookup, no aggregation needed
- ✅ Compatible with Atlas Search filters (filter jobs first, then lookup clusters)
- ✅ <50ms query time even for 100k+ jobs
- ✅ Can apply all existing filters (search_term, location, salary, etc.) to jobs first

**Cons:**

- ❌ Additional write overhead on job create/update/delete
- ❌ Storage cost (but minimal - ~50KB per 1000 jobs)
- ❌ Complexity in keeping precomputed data in sync

**Implementation:**

```python
async def get_job_clusters(
    self,
    bounds: BoundingBox,
    h3_resolution: int,
    **filters
) -> list[JobCluster]:
    """Ultra-fast clustering using pre-computed aggregations"""

    # Step 1: Get matching job IDs using existing Atlas Search (fast)
    job_ids = await self._get_filtered_job_ids(bounds, **filters)

    # Step 2: Query pre-computed clusters (indexed lookup - very fast)
    # Get all h3 indexes that intersect bounds
    h3_indexes = h3.polyfill(bounds.to_polygon(), h3_resolution)

    # Find pre-computed clusters matching those indexes
    clusters = await JobClusterPrecomputed.find(
        {
            "h3_index": {"$in": h3_indexes},
            "resolution": h3_resolution,
            "job_ids": {"$in": job_ids}  # Only clusters with our filtered jobs
        }
    ).to_list()

    # Step 3: Re-aggregate on the fly for filtered subset
    # (Only needed if filters applied - otherwise use pre-computed directly)
    if filters:
        # Group clusters by h3_index, counting only matching jobs
        final_clusters = self._recount_clusters(clusters, job_ids)
    else:
        final_clusters = clusters

    return final_clusters
```

**Update triggers:**

```python
# In JobRepo.create()
async def create(self, job: Job) -> Job:
    created_job = await super().create(job)

    # Update all resolution levels for this job's H3 indexes
    await self._update_precomputed_clusters(created_job)

    return created_job

# Background job for batch updates
async def recompute_all_clusters():
    """Run nightly to ensure consistency"""
    # Truncate and rebuild entire job_clusters_precomputed collection
    pass
```

---

#### Option 2: Atlas Search with Post-Grouping (GOOD - ~100-200ms)

**Approach:** Use Atlas Search to filter, load results into Python, group in-memory.

```python
async def get_job_clusters(
    self,
    bounds: BoundingBox,
    h3_resolution: int,
    **filters
) -> list[JobCluster]:
    """Hybrid approach - Atlas Search filter, Python grouping"""

    # Step 1: Use existing Atlas Search to get jobs (uses indexes)
    search_query = self._build_search_query(bounds, **filters)

    # Fetch only necessary fields (projection)
    pipeline = [
        {"$search": search_query},
        {"$limit": 10000},  # Safety limit
        {
            "$project": {
                "_id": 1,
                f"h3_indexes.{h3_resolution}": 1,
                "min_salary": 1,
                "max_salary": 1,
                "title": 1,
                "location": 1,
                "specialties": 1,
            }
        }
    ]

    jobs = await Job.aggregate(pipeline, projection_model=None).to_list()

    # Step 2: Group in Python (fast for <10k records)
    clusters_dict = defaultdict(lambda: {
        "count": 0,
        "job_ids": [],
        "min_salary": float('inf'),
        "max_salary": 0,
        "specialties": defaultdict(int),
    })

    h3_field = f"h3_indexes.{h3_resolution}"
    for job in jobs:
        h3_index = job.get("h3_indexes", {}).get(str(h3_resolution))
        if not h3_index:
            continue

        cluster = clusters_dict[h3_index]
        cluster["count"] += 1
        cluster["job_ids"].append(job["_id"])
        cluster["min_salary"] = min(cluster["min_salary"], job.get("min_salary", 0) or 0)
        cluster["max_salary"] = max(cluster["max_salary"], job.get("max_salary", 0) or 0)

        for spec in job.get("specialties", []):
            cluster["specialties"][spec] += 1

    # Step 3: Convert to JobCluster objects
    clusters = []
    for h3_index, data in clusters_dict.items():
        clusters.append(JobCluster(
            h3_index=h3_index,
            count=data["count"],
            center=h3.h3_to_geo(h3_index),
            bounds=h3.h3_to_geo_boundary(h3_index),
            salary_range=SalaryRange(
                min_salary=data["min_salary"],
                max_salary=data["max_salary"],
            ),
            top_specialties=sorted(
                data["specialties"].items(),
                key=lambda x: x[1],
                reverse=True
            )[:3],
            sample_jobs=[]  # Load separately if needed
        ))

    return clusters
```

**Pros:**

- ✅ Reuses existing Atlas Search infrastructure
- ✅ All existing filters work (search_term, location, salary, etc.)
- ✅ Respects Atlas Search indexes for fast initial filtering
- ✅ 100-200ms latency for <10k jobs

**Cons:**

- ⚠️ Loads all matching jobs into Python memory (problematic for >10k results)
- ⚠️ Two-step process (DB query + Python processing)
- ⚠️ May exceed 200ms target for dense areas with many jobs

---

#### Option 3: Separate Atlas Search Index on Clusters (COMPLEX)

**Approach:** Create Atlas Search index specifically for pre-computed clusters.

This is essentially Option 1 but with Atlas Search on the `job_clusters_precomputed` collection. Only worth it if we need text search on cluster metadata.

**Verdict:** Probably overkill for this use case.

---

### Recommended Approach: **Hybrid Strategy**

Combine Option 1 (pre-computed) with Option 2 (fallback) for optimal performance:

1. **Default**: Use pre-computed clusters (Option 1) - <50ms
2. **With complex filters**: Use Atlas Search + Python grouping (Option 2) - <200ms
3. **Cache aggressively**: Redis TTL=5min for filtered results

**Decision Logic:**

```python
async def get_job_clusters(self, bounds, h3_resolution, **filters):
    # Check if filters are "simple" (no search_term, just geo/salary/experience)
    has_complex_filters = bool(
        filters.get("search_term") or
        filters.get("location")  # Location requires region lookup
    )

    if has_complex_filters:
        # Use Atlas Search + Python grouping (Option 2)
        return await self._get_clusters_with_search(bounds, h3_resolution, **filters)
    else:
        # Use pre-computed clusters (Option 1)
        return await self._get_precomputed_clusters(bounds, h3_resolution, **filters)
```

---

### Performance Benchmarks (Estimated)

| Scenario                      | Atlas Search Only | Option 1 (Precomputed) | Option 2 (Hybrid) | Hybrid Strategy      |
| ----------------------------- | ----------------- | ---------------------- | ----------------- | -------------------- |
| **10k jobs, no filters**      | 800ms ❌          | 30ms ✅                | 150ms ✅          | **30ms** ✅          |
| **10k jobs, search "nurse"**  | 800ms ❌          | N/A (requires filter)  | 180ms ✅          | **180ms** ✅         |
| **50k jobs, no filters**      | 3000ms ❌         | 40ms ✅                | 600ms ❌          | **40ms** ✅          |
| **50k jobs, location filter** | 2000ms ❌         | 50ms ✅                | 400ms ⚠️          | **50ms or 400ms** ⚠️ |
| **100k jobs, salary filter**  | 5000ms ❌         | 60ms ✅                | 1200ms ❌         | **60ms** ✅          |

**Conclusion:** Hybrid strategy meets <200ms requirement for 95% of use cases.

---

### Implementation Complexity Assessment

| Approach                         | Dev Time | Complexity | Maintenance | Performance |
| -------------------------------- | -------- | ---------- | ----------- | ----------- |
| Option 1 (Precomputed)           | 5 days   | High       | Medium      | ⭐⭐⭐⭐⭐  |
| Option 2 (Atlas Search + Python) | 2 days   | Low        | Low         | ⭐⭐⭐      |
| Hybrid (Recommended)             | 6 days   | High       | Medium      | ⭐⭐⭐⭐⭐  |

---

### Updated Timeline with Performance Considerations

The original 15-18 day timeline assumed standard aggregation pipeline. With Atlas Search constraints:

**Revised Timeline: 18-22 days**

- Phase 1: Backend Foundation (2-3 days) → **+1 day** (Atlas Search analysis)
- Phase 2: Backend Clustering Logic (3-4 days) → **+2 days** (implement pre-computed clusters)
- Phase 3: Redis Caching (1-2 days) → **Same**
- Phase 4: GraphQL Integration (2 days) → **Same**
- Phase 5: Frontend Implementation (5-6 days) → **Same**
- Phase 6: Testing & Optimization (2-3 days) → **+1 day** (benchmark Atlas Search)

**Total: 18-22 days**

---

## Performance Optimizations

### 1. Redis Caching

```python
# In JobRepo
async def get_aggregated_jobs_by_h3(
    self,
    bounds: BoundingBox,
    h3_resolution: int,
    **filters
) -> list[JobCluster]:
    """Get clusters with Redis caching"""

    # Generate cache key
    filters_str = json.dumps(filters, sort_keys=True)
    filters_hash = hashlib.md5(filters_str.encode()).hexdigest()[:8]

    cache_key = (
        f"job_clusters:"
        f"{bounds.sw_lat},{bounds.sw_lng},"
        f"{bounds.ne_lat},{bounds.ne_lng}:"
        f"res{h3_resolution}:"
        f"{filters_hash}"
    )

    # Try cache first
    redis = self._get_redis()
    cached = await redis.get(cache_key)
    if cached:
        logger.info(f"Cache HIT: {cache_key}")
        cached_data = json.loads(cached)

        # Hydrate cached clusters (fetch sample jobs if needed for immediate display)
        # For map view, we don't need sample jobs until user clicks/hovers
        # So we can return lightweight clusters and fetch jobs on-demand
        clusters = [
            JobCluster(
                h3_index=data["h3_index"],
                count=data["count"],
                center=data["center"],
                bounds=data["bounds"],
                sample_job_ids=data["sample_job_ids"],  # Keep as IDs
                sample_jobs=[],  # Empty - will be fetched on-demand
                salary_range=SalaryRange(**data["salary_range"]),
                top_specialties=data["top_specialties"],
            )
            for data in cached_data
        ]
        return clusters

    # Cache miss - compute
    logger.info(f"Cache MISS: {cache_key}")
    clusters = await self._compute_clusters(
        bounds, h3_resolution, **filters
    )

    # Cache for 5 minutes - store lightweight version with only job IDs
    # (Sample jobs will be fetched on-demand when cluster is clicked)
    cache_data = [
        {
            "h3_index": c.h3_index,
            "count": c.count,
            "center": c.center,
            "bounds": c.bounds,
            "sample_job_ids": [job.id for job in c.sample_jobs[:3]],  # Only IDs
            "salary_range": c.salary_range,
            "top_specialties": c.top_specialties,
        }
        for c in clusters
    ]

    await redis.setex(
        cache_key,
        300,  # 5 minutes TTL
        json.dumps(cache_data)
    )

    return clusters
```

**Cache Invalidation Strategy:**

When jobs are created, updated, or deleted, the Redis cache needs to be invalidated. There are two approaches:

**Option A: Time-Based (Simple - Current Approach)**

- Rely on 5-minute TTL
- Pros: No invalidation logic needed, simple
- Cons: Users may see stale data for up to 5 minutes

**Option B: Event-Based Invalidation (Recommended)**

- Invalidate cache on job mutations
- Pros: Always fresh data, better UX
- Cons: More complex, requires careful key pattern management

```python
# In JobRepo
async def create(self, job: Job) -> Job:
    """Create job and invalidate related caches"""
    created_job = await super().create(job)

    # Invalidate all cluster caches
    # (Use key pattern matching to clear all resolutions/bounds)
    await self._invalidate_cluster_cache()

    # Update pre-computed clusters if using Option 1
    if self.use_precomputed_clusters:
        await self._update_precomputed_clusters(created_job)

    return created_job

async def update(self, id: ObjectId, updates: dict) -> Job:
    """Update job and invalidate caches"""
    updated_job = await super().update(id, updates)

    await self._invalidate_cluster_cache()

    if self.use_precomputed_clusters:
        await self._update_precomputed_clusters(updated_job)

    return updated_job

async def delete(self, id: ObjectId) -> None:
    """Delete job and invalidate caches"""
    job = await self.get_by_id(id)
    await super().delete(id)

    await self._invalidate_cluster_cache()

    if self.use_precomputed_clusters:
        await self._remove_from_precomputed_clusters(job)

async def _invalidate_cluster_cache(self) -> None:
    """Invalidate all cluster caches using key pattern"""
    redis = self._get_redis()

    # Option 1: Delete all cluster cache keys
    # (Simple but potentially expensive if many keys)
    pattern = "job_clusters:*"
    cursor = 0
    while True:
        cursor, keys = await redis.scan(cursor, match=pattern, count=100)
        if keys:
            await redis.delete(*keys)
        if cursor == 0:
            break

    logger.info("Invalidated all cluster caches")

# Alternative: Use cache versioning (more efficient)
async def _get_cache_version(self) -> str:
    """Get current cache version (incremented on job changes)"""
    redis = self._get_redis()
    version = await redis.get("job_clusters:version")
    if not version:
        version = "1"
        await redis.set("job_clusters:version", version)
    return version

async def _bump_cache_version(self) -> None:
    """Increment cache version to invalidate all caches"""
    redis = self._get_redis()
    await redis.incr("job_clusters:version")
    logger.info("Bumped cluster cache version")

# Updated cache key generation (include version)
async def get_aggregated_jobs_by_h3(
    self,
    bounds: BoundingBox,
    h3_resolution: int,
    **filters
) -> list[JobCluster]:
    """Get clusters with versioned caching"""

    # Include cache version in key
    cache_version = await self._get_cache_version()

    filters_str = json.dumps(filters, sort_keys=True)
    filters_hash = hashlib.md5(filters_str.encode()).hexdigest()[:8]

    cache_key = (
        f"job_clusters:v{cache_version}:"
        f"{bounds.sw_lat},{bounds.sw_lng},"
        f"{bounds.ne_lat},{bounds.ne_lng}:"
        f"res{h3_resolution}:"
        f"{filters_hash}"
    )

    # ... rest of implementation
```

**Recommended Approach:** Use **cache versioning** (more efficient than scanning/deleting keys):

- On job create/update/delete: increment version counter
- All cache keys include version number
- Old cache keys become unreachable automatically
- Redis TTL cleans up old keys after 5 minutes

**Performance Impact:**

- Cache versioning: ~1ms overhead per mutation (just increment counter)
- Key pattern deletion: ~50-200ms per mutation (scan + delete)

### 2. Automatic Resolution Adjustment

```python
# If too many clusters, use coarser resolution
if len(clusters) > 1000:
    logger.warning(
        f"Too many clusters ({len(clusters)}) at resolution {h3_resolution}. "
        f"Consider using coarser resolution."
    )

    # Re-query with coarser resolution
    coarser_resolution = max(1, h3_resolution - 1)
    clusters = await self._compute_clusters(
        bounds, coarser_resolution, **filters
    )
```

### 3. Frontend Optimizations

```typescript
// Memoize hexagon rendering
const MemoizedHexagon = React.memo(HexagonCluster, (prev, next) => {
  return (
    prev.cluster.h3Index === next.cluster.h3Index &&
    prev.cluster.count === next.cluster.count
  );
});

// Virtualize cluster list in preview drawer
import { FixedSizeList } from "react-window";

function ClusterJobsList({ jobs }) {
  const Row = ({ index, style }) => (
    <div style={style}>
      <JobCard job={jobs[index]} />
    </div>
  );

  return (
    <FixedSizeList
      height={400}
      itemCount={jobs.length}
      itemSize={120}
      width="100%"
    >
      {Row}
    </FixedSizeList>
  );
}
```

---

## User Experience Design

### Interaction Flows

#### 1. National View (Zoom 4-8)

**User sees:** Large hexagons covering states/regions

- **Visual:** Color-coded by job density
- **Hover:** Tooltip shows count, salary range, top specialties
- **Click:** Zoom to region center (+2 zoom levels)

#### 2. City View (Zoom 9-12)

**User sees:** Medium hexagons covering neighborhoods

- **Visual:** More granular density visualization
- **Hover:** Detailed stats per neighborhood
- **Click:**
  - If <20 jobs: Show job list in bottom drawer
  - If >20 jobs: Zoom in further

#### 3. Street View (Zoom 13-14)

**User sees:** Small hexagons or individual markers

- **Visual:** Transition from hexagons to markers
- **Hover:** Individual job previews
- **Click:** Open job preview drawer

#### 4. Building Level (Zoom 15+)

**User sees:** Individual job markers only

- **Behavior:** Same as current implementation
- **No clustering**

### Visual Design

#### Cluster Color Scheme

```css
/* Job count based colors */
.cluster-low {
  /* <10 jobs */
  fill: #10b981; /* Green */
  stroke: #059669;
}

.cluster-medium {
  /* 10-50 jobs */
  fill: #f59e0b; /* Amber */
  stroke: #d97706;
}

.cluster-high {
  /* 50-100 jobs */
  fill: #f97316; /* Orange */
  stroke: #ea580c;
}

.cluster-very-high {
  /* 100+ jobs */
  fill: #ef4444; /* Red */
  stroke: #dc2626;
}
```

#### Hexagon Styles

- **Fill Opacity:** 0.4 (default), 0.6 (hover)
- **Stroke Weight:** 2px
- **Animation:** Smooth fade in/out on zoom transitions
- **Label:** Count badge at hexagon center for high zoom

---

## Testing Strategy

### 1. Unit Tests

```python
# test_h3_clustering.py
import pytest
from app.jobs.repositories import JobRepo

@pytest.mark.asyncio
async def test_h3_index_computation():
    """Test H3 index generation"""
    job_repo = JobRepo(...)

    geo = GeoObject(coordinates=[77.5946, 12.9716])  # Bangalore
    h3_indexes = job_repo._compute_h3_indexes(geo)

    assert 1 in h3_indexes
    assert 11 in h3_indexes
    assert len(h3_indexes) == 7

@pytest.mark.asyncio
async def test_cluster_aggregation():
    """Test cluster query returns correct counts"""
    # Create 50 test jobs in Bangalore
    # Create 30 test jobs in Mumbai
    # Query at resolution 3 (state level)

    clusters = await job_repo.get_aggregated_jobs_by_h3(
        bounds=india_bounds,
        h3_resolution=3,
    )

    # Should return 2 clusters (Maharashtra, Karnataka)
    assert len(clusters) == 2
    assert any(c.count == 50 for c in clusters)
    assert any(c.count == 30 for c in clusters)
```

### 2. Integration Tests

```typescript
// e2e/map-clustering.spec.ts
import { test, expect } from "@playwright/test";

test("shows clusters at low zoom", async ({ page }) => {
  await page.goto("/search/map");

  // Zoom out to national view
  await page.evaluate(() => {
    window.map.setZoom(5);
  });

  // Should see hexagon clusters, not individual markers
  const clusters = await page
    .locator(".leaflet-interactive[data-cluster]")
    .count();
  expect(clusters).toBeGreaterThan(0);

  const markers = await page.locator(".custom-healthcare-marker").count();
  expect(markers).toBe(0);
});

test("shows individual markers at high zoom", async ({ page }) => {
  await page.goto("/search/map");

  // Zoom to street level
  await page.evaluate(() => {
    window.map.setView([12.9716, 77.5946], 15); // Bangalore
  });

  await page.waitForTimeout(500); // Wait for zoom animation

  // Should see individual markers, not clusters
  const markers = await page.locator(".custom-healthcare-marker").count();
  expect(markers).toBeGreaterThan(0);

  const clusters = await page
    .locator(".leaflet-interactive[data-cluster]")
    .count();
  expect(clusters).toBe(0);
});

test("cluster click zooms in", async ({ page }) => {
  await page.goto("/search/map");
  await page.evaluate(() => window.map.setZoom(7));

  const initialZoom = await page.evaluate(() => window.map.getZoom());

  // Click a cluster
  await page.locator(".leaflet-interactive[data-cluster]").first().click();

  await page.waitForTimeout(600); // Wait for zoom animation

  const newZoom = await page.evaluate(() => window.map.getZoom());
  expect(newZoom).toBeGreaterThan(initialZoom);
});
```

### 3. Performance Tests

```python
# test_performance.py
import pytest
import time

@pytest.mark.asyncio
async def test_clustering_performance():
    """Test that clustering is fast even with 10k jobs"""
    # Create 10,000 test jobs across India
    # ...

    start = time.time()
    clusters = await job_repo.get_aggregated_jobs_by_h3(
        bounds=india_bounds,
        h3_resolution=5,
    )
    duration = time.time() - start

    # Should complete in <500ms
    assert duration < 0.5

    # Should return reasonable number of clusters
    assert len(clusters) < 1000

@pytest.mark.asyncio
async def test_cache_performance():
    """Test Redis caching improves performance"""

    # First query (cache miss)
    start = time.time()
    clusters1 = await job_repo.get_aggregated_jobs_by_h3(...)
    miss_duration = time.time() - start

    # Second query (cache hit)
    start = time.time()
    clusters2 = await job_repo.get_aggregated_jobs_by_h3(...)
    hit_duration = time.time() - start

    # Cache hit should be 10x faster
    assert hit_duration < miss_duration / 10
    assert clusters1 == clusters2
```

---

## Implementation Timeline

### Phase 1: Backend Foundation (3-4 days)

**Goal:** H3 indexing and aggregation working

- [ ] Install h3-py dependency
- [ ] Add h3_indexes field to Job document
- [ ] Implement H3 computation in JobRepo.create()
- [ ] Create migration script for existing jobs
- [ ] Add multi-key index for h3_indexes
- [ ] Implement get_aggregated_jobs_by_h3() method
- [ ] Unit tests for H3 computation and aggregation
- [ ] Run migration on staging database

**Deliverable:** Backend can aggregate jobs into H3 hexagons

---

### Phase 2: GraphQL Layer (2 days)

**Goal:** Expose clustering via GraphQL API

- [ ] Define JobClusterType and related types
- [ ] Update jobs query with cluster_mode and zoom_level params
- [ ] Implement query resolver logic
- [ ] Add union type for JobConnection | JobClusterConnection
- [ ] Regenerate GraphQL schema
- [ ] Test with GraphQL playground
- [ ] Update frontend type definitions

**Deliverable:** Frontend can fetch clusters via GraphQL

---

### Phase 3: Frontend Core (4-5 days)

**Goal:** Render hexagon clusters on map

- [ ] Create h3Utils.ts with zoom → resolution mapping
- [ ] Update JobsMapQuery to support clustering
- [ ] Implement JobHexagonClusters component
- [ ] Add hexagon rendering with Leaflet Polygon
- [ ] Implement cluster color coding by density
- [ ] Handle cluster click events
- [ ] Implement zoom-based mode switching
- [ ] Add transition animations
- [ ] Update MapViewClientComponent logic

**Deliverable:** Map shows hexagon clusters at low zoom

---

### Phase 4: UX Polish (2-3 days)

**Goal:** Smooth, intuitive user experience

- [ ] Design and implement cluster tooltips
- [ ] Add cluster hover effects
- [ ] Implement cluster → individual marker transitions
- [ ] Create ClusterJobsDrawer for job previews
- [ ] Add loading skeletons for clusters
- [ ] Optimize for mobile (larger touch targets)
- [ ] Add keyboard navigation for clusters
- [ ] Accessibility improvements (ARIA labels)
- [ ] Error state handling
- [ ] Empty state messaging

**Deliverable:** Polished, production-ready UX

---

### Phase 5: Performance & Caching (2 days)

**Goal:** Fast, scalable at 10k+ jobs

- [ ] Implement Redis caching for cluster queries
- [ ] Add cache invalidation on job updates
- [ ] Optimize aggregation pipeline
- [ ] Add automatic resolution adjustment (>1000 clusters)
- [ ] Frontend memoization for hexagon rendering
- [ ] Load testing with 10k jobs
- [ ] Performance monitoring setup
- [ ] Database query optimization

**Deliverable:** Fast performance at scale

---

### Phase 6: Testing & Launch (2 days)

**Goal:** Thoroughly tested, ready for production

- [ ] E2E tests for clustering behavior
- [ ] Performance benchmarks documented
- [ ] Mobile device testing (iOS, Android)
- [ ] Cross-browser testing
- [ ] Staging deployment
- [ ] QA testing
- [ ] Production deployment
- [ ] Monitoring alerts setup

**Deliverable:** Production-ready map clustering

---

**Total Timeline:** 15-18 days (3-3.5 weeks)

---

## Success Metrics

### Performance Metrics

- **Query Speed:** <200ms for cluster aggregation (10k jobs)
- **Cache Hit Rate:** >80% for repeated views
- **Frontend FPS:** 60fps during zoom/pan
- **Initial Load:** <3s for map with clusters

### User Experience Metrics

- **Engagement:** 30% increase in map view time
- **Exploration:** 50% more zoom interactions
- **Discovery:** Users view 3x more job locations
- **Conversion:** Maintained or improved apply rate

### Scale Metrics

- **Capacity:** Support 50k+ active jobs
- **Viewport Limit:** Max 1000 clusters or 500 individual jobs
- **Database Load:** <10% increase in query time
- **Memory:** <100MB additional frontend memory

---

## Risks & Mitigations

### Risk 1: H3 Computation Performance

**Impact:** High
**Mitigation:**

- H3 computation is microseconds per job
- Pre-compute on job creation (one-time cost)
- Use batch updates for backfill

### Risk 2: Browser Performance with Hexagons

**Impact:** Medium
**Mitigation:**

- Limit to 1000 hexagons max
- Use CSS transforms for animations (GPU-accelerated)
- Memoize hexagon components
- Implement virtual scrolling in job lists

### Risk 3: User Confusion

**Impact:** Medium
**Mitigation:**

- Clear visual distinction between clusters and markers
- Informative tooltips with "Click to explore"
- Smooth animations for transitions
- Tutorial on first map view
- Help documentation

### Risk 4: Cache Invalidation

**Impact:** Low
**Mitigation:**

- Conservative 5-minute TTL
- Invalidate on job create/update/delete
- Cache key includes all filters
- Manual cache clear endpoint for admins

### Risk 5: MongoDB Index Size

**Impact:** Low
**Mitigation:**

- Multi-key index is efficient
- Only 7 resolutions stored (not 16)
- Monitor index size in production
- Can drop unused resolutions if needed

---

## Future Enhancements

### Phase 2 Features (Post-MVP)

1. **Heat Map Mode:** Toggle to show density heat map
2. **Time-based Animation:** Show job posting trends over time
3. **Specialty Clustering:** Color-code by job specialty
4. **Saved Searches:** Save map view + filters
5. **Email Alerts:** Notify when new jobs appear in hexagon
6. **Cluster Comparison:** Compare salary/benefits across regions
7. **Organization Density:** Show top employers per region
8. **Commute Time Integration:** Filter by travel time, not just distance

### Advanced Features

1. **Predictive Clustering:** ML-based job opportunity predictions
2. **Dynamic Boundaries:** Show actual city/district boundaries
3. **Multi-city View:** Compare multiple cities side-by-side
4. **Export to PDF:** Save map view as report
5. **Embed Maps:** Allow recruiters to embed maps on websites

---

## Appendix

### A. H3 Resolution Reference

| Resolution | Avg Hexagon Edge | Avg Hexagon Area | Total Hexagons (globally) |
| ---------- | ---------------- | ---------------- | ------------------------- |
| 0          | 1107 km          | 4.357M km²       | 122                       |
| 1          | 418 km           | 609.8k km²       | 842                       |
| 2          | 158 km           | 86.8k km²        | 5,882                     |
| 3          | 59.8 km          | 12.39k km²       | 41,162                    |
| 4          | 22.6 km          | 1,770 km²        | 288,122                   |
| 5          | 8.54 km          | 252.9 km²        | 2,016,842                 |
| 6          | 3.23 km          | 36.13 km²        | 14,117,882                |
| 7          | 1.22 km          | 5.16 km²         | 98,825,162                |
| 8          | 461 m            | 737 m²           | 691,776,122               |
| 9          | 174 m            | 105 m²           | 4,842,432,842             |
| 10         | 66 m             | 15 m²            | 33,897,029,882            |
| 11         | 25 m             | 2.2 m²           | 237,279,209,162           |

### B. Dependencies

**Python:**

```toml
# pyproject.toml
[project]
dependencies = [
    "h3==4.0.0b5",  # H3 hexagonal indexing
    # ... existing dependencies
]
```

**TypeScript:**

```json
// package.json (no new dependencies needed)
// We'll use Leaflet Polygon API for hexagon rendering
```

### C. Environment Variables

No new environment variables required. Uses existing:

- `MONGODB_URI`
- `REDIS_URL`

### D. References

- [H3 Documentation](https://h3geo.org/)
- [H3-py Python Bindings](https://github.com/uber/h3-py)
- [Leaflet Polygon API](https://leafletjs.com/reference.html#polygon)
- [Bandana.com](https://bandana.com) (inspiration)
- [ArcGIS Clustering](https://developers.arcgis.com/javascript/latest/sample-code/featurereduction-cluster/)

---

## Conclusion

This PRD outlines a comprehensive solution for scalable map clustering using H3 hexagonal indexing. The implementation enables displaying thousands of jobs efficiently while providing an intuitive, Bandana.com-style exploration experience.

**Key Benefits:**
✅ True representation of job distribution across India
✅ Fast performance at scale (10k+ jobs)
✅ Intuitive zoom-based progressive disclosure
✅ Industry-standard technology (H3)
✅ Backward compatible with existing features

**Timeline:** 3-3.5 weeks
**Risk:** Low-Medium
**Impact:** High (major UX improvement)

Ready for implementation!
