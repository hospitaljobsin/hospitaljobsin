# Job Map View Implementation - Task Breakdown

## Project Overview

Implement an interactive map view for browsing job listings geospatially, similar to Bandana.com's map interface. This includes full filter support, bottom drawer for job previews, and complete mobile responsiveness.

**Technology Stack:**

- Frontend: Next.js, React, Relay GraphQL, HeroUI v2, TailwindCSS v4
- Map: React-Leaflet v4.2.1, Leaflet v1.9.4, OpenStreetMap
- Backend: Python, Strawberry GraphQL, MongoDB with geospatial indexes
- State: nuqs for URL state management

**Timeline:** 18-24 days (3-4 weeks)

---

## Phase 1: Backend Foundation (2-3 days)

### Task 1.1: Add GeoObjectType to GraphQL Schema

**Estimated Time:** 2 hours

**Dependencies:** None

**Description:**
Create a new GraphQL type to expose geographic coordinates from MongoDB documents.

**Steps:**

1. Open `server/app/base/types.py`
2. Add the following type definition:

   ```python
   @strawberry.type(
       name="GeoObject",
       description="GeoJSON Point object for geographic coordinates.",
   )
   class GeoObjectType:
       coordinates: list[float] = strawberry.field(
           description="Coordinates as [longitude, latitude]",
       )

       @classmethod
       def marshal(cls, geo: GeoObject) -> Self:
           return cls(
               coordinates=list(geo.coordinates)
           )
   ```

**Acceptance Criteria:**

- GeoObjectType is defined in base/types.py
- Type includes coordinates field as list[float]
- Marshal method correctly converts GeoObject to GeoObjectType

---

### Task 1.2: Update JobType with geo Field

**Estimated Time:** 1 hour

**Dependencies:** Task 1.1

**Description:**
Expose the geo field in the JobType GraphQL type so clients can query job coordinates.

**Steps:**

1. Open `server/app/jobs/types.py`
2. Import GeoObjectType from base.types
3. Add geo field to JobType:
   ```python
   geo: GeoObjectType | None = strawberry.field(
       default=None,
       description="Geographic coordinates of the job location.",
   )
   ```
4. Update the marshal method to include geo field

**Acceptance Criteria:**

- JobType includes geo field of type GeoObjectType | None
- Marshal method correctly handles geo field
- Existing tests pass

---

### Task 1.3: Add BoundingBox Models

**Estimated Time:** 1.5 hours

**Dependencies:** None

**Description:**
Create models to represent geographic bounding boxes for map viewport filtering.

**Steps:**

1. Open `server/app/base/models.py`
2. Add BoundingBox model:
   ```python
   class BoundingBox(BaseModel):
       """Geographic bounding box for map viewport queries."""
       sw_lat: float = Field(description="Southwest latitude")
       sw_lng: float = Field(description="Southwest longitude")
       ne_lat: float = Field(description="Northeast latitude")
       ne_lng: float = Field(description="Northeast longitude")
   ```
3. Open `server/app/jobs/types.py`
4. Add BoundingBoxInput:
   ```python
   @strawberry.input(
       name="BoundingBoxInput",
       description="Geographic bounding box input for filtering jobs by map viewport.",
   )
   class BoundingBoxInput:
       sw_lat: float = strawberry.field(description="Southwest corner latitude")
       sw_lng: float = strawberry.field(description="Southwest corner longitude")
       ne_lat: float = strawberry.field(description="Northeast corner latitude")
       ne_lng: float = strawberry.field(description="Northeast corner longitude")
   ```

**Acceptance Criteria:**

- BoundingBox model exists in base/models.py with all 4 coordinate fields
- BoundingBoxInput exists in jobs/types.py
- Both models validate coordinate values correctly

---

### Task 1.4: Update JobRepo with Geospatial Filtering

**Estimated Time:** 3 hours

**Dependencies:** Task 1.3

**Description:**
**CRITICAL: MongoDB Geospatial Query Constraints**

- `$geoWithin` cannot be used with variables in aggregation pipelines
- `$geoNear` MUST be the first stage in an aggregation pipeline if used
- For bounding box queries in aggregation, use `$match` with `$geoWithin` EARLY in the pipeline
- Geospatial stages should come BEFORE complex lookups, grouping, or sorting

Update the job repository to support filtering by map viewport bounding box using proper MongoDB geospatial query stage ordering.

**Steps:**

1. Open `server/app/jobs/repositories.py`
2. Update `get_all_active()` method signature:
   ```python
   async def get_all_active(
       self,
       # ... existing parameters ...
       bounds: BoundingBox | None = None,  # NEW
   ) -> PaginatedResult[Job]:
   ```
3. **IMPORTANT: Add geospatial $match stage EARLY in pipeline (after initial active filter):**

   ```python
   # After the initial $match for is_active
   pipeline: list[dict[str, Any]] = [
       {"$match": {"is_active": True}},  # Existing filter
   ]

   # Add geospatial filter IMMEDIATELY after active filter
   # This ensures geo index is used efficiently
   if bounds:
       pipeline.append({
           "$match": {
               "geo": {
                   "$geoWithin": {
                       "$box": [
                           [bounds.sw_lng, bounds.sw_lat],  # Southwest corner
                           [bounds.ne_lng, bounds.ne_lat]   # Northeast corner
                       ]
                   }
               }
           }
       })

   # Continue with existing filters (location, proximity, etc.)
   # ... rest of existing pipeline stages ...
   ```

**Key MongoDB Considerations:**

- `$geoWithin` with `$box` uses the geospatial index efficiently
- Must be placed BEFORE any `$lookup`, `$unwind`, or complex aggregations
- Alternative: Use `$geoNear` as FIRST stage, but this limits flexibility with other filters
- For our use case: `$match` + `$geoWithin` is more flexible than `$geoNear`

**Testing:**

- Test with various bounding boxes
- Verify geo_2dsphere_index is being used (use explain())
- Test edge cases: bounds crossing date line, null geo values

**Acceptance Criteria:**

- get_all_active() accepts bounds parameter
- Geospatial $match stage is added EARLY in pipeline (position 1 or 2)
- Query uses geo_2dsphere_index (verify with explain)
- Works correctly with existing filters (location, proximity, etc.)
- Returns only jobs within specified bounding box
- Handles edge cases (null geo, invalid bounds)

---

### Task 1.5: Update GraphQL Jobs Query

**Estimated Time:** 1.5 hours

**Dependencies:** Task 1.4

**Description:**
Add bounds parameter to the jobs GraphQL query to support map viewport filtering.

**Steps:**

1. Open `server/app/jobs/query.py`
2. Import BoundingBoxInput
3. Add bounds parameter to jobs query:
   ```python
   bounds: Annotated[
       BoundingBoxInput | None,
       strawberry.argument(
           description="Geographic bounding box to filter jobs by map viewport",
       ),
   ] = None,
   ```
4. Update query implementation to pass bounds to repository:
   ```python
   paginated_result = await job_repo.get_all_active(
       # ... existing parameters ...
       bounds=BoundingBox(**bounds.__dict__) if bounds else None,
   )
   ```

**Acceptance Criteria:**

- jobs query accepts bounds parameter
- bounds is properly typed as BoundingBoxInput | None
- bounds is converted to BoundingBox model before passing to repository
- GraphQL schema includes bounds in jobs query

---

### Task 1.6: Regenerate GraphQL Schema

**Estimated Time:** 15 minutes

**Dependencies:** Tasks 1.1, 1.2, 1.5

**Description:**
Export the updated GraphQL schema so frontend can use new types and queries.

**Steps:**

1. Run command:
   ```bash
   cd server && uv run strawberry export-schema app.schema:schema > ../schema/schema.graphql
   ```
2. Verify schema includes:
   - GeoObjectType
   - BoundingBoxInput
   - geo field on Job type
   - bounds parameter on jobs query
3. Commit schema changes

**Acceptance Criteria:**

- schema.graphql is regenerated
- New types and fields are present in schema
- No schema validation errors

---

### Task 1.7: Verify and Optimize Database Indexes

**Estimated Time:** 2 hours

**Dependencies:** Task 1.4

**Description:**
Ensure geospatial indexes exist and are optimized for map queries.

**Steps:**

1. Open `server/app/jobs/documents.py`
2. Verify geo_2dsphere_index exists:
   ```python
   IndexModel([("geo", pymongo.GEOSPHERE)], name="geo_2dsphere_index")
   ```
3. Add compound index for better performance:
   ```python
   IndexModel(
       [
           ("is_active", pymongo.ASCENDING),
           ("geo", pymongo.GEOSPHERE),
       ],
       name="active_geo_index",
   )
   ```
4. Create migration script to add index to existing database
5. Test query performance with explain()

**Acceptance Criteria:**

- geo_2dsphere_index exists on geo field
- active_geo_index compound index created
- Migration script tested on staging
- Query explain() shows index usage
- Query performance < 100ms for typical map viewport

---

## Phase 2: Frontend Setup (1 day)

### Task 2.1: Install Map Dependencies

**Estimated Time:** 30 minutes

**Dependencies:** None

**Description:**
Add required packages for map functionality using pnpm workspace commands.

**Steps:**

1. From the **repository root**, install all dependencies using pnpm workspace filter:

   ```bash
   # Install runtime dependencies
   pnpm --filter seeker-portal add leaflet react-leaflet leaflet.markercluster

   # Install dev dependencies
   pnpm --filter seeker-portal add -D @types/leaflet @types/leaflet.markercluster
   ```

2. Verify installation by checking `apps/seeker-portal/package.json`:

   ```json
   {
     "dependencies": {
       "leaflet": "^1.9.4",
       "react-leaflet": "^4.2.1",
       "leaflet.markercluster": "^1.5.3"
     },
     "devDependencies": {
       "@types/leaflet": "^1.9.8",
       "@types/leaflet.markercluster": "^1.5.4"
     }
   }
   ```

3. Verify node_modules are created and packages are available

**Note:** Since this is a pnpm monorepo, all package installation commands must be run from the repository root using the `--filter` flag to target the specific workspace package.

**Acceptance Criteria:**

- All packages installed successfully using `pnpm --filter seeker-portal`
- Dependencies appear in `apps/seeker-portal/package.json`
- No version conflicts
- TypeScript types available
- pnpm lockfile updated correctly

---

### Task 2.2: Create Route Structure

**Estimated Time:** 1 hour

**Dependencies:** None

**Description:**
Set up the Next.js route structure for the map view page.

**Steps:**

1. Create directory: `apps/seeker-portal/app/search/map/`
2. Create `page.tsx` (Server Component):

   ```tsx
   import { Metadata } from "next";
   import MapViewClientComponent from "./MapViewClientComponent";

   export const metadata: Metadata = {
     title: "Hospital Jobs Map - Find Healthcare Jobs Near You",
     description:
       "Explore hospital and healthcare job opportunities on an interactive map.",
   };

   export default async function MapPage() {
     // Load initial data
     return <MapViewClientComponent />;
   }
   ```

3. Create `MapViewClientComponent.tsx` (Client Component):

   ```tsx
   "use client";

   import dynamic from "next/dynamic";

   const JobMapView = dynamic(
     () => import("@/components/search/map/JobMapView"),
     { ssr: false }
   );

   export default function MapViewClientComponent() {
     return <JobMapView />;
   }
   ```

4. Create `loading.tsx`:

   ```tsx
   import JobMapSkeleton from "@/components/search/map/JobMapSkeleton";

   export default function Loading() {
     return <JobMapSkeleton />;
   }
   ```

**Acceptance Criteria:**

- Route accessible at /search/map
- Server component handles metadata
- Client component uses dynamic import
- Loading state displays skeleton

---

### Task 2.3: Create Component Directory Structure

**Estimated Time:** 15 minutes

**Dependencies:** None

**Description:**
Set up the directory structure for map components.

**Steps:**

1. Create directory: `apps/seeker-portal/components/search/map/`
2. Create placeholder files for all components:
   - JobMapView.tsx
   - JobMapMarkers.tsx
   - JobMapPopup.tsx
   - JobPreviewDrawer.tsx
   - MapFilterSidebar.tsx
   - JobMapControls.tsx
   - JobMapSkeleton.tsx

**Acceptance Criteria:**

- Directory structure created
- All component files exist (even if empty)
- Proper naming convention followed

---

## Phase 3: Core Map Components (4-5 days)

### Task 3.1: Implement JobMapView Component

**Estimated Time:** 6 hours

**Dependencies:** Task 2.3, Context7 HeroUI Drawer docs

**Description:**
Create the main map container with responsive layout and state management.

**HeroUI Drawer Key Features (from Context7):**

- **Placement:** `left | right | top | bottom` - Use `bottom` for mobile job preview
- **Size:** `xs | sm | md | lg | xl | 2xl | 3xl | 4xl | 5xl | full`
- **isDismissable:** Enable swipe to close (default: true)
- **backdrop:** `transparent | opaque | blur` - Use `blur` for mobile
- **motionProps:** Custom animations using Framer Motion variants
- **useDisclosure hook:** Manages open/close state

**Steps:**

1. Review HeroUI Drawer documentation from Context7
2. Import required components:
   ```tsx
   import {
     useDisclosure,
     Drawer,
     DrawerContent,
     DrawerHeader,
     DrawerBody,
     Button,
   } from "@heroui/react";
   import dynamic from "next/dynamic";
   ```
3. Implement responsive layout with three breakpoints:
   - Mobile (<768px): Full screen map, floating filter button, bottom drawer
   - Tablet (768-1023px): Full width map, bottom drawer
   - Desktop (≥1024px): Fixed left sidebar, full popup
4. Add filter sidebar state management
5. Add job preview drawer state management using useDisclosure
6. Implement dynamic map import to prevent SSR issues

**Component Structure:**

```tsx
export default function JobMapView({ data, filters, onFiltersChange }) {
  const { isOpen, onOpen, onClose } = useDisclosure(); // Job drawer
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Filter drawer
  const [selectedJob, setSelectedJob] = useState(null);

  // Responsive layout with conditional rendering
  // Desktop: fixed sidebar + map + popup
  // Mobile/Tablet: floating button + map + bottom drawer
}
```

**Acceptance Criteria:**

- Component renders on all screen sizes
- Drawer opens/closes correctly with useDisclosure
- Filter sidebar toggles on mobile
- Dynamic import prevents SSR issues
- Layout switches correctly at breakpoints

---

### Task 3.2: Implement MapFilterSidebar Component

**Estimated Time:** 4 hours

**Dependencies:** Task 3.1, existing FilterSidebar.tsx

**Description:**
Create a reusable filter component that works in both fixed sidebar (desktop) and drawer (mobile) modes.

**Steps:**

1. Review existing `FilterSidebar.tsx` implementation
2. Extract reusable filter logic
3. Implement all filter types:
   - JobSearchAutocomplete (speciality)
   - LocationAutocomplete
   - Proximity slider (only when location set)
   - Experience slider
   - Salary range sliders (min/max)
   - Work mode checkboxes
   - Job type checkboxes
4. Add "Clear All" button
5. Handle filter state changes via onChange callback

**Acceptance Criteria:**

- All filters from FilterSidebar are present
- Component works in both sidebar and drawer contexts
- Filter state synchronizes with URL params
- Clear all button resets filters
- Responsive layout for mobile drawer

---

### Task 3.3: Implement JobMapMarkers Component

**Estimated Time:** 5 hours

**Dependencies:** Task 3.1

**Description:**
Implement marker rendering with clustering and click handling for both desktop (popup) and mobile (drawer).

**Steps:**

1. Install and configure react-leaflet-cluster
2. Create custom marker icons
3. Implement MarkerClusterGroup with custom cluster icons:
   - Small (1-10 jobs): Blue
   - Medium (11-50 jobs): Orange
   - Large (51+ jobs): Red
4. Add click handlers:
   - Mobile: Trigger drawer via onMarkerClick
   - Desktop: Show Leaflet Popup
5. Optimize for performance:
   - Limit markers on mobile (300 initial)
   - Use virtual clustering for 1000+ markers

**Custom Marker Icon:**

```tsx
const customIcon = L.divIcon({
  html: `<div class="custom-marker">...</div>`,
  className: "custom-marker-wrapper",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});
```

**Acceptance Criteria:**

- Markers render correctly for all jobs with geo coordinates
- Clustering works and shows job counts
- Click handlers differ by device (popup vs drawer)
- Custom icons display correctly
- Performance is acceptable with 500+ markers

---

### Task 3.4: Implement JobPreviewDrawer Component

**Estimated Time:** 4 hours

**Dependencies:** Task 3.1, Context7 HeroUI Drawer docs

**Description:**
Create a bottom drawer for mobile/tablet job previews using HeroUI Drawer component. The drawer should display the same information as the `components/landing/Job.tsx` component.

**HeroUI Drawer Configuration:**

- **placement:** `"bottom"`
- **size:** `"lg"` (85% max height)
- **isDismissable:** `true` (enable swipe to close)
- **backdrop:** `"blur"`
- **motionProps:** Custom enter/exit animations

**Steps:**

1. Import HeroUI Drawer components:
   ```tsx
   import {
     Drawer,
     DrawerContent,
     DrawerHeader,
     DrawerBody,
     DrawerFooter,
     Chip,
   } from "@heroui/react";
   ```
2. Reuse the GraphQL fragment from Job.tsx:
   ```tsx
   import { JobFragment } from "@/components/landing/Job";
   ```
3. Implement drawer with sections matching Job.tsx layout:
   - **DrawerHeader:**
     - Organization logo (if available)
     - Job title
     - Organization name with verification badge (if verified)
     - Salary range (formatted with currency icon)
   - **DrawerBody:**
     - Posted date (formatted)
     - Job info badges:
       - Job type (Full Time, Part Time, Contract, Internship, Locum)
       - Location (with MapPin icon)
       - Experience range (with Briefcase icon)
       - Work mode (Hybrid, Office, Remote - with Globe icon)
     - Skills as Chip components (all skills, wrapped)
   - **DrawerFooter:**
     - JobControls component (Save/Apply buttons)
     - "View Full Details" button
4. Add swipe gesture support (built into HeroUI Drawer)
5. Implement smooth animations:
   ```tsx
   motionProps={{
     variants: {
       enter: { y: 0, transition: { duration: 0.3, ease: "easeOut" } },
       exit: { y: "100%", transition: { duration: 0.2, ease: "easeIn" } },
     },
   }}
   ```
6. Implement helper functions from Job.tsx:
   - `currencyIcon()` - Maps currency to icon (INR → IndianRupee icon)
   - `jobType()` - Maps JobType enum to display string
   - `workMode()` - Maps WorkMode enum to display string
   - `formatExperienceRange()` - Formats min/max experience
   - Salary formatting with `salaryFormat.format()`
   - Date formatting with `dateFormat.format()`

**Information to Display (from Job.tsx):**

- Organization logo (Image component, 48-56px)
- Job title
- Organization name
- Verification badge (if organization is verified)
- Salary range (min-max or single value, or "Not disclosed")
- Posted date (formatted)
- Job type (Contract, Full Time, Part Time, Internship, Locum)
- Location
- Experience range (min-max years, or "Not specified")
- Work mode (Hybrid, Office, Remote)
- Skills list (as Chips)
- JobControls (Save/Apply functionality)

**Acceptance Criteria:**

- Drawer slides up from bottom smoothly
- Swipe down to dismiss works
- All job details from Job.tsx are displayed correctly
- Organization verification badge shows if verified
- Salary formatting matches Job.tsx (with currency icon)
- Experience range formatting matches Job.tsx
- Skills displayed as Chips with proper wrapping
- JobControls component integrated
- "View Full Details" navigates to job page using `links.jobDetail()`
- Animations run at 60fps
- Works on all mobile/tablet devices
- Layout is responsive and matches Job.tsx styling patterns

---

### Task 3.5: Implement JobMapPopup Component

**Estimated Time:** 2 hours

**Dependencies:** Task 3.3

**Description:**
Create desktop-only popup content for marker clicks (used in Leaflet Popup).

**Steps:**

1. Create minimal job info component:
   - Job title
   - Organization name
   - Location
   - "View Details" link
2. Style for compact display
3. Ensure it only renders on desktop

**Acceptance Criteria:**

- Popup displays on marker click (desktop only)
- Contains essential job info
- Link navigates to job detail page
- Compact and readable design

---

### Task 3.6: Implement JobMapControls Component

**Estimated Time:** 3 hours

**Dependencies:** Task 3.1

**Description:**
Create touch-optimized map controls for zoom, reset, and geolocation.

**Steps:**

1. Use react-leaflet's useMap hook
2. Implement control buttons:
   - Zoom in (+)
   - Zoom out (-)
   - Reset view (center on India)
   - Locate me (use browser geolocation)
3. Style for touch targets (44x44px minimum)
4. Position controls responsively:
   - Desktop: top-right
   - Mobile: top-right with larger buttons
5. Add smooth animations

**Acceptance Criteria:**

- All controls work correctly
- Touch targets meet 44x44px minimum
- Controls positioned correctly on all screen sizes
- Geolocation requests permission
- Reset returns to India center view

---

### Task 3.7: Implement JobMapSkeleton Component

**Estimated Time:** 1.5 hours

**Dependencies:** None

**Description:**
Create loading skeleton matching responsive layout.

**Steps:**

1. Create skeleton components for:
   - Map container (gray rectangle)
   - Filter sidebar (desktop)
   - Filter button (mobile)
2. Match responsive layout structure
3. Add pulsing animation

**Acceptance Criteria:**

- Skeleton matches layout structure
- Displays during loading
- Smooth transition to actual content
- Responsive to screen size

---

## Phase 4: GraphQL Integration (2 days)

### Task 4.1: Define GraphQL Fragments

**Estimated Time:** 2 hours

**Dependencies:** Task 1.6

**Description:**
Define GraphQL fragments inline using the `graphql` tag from Relay, directly in the component files that use them. The Relay compiler (running in watch mode) will automatically generate TypeScript types.

**Steps:**

1. In `components/search/map/JobMapMarkers.tsx`, define the fragment:

   ```tsx
   import { graphql } from "relay-runtime";
   import { useFragment } from "react-relay";
   import type { JobMapMarkerFragment$key } from "./__generated__/JobMapMarkerFragment.graphql";

   const JobMapMarkerFragment = graphql`
     fragment JobMapMarkerFragment on Job {
       id
       slug
       title
       location
       geo {
         coordinates
       }
       minSalary
       maxSalary
       currency
       type
       workMode
       minExperience
       maxExperience
       createdAt
       organization {
         id
         slug
         name
         logoUrl
       }
     }
   `;

   export default function JobMapMarkers({ jobs }) {
     // Use fragment with useFragment hook
   }
   ```

2. In `components/search/map/JobPreviewDrawer.tsx`, define the fragment:

   ```tsx
   import { graphql } from "relay-runtime";
   import { useFragment } from "react-relay";
   import type { JobPreviewDrawerFragment$key } from "./__generated__/JobPreviewDrawerFragment.graphql";

   const JobPreviewDrawerFragment = graphql`
     fragment JobPreviewDrawerFragment on Job {
       ...JobMapMarkerFragment
       description
       descriptionCleaned
       updatedAt
       skills
       organization {
         location
       }
       ...JobControlsFragment
     }
   `;

   export default function JobPreviewDrawer({ job }) {
     const data = useFragment(JobPreviewDrawerFragment, job);
     // Use data
   }
   ```

3. Wait for Relay compiler to auto-generate types in each component's `__generated__/` directory

**Acceptance Criteria:**

- Fragments defined inline in the same file as the component using `graphql` tag
- Each fragment is co-located with its component
- Relay compiler auto-generates TypeScript types in component-level `__generated__/` folders
- No manual compilation needed
- Types are available for import in the same directory

---

### Task 4.2: Define Map Query

**Estimated Time:** 3 hours

**Dependencies:** Task 4.1

**Description:**
Define the main GraphQL query inline for map view with all filter parameters. The Relay compiler will automatically generate types.

**Steps:**

1. In `app/search/map/page.tsx`, define the query inline:

   ```tsx
   import { graphql } from "relay-runtime";
   import { loadSerializableQuery } from "@/lib/relay/loadSerializableQuery";

   const JobsMapQuery = graphql`
     query JobsMapPageQuery(
       $searchTerm: String
       $location: String
       $proximityKm: Float
       $bounds: BoundingBoxInput
       $minExperience: Int
       $minSalary: Int
       $maxSalary: Int
       $workMode: [JobWorkModeFilter!]!
       $jobType: [JobTypeFilter!]!
       $sortBy: JobSearchSortBy!
       $first: Int!
     ) {
       jobs(
         searchTerm: $searchTerm
         location: $location
         proximityKm: $proximityKm
         bounds: $bounds
         minExperience: $minExperience
         minSalary: $minSalary
         maxSalary: $maxSalary
         workMode: $workMode
         jobType: $jobType
         sortBy: $sortBy
         first: $first
       ) {
         edges {
           node {
             ...JobMapMarkerFragment
             ...JobPreviewDrawerFragment
           }
         }
         totalCount
       }
     }
   `;

   export default async function MapPage({ searchParams }) {
     // Use the query
   }
   ```

2. Wait for Relay compiler to auto-generate types
3. Import generated types from `__generated__/JobsMapPageQuery.graphql`

**Acceptance Criteria:**

- Query defined inline using `graphql` tag
- All filter parameters included
- Bounds parameter included
- Fragments used correctly
- Relay compiler auto-generates types
- Generated types available in `__generated__/` directory

---

### Task 4.3: Implement Data Fetching in Page

**Estimated Time:** 3 hours

**Dependencies:** Task 4.2

**Description:**
Implement server-side data loading with Relay using the inline query.

**Steps:**

1. Update `app/search/map/page.tsx`:

   ```tsx
   import { graphql } from "relay-runtime";
   import { loadSerializableQuery } from "@/lib/relay/loadSerializableQuery";
   import type { JobsMapPageQuery } from "./__generated__/JobsMapPageQuery.graphql";

   const JobsMapQuery = graphql`
     query JobsMapPageQuery(
       $searchTerm: String
       $location: String
       $proximityKm: Float
       $bounds: BoundingBoxInput
       $minExperience: Int
       $minSalary: Int
       $maxSalary: Int
       $workMode: [JobWorkModeFilter!]!
       $jobType: [JobTypeFilter!]!
       $sortBy: JobSearchSortBy!
       $first: Int!
     ) {
       jobs(
         searchTerm: $searchTerm
         location: $location
         proximityKm: $proximityKm
         bounds: $bounds
         minExperience: $minExperience
         minSalary: $minSalary
         maxSalary: $maxSalary
         workMode: $workMode
         jobType: $jobType
         sortBy: $sortBy
         first: $first
       ) {
         edges {
           node {
             ...JobMapMarkerFragment
             ...JobPreviewDrawerFragment
           }
         }
         totalCount
       }
     }
   `;

   export default async function MapPage({ searchParams }) {
     const preloadedQuery = await loadSerializableQuery<JobsMapPageQuery>(
       JobsMapQuery,
       {
         searchTerm: searchParams.search,
         location: searchParams.location,
         proximityKm: searchParams.proximityKm
           ? Number(searchParams.proximityKm)
           : null,
         bounds: null, // Will be set by client on map interaction
         minExperience: searchParams.minExperience
           ? Number(searchParams.minExperience)
           : null,
         minSalary: searchParams.minSalary
           ? Number(searchParams.minSalary)
           : null,
         maxSalary: searchParams.maxSalary
           ? Number(searchParams.maxSalary)
           : null,
         workMode: searchParams.workMode
           ? searchParams.workMode.split(",")
           : [],
         jobType: searchParams.jobType ? searchParams.jobType.split(",") : [],
         sortBy: searchParams.sortBy || "RELEVANCE",
         first: 500,
       }
     );

     return <MapViewClientComponent preloadedQuery={preloadedQuery} />;
   }
   ```

2. Update `MapViewClientComponent.tsx` to accept and use preloaded query:

   ```tsx
   "use client";

   import { usePreloadedQuery } from "react-relay";
   import type { JobsMapPageQuery } from "../__generated__/JobsMapPageQuery.graphql";

   export default function MapViewClientComponent({ preloadedQuery }) {
     const data = usePreloadedQuery(JobsMapQuery, preloadedQuery);
     // Use data.jobs
   }
   ```

3. Implement refetch logic for filter changes using `useRefetchableFragment` or `useLazyLoadQuery`

**Acceptance Criteria:**

- Data loads on server using `loadSerializableQuery`
- Preloaded query passed to client component
- Client component uses `usePreloadedQuery` hook
- Refetch works on filter changes
- Loading states handled correctly
- TypeScript types used throughout

---

### Task 4.4: Integrate Filters with Query

**Estimated Time:** 4 hours

**Dependencies:** Task 4.3

**Description:**
Wire up all filters to trigger GraphQL refetches with updated variables.

**Steps:**

1. Set up filter state with nuqs
2. Debounce filter changes (300ms)
3. Implement bounds calculation from map viewport:
   ```tsx
   const handleMapMove = useCallback(
     debounce((map) => {
       const bounds = map.getBounds();
       const boundsInput = {
         sw_lat: bounds.getSouth(),
         sw_lng: bounds.getWest(),
         ne_lat: bounds.getNorth(),
         ne_lng: bounds.getEast(),
       };
       // Refetch with new bounds
     }, 300),
     []
   );
   ```
4. Refetch query with updated variables
5. Show loading indicator during refetch

**Acceptance Criteria:**

- All filters trigger refetch
- Map pan/zoom updates bounds and refetches
- Debouncing prevents excessive requests
- Loading states show during refetch
- URL updates with filter changes

---

## Phase 5: Mobile & Responsive Polish (3-4 days)

### Task 5.1: Implement Mobile Layout

**Estimated Time:** 4 hours

**Dependencies:** Task 3.1, 3.4

**Description:**
Optimize layout for mobile devices (<768px).

**Steps:**

1. Full-screen map implementation
2. Floating filter button (top-left)
3. Bottom drawer for job preview (HeroUI Drawer with placement="bottom")
4. Touch-optimized controls (larger buttons)
5. Hide desktop-only elements

**Acceptance Criteria:**

- Map fills entire viewport on mobile
- Filter button accessible and visible
- Drawer slides smoothly from bottom
- All interactive elements meet 44x44px touch target
- No horizontal scrolling

---

### Task 5.2: Implement Tablet Layout

**Estimated Time:** 3 hours

**Dependencies:** Task 5.1

**Description:**
Optimize layout for tablet devices (768-1023px).

**Steps:**

1. Full-width map
2. Filter drawer from left (HeroUI Drawer with placement="left")
3. Bottom drawer for job preview
4. Optimized control positions
5. Responsive font sizes

**Acceptance Criteria:**

- Layout optimized for tablet size
- Filter drawer slides from left
- Job drawer slides from bottom
- Controls positioned correctly
- Readable text at all zoom levels

---

### Task 5.3: Implement Desktop Layout

**Estimated Time:** 3 hours

**Dependencies:** Task 5.2

**Description:**
Optimize layout for desktop (≥1024px).

**Steps:**

1. Fixed filter sidebar (left, 320px width)
2. Map container (flex-1)
3. Popup-based job preview (no drawer)
4. Standard map controls
5. Hover effects

**Acceptance Criteria:**

- Fixed sidebar always visible
- Map fills remaining space
- Popup shows on marker click
- Hover effects work
- No drawer on desktop (popup only)

---

### Task 5.4: Implement Touch Gestures

**Estimated Time:** 4 hours

**Dependencies:** Task 5.1

**Description:**
Optimize map and drawer for touch interactions.

**Steps:**

1. Configure Leaflet for touch:
   ```tsx
   <MapContainer touchZoom={true} dragging={true} tap={true} />
   ```
2. Implement drawer swipe gestures (built into HeroUI Drawer with isDismissable)
3. Add long-press for marker info
4. Optimize pinch-to-zoom
5. Add touch-action CSS:
   ```css
   .leaflet-container {
     touch-action: pan-x pan-y;
   }
   ```

**Acceptance Criteria:**

- Pan works smoothly with one finger
- Pinch-to-zoom works reliably
- Tap markers opens drawer
- Swipe drawer down to dismiss
- No touch delay or lag

---

### Task 5.5: Performance Optimization

**Estimated Time:** 5 hours

**Dependencies:** Tasks 3.3, 5.4

**Description:**
Optimize map performance, especially on mobile.

**Steps:**

1. Lazy load map tiles
2. Debounce pan/zoom events (300ms):
   ```tsx
   const debouncedUpdateBounds = debounce((bounds) => {
     // Update bounds and refetch
   }, 300);
   ```
3. Limit initial markers:
   - Mobile: 300 markers
   - Desktop: 500 markers
4. Implement virtual clustering for 1000+ markers
5. Optimize drawer animations (60fps):
   - Use CSS transforms
   - GPU acceleration
   - Avoid layout thrashing
6. Preload marker icons
7. Memoize expensive computations

**Acceptance Criteria:**

- Map loads in <3s on mobile
- Pan/zoom feels smooth (60fps)
- Drawer animations at 60fps
- No frame drops during interactions
- Memory usage stays reasonable

---

### Task 5.6: Accessibility Implementation

**Estimated Time:** 4 hours

**Dependencies:** Tasks 5.1, 5.2, 5.3

**Description:**
Ensure map view is accessible to all users.

**Steps:**

1. Minimum touch targets (44x44px):
   ```tsx
   <Button
     isIconOnly
     className="min-w-11 min-h-11" // 44px = 11 * 4px
   />
   ```
2. High contrast markers
3. Screen reader announcements:
   ```tsx
   <div role="status" aria-live="polite">
     {selectedJob ? `Selected ${selectedJob.title}` : ""}
   </div>
   ```
4. Keyboard navigation:
   - Tab through controls
   - Enter to activate
   - Escape to close drawer
5. Focus management:
   - Focus trap in drawer
   - Return focus on close
6. ARIA labels:
   ```tsx
   <Button aria-label="Zoom in">+</Button>
   <Drawer aria-label="Job preview">...</Drawer>
   ```

**Acceptance Criteria:**

- All interactive elements tabbable
- Screen reader announces changes
- Keyboard navigation works
- Focus trap in drawer
- ARIA labels on all controls
- Passes WCAG 2.1 AA

---

## Phase 6: Filter Integration (2-3 days)

### Task 6.1: Wire Up All Filter Types

**Estimated Time:** 4 hours

**Dependencies:** Task 4.4

**Description:**
Connect all filter UI elements to GraphQL query variables.

**Steps:**

1. JobSearchAutocomplete → searchTerm
2. LocationAutocomplete → location
3. Proximity slider → proximityKm (show only if location set)
4. Experience slider → minExperience
5. Salary sliders → minSalary, maxSalary
6. Work mode checkboxes → workMode array
7. Job type checkboxes → jobType array
8. Sort dropdown → sortBy

**Acceptance Criteria:**

- All filters update query variables
- Changes trigger refetch
- UI reflects current filter state
- Conditional display works (proximity)

---

### Task 6.2: Filter State Synchronization

**Estimated Time:** 3 hours

**Dependencies:** Task 6.1

**Description:**
Sync filter state with URL parameters using nuqs.

**Steps:**

1. Set up nuqs parsers:
   ```tsx
   const [filters, setFilters] = useQueryStates({
     searchTerm: parseAsString,
     location: parseAsString,
     proximityKm: parseAsInteger.withDefault(50),
     minExperience: parseAsInteger,
     minSalary: parseAsInteger,
     maxSalary: parseAsInteger,
     workMode: parseAsArrayOf(parseAsString).withDefault([]),
     jobType: parseAsArrayOf(parseAsString).withDefault([]),
     sortBy: parseAsString.withDefault("RELEVANCE"),
   });
   ```
2. Update URL on filter changes
3. Parse URL on page load
4. Preserve filters on view toggle (map ↔ list)

**Acceptance Criteria:**

- URL updates on filter changes
- Filters restored from URL on load
- Filters preserved when toggling views
- Browser back/forward works
- Shareable URLs with filters

---

### Task 6.3: Mobile Filter Drawer

**Estimated Time:** 3 hours

**Dependencies:** Task 6.2

**Description:**
Implement full-screen filter drawer on mobile using HeroUI Drawer.

**Steps:**

1. Create filter drawer with HeroUI:
   ```tsx
   <Drawer
     isOpen={isSidebarOpen}
     onClose={() => setIsSidebarOpen(false)}
     placement="left"
     size="full"
     className="lg:hidden"
   >
     <DrawerContent>
       <DrawerHeader>Filter Jobs</DrawerHeader>
       <DrawerBody>
         <MapFilterSidebar
           filters={filters}
           onChange={(newFilters) => {
             onFiltersChange(newFilters);
             setIsSidebarOpen(false);
           }}
         />
       </DrawerBody>
     </DrawerContent>
   </Drawer>
   ```
2. Add "Apply" button to close and apply filters
3. Add "Clear All" button
4. Implement swipe to close (built into HeroUI)

**Acceptance Criteria:**

- Drawer slides from left on mobile
- "Apply" button applies and closes
- "Clear All" resets filters
- Swipe to close works
- Filters applied on drawer close

## Summary

**Total Estimated Time:** 18-24 days (3-4 weeks)

**Critical Path:**

1. Backend Foundation (Phase 1) → Frontend Setup (Phase 2)
2. Core Components (Phase 3) → GraphQL Integration (Phase 4)
3. Mobile Polish (Phase 5) → Integration (Phase 6)

**Key Dependencies:**

- MongoDB geospatial indexes must be optimized BEFORE frontend work
- HeroUI Drawer component must be understood BEFORE drawer implementation
- GraphQL schema must be regenerated BEFORE frontend integration
- Performance optimization must be done BEFORE testing

**Risk Mitigation:**

- Test geospatial queries early (Task 1.4)
- Prototype HeroUI Drawer early (Task 3.4)
- Test on real devices frequently (Tasks 8.1, 8.2)
- Monitor performance throughout (Task 5.5)

**Success Criteria:**

- ✅ Map displays on /search/map on all devices
- ✅ All filters work (same as list view)
- ✅ Job drawer opens on mobile marker click
- ✅ Performance targets met
- ✅ Accessibility compliant
- ✅ No critical bugs
