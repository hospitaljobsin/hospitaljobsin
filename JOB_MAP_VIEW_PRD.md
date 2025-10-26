# **Product Requirements Document (PRD): Job Map View Feature**

## **UPDATED VERSION - WITH FILTERS, DRAWER & MOBILE RESPONSIVENESS**

## **Overview**

Implement an interactive map view for browsing job listings geospatially, similar to Bandana.com's map interface. This feature will be implemented as a dedicated page in the seeker portal using OpenStreetMap and React-Leaflet, with **full filter support**, **bottom drawer for job previews**, and **complete mobile responsiveness**.

---

## **1. Feature Description**

### **1.1 Goals**

- Provide job seekers with a visual, location-based way to discover job opportunities
- **Maintain complete feature parity with list view filters**
- **Provide seamless job preview experience via bottom drawer**
- **Deliver excellent mobile experience with touch-optimized controls**
- Improve job discovery through geospatial clustering and interactive exploration
- Leverage existing location data already stored in the database

### **1.2 User Stories**

- As a job seeker, I want to see job opportunities on a map so I can find positions near me
- **As a job seeker, I want to use all the same filters on map view that I use on list view**
- **As a job seeker, I want to click a job marker and see a preview drawer slide up from the bottom**
- **As a job seeker, I want the map to work perfectly on my mobile device with touch gestures**
- As a job seeker, I want to see job clusters so I can identify areas with high job availability
- As a job seeker, I want to toggle between map and list views while preserving my filters

---

## **2. Technical Architecture**

### **2.1 Frontend Changes (Seeker Portal)**

#### **2.1.1 New Route Structure**

Create a new route at `/search/map` in the seeker portal

**Location:** `apps/seeker-portal/app/search/map/`

**Files to Create:**

```
apps/seeker-portal/app/search/map/
├── page.tsx                           # Server component for metadata & data loading
├── MapViewClientComponent.tsx         # Client component with state management
└── loading.tsx                        # Loading skeleton
```

#### **2.1.2 New Components**

**Base Map Component:**

```
apps/seeker-portal/components/search/map/
├── JobMapView.tsx                     # Main map container with responsive layout
├── JobMapMarkers.tsx                  # Marker rendering with clustering
├── JobMapPopup.tsx                    # Desktop: Popup content, Mobile: trigger drawer
├── JobPreviewDrawer.tsx               # NEW: Bottom drawer for job preview
├── JobMapControls.tsx                 # Map controls (zoom, reset, locate)
├── JobMapSkeleton.tsx                 # Loading skeleton for map
├── MapViewToggle.tsx                  # Toggle between map/list view
└── MapFilterSidebar.tsx               # NEW: Filter sidebar (reuses FilterSidebar logic)
```

#### **2.1.3 Package Dependencies**

Add to `apps/seeker-portal/package.json`:

```json
{
  "dependencies": {
    "leaflet": "^1.9.4",
    "react-leaflet": "^4.2.1",
    "leaflet.markercluster": "^1.5.3",
    "@types/leaflet": "^1.9.8",
    "@types/leaflet.markercluster": "^1.5.4"
  }
}
```

#### **2.1.4 GraphQL Queries**

**New Fragment for Map Data:**

```graphql
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

# For drawer preview - includes more details
fragment JobPreviewDrawerFragment on Job {
  id
  slug
  title
  description
  descriptionCleaned
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
  updatedAt
  skills
  organization {
    id
    slug
    name
    logoUrl
    location
  }
  ...JobControlsFragment # For save/apply buttons
}
```

**Query for Map View:**

```graphql
query JobsMapQuery(
  $searchTerm: String
  $location: String
  $proximityKm: Float
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
  # Include filter metadata
  ...SearchFiltersFragment
}
```

#### **2.1.5 Responsive Layout Structure**

**Desktop Layout (≥1024px):**

```
┌─────────────────────────────────────────┐
│ Header                                  │
├──────────┬──────────────────────────────┤
│          │                              │
│ Filter   │   Map Container              │
│ Sidebar  │   (with markers & clusters)  │
│          │                              │
│ (Fixed)  │   ┌──────────────────────┐   │
│          │   │  Job Popup (Leaflet) │   │
│          │   │  • Title             │   │
│          │   │  • Quick Info        │   │
│          │   │  • View Details btn  │   │
│          │   └──────────────────────┘   │
│          │                              │
└──────────┴──────────────────────────────┘
```

**Tablet Layout (768px - 1023px):**

```
┌─────────────────────────────────────────┐
│ Header                                  │
├─────────────────────────────────────────┤
│ [Filters Button] [Toggle: Map/List]    │
├─────────────────────────────────────────┤
│                                         │
│        Map Container (Full Width)       │
│                                         │
│   ┌────────────────────────────┐        │
│   │  Bottom Drawer (slides up) │        │
│   │  • Job Preview             │        │
│   │  • Partial Height          │        │
│   └────────────────────────────┘        │
└─────────────────────────────────────────┘
```

**Mobile Layout (<768px):**

```
┌───────────────────────┐
│ Header (Minimal)      │
├───────────────────────┤
│ [≡] [Toggle]          │
├───────────────────────┤
│                       │
│   Map (Full Screen)   │
│   (Touch Optimized)   │
│                       │
│   ┌───────────────┐   │
│   │ Bottom Drawer │   │
│   │ (Swipe up to  │   │
│   │  expand)      │   │
│   └───────────────┘   │
└───────────────────────┘
```

#### **2.1.6 Component Implementation Details**

### **JobMapView.tsx** (Main Component)

```typescript
"use client";

import { useDisclosure } from "@heroui/react";
import dynamic from "next/dynamic";
import { useState } from "react";
import { useFragment } from "react-relay";

// Dynamic import for Leaflet (client-side only)
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);

interface JobMapViewProps {
  data: JobMapViewFragment$key;
  filters: FilterValues;
  onFiltersChange: (filters: FilterValues) => void;
}

export default function JobMapView({
  data,
  filters,
  onFiltersChange,
}: JobMapViewProps) {
  const jobs = useFragment(JobMapViewFragment, data);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure(); // For drawer
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile filter sidebar

  const handleMarkerClick = (job: Job) => {
    setSelectedJob(job);
    onOpen(); // Open drawer on mobile/tablet
  };

  return (
    <div className="flex h-[calc(100vh-theme(spacing.16))]">
      {/* Desktop Filter Sidebar - Fixed Left */}
      <div className="hidden lg:block w-80 border-r border-divider overflow-y-auto">
        <MapFilterSidebar filters={filters} onChange={onFiltersChange} />
      </div>

      {/* Map Container */}
      <div className="flex-1 relative">
        {/* Mobile: Floating Filter Button */}
        <div className="lg:hidden absolute top-4 left-4 z-[1000]">
          <Button
            onPress={() => setIsSidebarOpen(true)}
            startContent={<SlidersHorizontal />}
            variant="shadow"
          >
            Filters
          </Button>
        </div>

        {/* Map */}
        <MapContainer
          center={[20.5937, 78.9629]}
          zoom={5}
          className="h-full w-full"
          zoomControl={false} // Custom controls
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <JobMapMarkers jobs={jobs} onMarkerClick={handleMarkerClick} />
          <JobMapControls />
        </MapContainer>

        {/* Mobile Filter Drawer */}
        <Drawer
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          placement="left"
          size="full"
          className="lg:hidden"
        >
          <DrawerContent>
            <DrawerHeader>
              <h2>Filter Jobs</h2>
            </DrawerHeader>
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
      </div>

      {/* Job Preview Drawer (Mobile/Tablet) */}
      <JobPreviewDrawer job={selectedJob} isOpen={isOpen} onClose={onClose} />
    </div>
  );
}
```

### **JobPreviewDrawer.tsx** (Bottom Drawer for Job Preview)

```typescript
"use client";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button,
  Chip,
  Card,
} from "@heroui/react";
import {
  MapPin,
  Briefcase,
  DollarSign,
  Clock,
  ExternalLink,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useFragment } from "react-relay";
import links from "@/lib/links";

interface JobPreviewDrawerProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function JobPreviewDrawer({
  job,
  isOpen,
  onClose,
}: JobPreviewDrawerProps) {
  const router = useRouter();

  if (!job) return null;

  const handleViewDetails = () => {
    router.push(links.jobDetail(job.organization.slug, job.slug));
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      placement="bottom"
      size="lg"
      className="max-h-[85vh]"
      // Enable swipe gestures on mobile
      isDismissable
      hideCloseButton={false}
    >
      <DrawerContent>
        <DrawerHeader className="flex flex-col gap-1 border-b pb-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h2 className="text-xl font-semibold line-clamp-2">
                {job.title}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                {job.organization.logoUrl && (
                  <img
                    src={job.organization.logoUrl}
                    alt={job.organization.name}
                    className="w-6 h-6 rounded"
                  />
                )}
                <p className="text-sm text-foreground-500">
                  {job.organization.name}
                </p>
              </div>
            </div>
          </div>
        </DrawerHeader>

        <DrawerBody className="overflow-y-auto">
          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {job.location && (
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-foreground-400" />
                <span className="line-clamp-1">{job.location}</span>
              </div>
            )}

            <div className="flex items-center gap-2 text-sm">
              <Briefcase className="w-4 h-4 text-foreground-400" />
              <span>
                {job.minExperience || 0}-{job.maxExperience || 0} years
              </span>
            </div>

            {(job.minSalary || job.maxSalary) && (
              <div className="flex items-center gap-2 text-sm">
                <DollarSign className="w-4 h-4 text-foreground-400" />
                <span>
                  {job.minSalary ? `₹${job.minSalary}` : ""}{" "}
                  {job.minSalary && job.maxSalary && "-"}{" "}
                  {job.maxSalary ? `₹${job.maxSalary}` : ""}
                  {job.currency !== "INR" && ` ${job.currency}`}
                </span>
              </div>
            )}

            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-foreground-400" />
              <span>
                {formatDistance(new Date(job.createdAt), new Date())} ago
              </span>
            </div>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            {job.type && (
              <Chip size="sm" variant="flat" color="primary">
                {job.type}
              </Chip>
            )}
            {job.workMode && (
              <Chip size="sm" variant="flat" color="secondary">
                {job.workMode}
              </Chip>
            )}
          </div>

          {/* Description Preview */}
          <Card className="p-4">
            <h3 className="font-medium mb-2">Job Description</h3>
            <p className="text-sm text-foreground-600 line-clamp-6">
              {job.descriptionCleaned}
            </p>
          </Card>

          {/* Skills */}
          {job.skills && job.skills.length > 0 && (
            <div className="mt-4">
              <h3 className="font-medium mb-2">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {job.skills.slice(0, 10).map((skill, idx) => (
                  <Chip key={idx} size="sm" variant="bordered">
                    {skill}
                  </Chip>
                ))}
              </div>
            </div>
          )}
        </DrawerBody>

        <DrawerFooter className="border-t pt-4">
          <div className="flex gap-2 w-full">
            <Button variant="bordered" onPress={onClose} className="flex-1">
              Close
            </Button>
            <Button
              color="primary"
              onPress={handleViewDetails}
              endContent={<ExternalLink className="w-4 h-4" />}
              className="flex-1"
            >
              View Full Details
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
```

### **MapFilterSidebar.tsx** (Reusable Filter Component)

```typescript
"use client";

import {
  Card,
  CardBody,
  Checkbox,
  CheckboxGroup,
  Slider,
  Button,
} from "@heroui/react";
import { EraserIcon } from "lucide-react";
import JobSearchAutocomplete from "../forms/JobSearchAutocomplete";
import LocationAutocomplete from "../forms/LocationAutocomplete";
import type { FilterValues } from "../FilterSidebar";

interface MapFilterSidebarProps {
  filters: FilterValues;
  onChange: (filters: FilterValues) => void;
  location?: string | null;
  speciality?: string | null;
}

export default function MapFilterSidebar({
  filters,
  onChange,
  location = null,
  speciality = null,
}: MapFilterSidebarProps) {
  // Reuse existing FilterSidebar logic
  // This component will be a simplified version for map view

  const handleClearFilters = () => {
    onChange({
      minExperience: null,
      minSalary: null,
      maxSalary: null,
      proximityKm: 50,
      workMode: [],
      jobType: [],
      sortBy: "RELEVANCE",
    });
  };

  return (
    <div className="flex flex-col gap-6 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Filters</h2>
        <Button
          size="sm"
          variant="light"
          startContent={<EraserIcon className="w-4 h-4" />}
          onPress={handleClearFilters}
        >
          Clear All
        </Button>
      </div>

      {/* Search by Speciality */}
      <JobSearchAutocomplete
        id="job-search"
        label="Search by Speciality"
        placeholder="e.g., Nurse, Doctor, Pharmacist"
        value={speciality || ""}
        onSubmit={(value) => {
          // Update search term
        }}
      />

      {/* Location Filter */}
      <LocationAutocomplete
        id="location"
        label="Location"
        value={location || ""}
        onSubmit={(value) => {
          // Update location
        }}
      />

      {/* Proximity Slider (only show if location is set) */}
      {location && (
        <Slider
          label="Proximity"
          minValue={0}
          maxValue={200}
          step={10}
          value={filters.proximityKm}
          onChange={(value) =>
            onChange({ ...filters, proximityKm: value as number })
          }
          formatOptions={{
            style: "unit",
            unit: "kilometer",
          }}
        />
      )}

      {/* Experience Filter */}
      <Slider
        label="Minimum Experience"
        minValue={0}
        maxValue={30}
        step={1}
        value={filters.minExperience || 0}
        onChange={(value) =>
          onChange({ ...filters, minExperience: value as number })
        }
        formatOptions={{
          style: "unit",
          unit: "year",
        }}
      />

      {/* Salary Range */}
      <div className="flex flex-col gap-2">
        <Slider
          label="Minimum Salary (₹)"
          minValue={0}
          maxValue={1000000}
          step={10000}
          value={filters.minSalary || 0}
          onChange={(value) =>
            onChange({ ...filters, minSalary: value as number })
          }
        />
        <Slider
          label="Maximum Salary (₹)"
          minValue={0}
          maxValue={2000000}
          step={10000}
          value={filters.maxSalary || 0}
          onChange={(value) =>
            onChange({ ...filters, maxSalary: value as number })
          }
        />
      </div>

      {/* Work Mode */}
      <CheckboxGroup
        label="Work Mode"
        value={filters.workMode}
        onValueChange={(value) => onChange({ ...filters, workMode: value })}
      >
        <Checkbox value="REMOTE">Remote</Checkbox>
        <Checkbox value="HYBRID">Hybrid</Checkbox>
        <Checkbox value="OFFICE">Office</Checkbox>
      </CheckboxGroup>

      {/* Job Type */}
      <CheckboxGroup
        label="Job Type"
        value={filters.jobType}
        onValueChange={(value) => onChange({ ...filters, jobType: value })}
      >
        <Checkbox value="FULL_TIME">Full Time</Checkbox>
        <Checkbox value="PART_TIME">Part Time</Checkbox>
        <Checkbox value="CONTRACT">Contract</Checkbox>
        <Checkbox value="INTERNSHIP">Internship</Checkbox>
        <Checkbox value="LOCUM">Locum</Checkbox>
      </CheckboxGroup>
    </div>
  );
}
```

### **JobMapMarkers.tsx** (Enhanced for Mobile)

```typescript
"use client";

import { useEffect, useState } from "react";
import { Marker, Popup, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";

interface JobMapMarkersProps {
  jobs: Job[];
  onMarkerClick: (job: Job) => void;
}

export default function JobMapMarkers({
  jobs,
  onMarkerClick,
}: JobMapMarkersProps) {
  const map = useMap();
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Custom marker icon
  const customIcon = L.divIcon({
    html: `
      <div class="custom-marker">
        <svg viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 text-primary">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
      </div>
    `,
    className: "custom-marker-wrapper",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });

  const handleMarkerClick = (e: L.LeafletMouseEvent, job: Job) => {
    e.originalEvent.preventDefault();

    if (isMobile) {
      // On mobile, trigger drawer instead of popup
      onMarkerClick(job);
    } else {
      // On desktop, show popup (Leaflet default behavior)
      // Popup content handled in Popup component
    }
  };

  return (
    <MarkerClusterGroup
      chunkedLoading
      maxClusterRadius={50}
      spiderfyOnMaxZoom
      showCoverageOnHover={!isMobile}
      zoomToBoundsOnClick
      iconCreateFunction={(cluster) => {
        const count = cluster.getChildCount();
        let size = "small";
        let color = "bg-blue-500";

        if (count > 50) {
          size = "large";
          color = "bg-red-500";
        } else if (count > 10) {
          size = "medium";
          color = "bg-orange-500";
        }

        return L.divIcon({
          html: `
            <div class="cluster-marker ${color}">
              <span>${count}</span>
            </div>
          `,
          className: `marker-cluster marker-cluster-${size}`,
          iconSize: [40, 40],
        });
      }}
    >
      {jobs.map((job) => {
        if (!job.geo?.coordinates) return null;

        const [lng, lat] = job.geo.coordinates;

        return (
          <Marker
            key={job.id}
            position={[lat, lng]}
            icon={customIcon}
            eventHandlers={{
              click: (e) => handleMarkerClick(e, job),
            }}
          >
            {/* Desktop: Show popup */}
            {!isMobile && (
              <Popup>
                <JobMapPopup job={job} />
              </Popup>
            )}
          </Marker>
        );
      })}
    </MarkerClusterGroup>
  );
}
```

### **JobMapControls.tsx** (Touch-Optimized)

```typescript
"use client";

import { Button } from "@heroui/react";
import { Minus, Plus, Crosshair, RotateCcw } from "lucide-react";
import { useMap } from "react-leaflet";

export default function JobMapControls() {
  const map = useMap();

  const handleZoomIn = () => map.zoomIn();
  const handleZoomOut = () => map.zoomOut();
  const handleReset = () => map.setView([20.5937, 78.9629], 5);
  const handleLocate = () => {
    map.locate({ setView: true, maxZoom: 12 });
  };

  return (
    <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
      {/* Zoom Controls */}
      <div className="flex flex-col gap-1 bg-background shadow-lg rounded-lg overflow-hidden">
        <Button
          isIconOnly
          size="sm"
          variant="light"
          onPress={handleZoomIn}
          aria-label="Zoom in"
        >
          <Plus className="w-5 h-5" />
        </Button>
        <div className="h-px bg-divider" />
        <Button
          isIconOnly
          size="sm"
          variant="light"
          onPress={handleZoomOut}
          aria-label="Zoom out"
        >
          <Minus className="w-5 h-5" />
        </Button>
      </div>

      {/* Additional Controls */}
      <Button
        isIconOnly
        size="sm"
        variant="shadow"
        onPress={handleLocate}
        aria-label="Show my location"
      >
        <Crosshair className="w-5 h-5" />
      </Button>

      <Button
        isIconOnly
        size="sm"
        variant="shadow"
        onPress={handleReset}
        aria-label="Reset view"
      >
        <RotateCcw className="w-5 h-5" />
      </Button>
    </div>
  );
}
```

#### **2.1.7 Mobile Optimizations**

**Touch Gestures:**

- Pan map with single finger
- Pinch to zoom
- Tap marker to open drawer
- Swipe drawer up/down to expand/collapse
- Swipe drawer down to dismiss

**Performance:**

- Lazy load map tiles
- Debounce pan/zoom events (300ms)
- Limit initial markers to 300 on mobile
- Use virtual clustering for 1000+ markers
- Optimize drawer animations (60fps)

**Accessibility:**

- Touch targets minimum 44x44px
- High contrast markers
- Screen reader announcements
- Keyboard navigation support
- Focus management in drawer

#### **2.1.8 Styling Specifications**

**Custom Marker Styles:**

```css
/* Add to globals.css */
.custom-marker-wrapper {
  background: transparent;
  border: none;
}

.custom-marker {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
  transition: transform 0.2s ease;
}

.custom-marker:hover {
  transform: scale(1.1);
}

.cluster-marker {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 14px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

/* Mobile optimizations */
@media (max-width: 768px) {
  .leaflet-container {
    touch-action: pan-x pan-y;
  }

  .custom-marker {
    width: 28px;
    height: 28px;
  }

  .cluster-marker {
    width: 36px;
    height: 36px;
    font-size: 12px;
  }
}
```

**Drawer Animations:**

```css
/* Smooth drawer transitions */
[data-slot="drawer"] {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Backdrop blur on mobile */
@media (max-width: 768px) {
  [data-slot="drawer-backdrop"] {
    backdrop-filter: blur(4px);
  }
}
```

---

### **2.2 Backend Changes (Server)**

#### **2.2.1 GraphQL Schema Updates**

**Update Job Type:**

```python
# server/app/jobs/types.py

@strawberry.type(
    name="Job",
    description="A job posting.",
)
class JobType(BaseNodeType[Job]):
    # ... existing fields ...

    geo: GeoObjectType | None = strawberry.field(
        default=None,
        description="Geographic coordinates of the job location.",
    )
```

**New GeoObject Type:**

```python
# server/app/base/types.py (or appropriate location)

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

#### **2.2.2 Repository Updates**

**CRITICAL: MongoDB Geospatial Query Constraints**

MongoDB has specific requirements for geospatial queries in aggregation pipelines:

1. **$geoNear Stage Constraint:**

   - `$geoNear` MUST be the **first stage** in an aggregation pipeline
   - Cannot be preceded by any other stage (including `$match`)
   - Limitation: This restricts our ability to filter active jobs first

2. **$geoWithin with Variables:**

   - `$geoWithin` **CANNOT** be used with pipeline variables in `$lookup` or `$expr`
   - Variables like `$$boundingBox` will fail with `$geoWithin`
   - Solution: Use direct `$match` with `$geoWithin` instead

3. **Best Practice for Our Use Case:**

   - Use `$match` with `$geoWithin` EARLY in the pipeline (position 1 or 2)
   - Place geospatial filter BEFORE any `$lookup`, `$unwind`, or complex aggregations
   - This ensures the `geo_2dsphere_index` is used efficiently
   - Order: `is_active` filter → geospatial filter → other filters

4. **Why Not $geoNear:**
   - While `$geoNear` is more powerful (provides distance, sorting)
   - It must be first, preventing us from filtering `is_active` first
   - For bounding box queries, `$match` + `$geoWithin` is more flexible

**Update JobRepo.get_all_active():**

```python
# server/app/jobs/repositories.py

async def get_all_active(
    self,
    # ... existing parameters ...
    bounds: BoundingBox | None = None,  # NEW: Bounding box for map viewport
) -> PaginatedResult[Job]:
    """Get all active jobs with optional geographic bounds filtering."""

    # IMPORTANT: MongoDB Geospatial Query Stage Ordering
    # - $geoWithin CANNOT be used with variables in aggregation pipelines
    # - $geoNear MUST be the first stage if used
    # - For bounding box queries, use $match + $geoWithin EARLY in pipeline
    # - Place geospatial stages BEFORE lookups, grouping, or complex operations

    pipeline: list[dict[str, Any]] = [
        {"$match": {"is_active": True}},  # Initial filter
    ]

    # NEW: Add geospatial filter IMMEDIATELY after active filter
    # This ensures the geo_2dsphere_index is used efficiently
    if bounds:
        pipeline.append({
            "$match": {
                "geo": {
                    "$geoWithin": {
                        "$box": [
                            [bounds.sw_lng, bounds.sw_lat],  # Southwest corner [lng, lat]
                            [bounds.ne_lng, bounds.ne_lat]   # Northeast corner [lng, lat]
                        ]
                    }
                }
            }
        })

    # Continue with existing filters (location, proximity, etc.)
    # These should come AFTER the geospatial filter
    # ... rest of existing pipeline stages ...
```

**New BoundingBox Model:**

```python
# server/app/base/models.py

class BoundingBox(BaseModel):
    """Geographic bounding box for map viewport queries."""
    sw_lat: float = Field(description="Southwest latitude")
    sw_lng: float = Field(description="Southwest longitude")
    ne_lat: float = Field(description="Northeast latitude")
    ne_lng: float = Field(description="Northeast longitude")
```

#### **2.2.3 Query Updates**

**Update jobs query to support bounds:**

```python
# server/app/jobs/query.py

@strawberry.field(
    graphql_type=JobConnectionType,
    description="Get all active jobs available.",
)
@inject
async def jobs(
    self,
    # ... existing parameters ...
    bounds: Annotated[
        BoundingBoxInput | None,
        strawberry.argument(
            description="Geographic bounding box to filter jobs by map viewport",
        ),
    ] = None,
) -> JobConnectionType:

    paginated_result = await job_repo.get_all_active(
        # ... existing parameters ...
        bounds=BoundingBox(**bounds.__dict__) if bounds else None,
    )

    return JobConnectionType.marshal(
        paginated_result=paginated_result,
    )
```

**New BoundingBoxInput:**

```python
# server/app/jobs/types.py

@strawberry.input(
    name="BoundingBoxInput",
    description="Geographic bounding box input for filtering jobs by map viewport.",
)
class BoundingBoxInput:
    sw_lat: float = strawberry.field(
        description="Southwest corner latitude"
    )
    sw_lng: float = strawberry.field(
        description="Southwest corner longitude"
    )
    ne_lat: float = strawberry.field(
        description="Northeast corner latitude"
    )
    ne_lng: float = strawberry.field(
        description="Northeast corner longitude"
    )
```

#### **2.2.4 Database Optimizations**

**Verify Geospatial Index:**

```python
# server/app/jobs/documents.py

class Job(Document):
    # ... existing fields ...

    class Settings:
        name = "jobs"
        indexes: ClassVar[list[IndexModel | SearchIndexModel]] = [
            # ... existing indexes ...

            # Already exists - verify it's present:
            IndexModel([("geo", pymongo.GEOSPHERE)], name="geo_2dsphere_index"),
        ]
```

**Add Compound Index for Better Performance:**

```python
# Add to Job.Settings.indexes if not present
IndexModel(
    [
        ("is_active", pymongo.ASCENDING),
        ("geo", pymongo.GEOSPHERE),
    ],
    name="active_geo_index",
)
```

---

## **3. Implementation Steps**

### **Phase 1: Backend Foundation** (2-3 days)

1. **Step 1.1:** Add `GeoObjectType` to schema

   - Create type in `server/app/base/types.py`
   - Add marshal method
   - Update `JobType` to include `geo` field

2. **Step 1.2:** Add `BoundingBox` models

   - Create `BoundingBox` in `server/app/base/models.py`
   - Create `BoundingBoxInput` in `server/app/jobs/types.py`

3. **Step 1.3:** Update `JobRepo.get_all_active()`

   - Add `bounds` parameter
   - Implement `$geoWithin` query logic
   - Test with sample bounds

4. **Step 1.4:** Update GraphQL query

   - Add `bounds` argument to `jobs` query
   - Update query resolver

5. **Step 1.5:** Regenerate GraphQL schema

   - Run: `cd server && uv run strawberry export-schema app.schema:schema > ../schema/schema.graphql`

6. **Step 1.6:** Verify database indexes
   - Check existing `geo_2dsphere_index`
   - Add `active_geo_index` if needed

### **Phase 2: Frontend Setup** (1 day)

7. **Step 2.1:** Install dependencies

   - Add leaflet, react-leaflet, leaflet.markercluster packages
   - Run `pnpm install` in seeker-portal

8. **Step 2.2:** Create route structure

   - Create `apps/seeker-portal/app/search/map/` directory
   - Create `page.tsx`, `MapViewClientComponent.tsx`, `loading.tsx`

9. **Step 2.3:** Create component directory
   - Create `apps/seeker-portal/components/search/map/` directory

### **Phase 3: Core Map Components** (4-5 days)

10. **Step 3.1:** Create `JobMapView.tsx`

    - Set up responsive layout with conditional rendering
    - Implement filter sidebar visibility logic
    - Add drawer state management
    - Use `next/dynamic` for client-side only import

11. **Step 3.2:** Create `MapFilterSidebar.tsx`

    - **Reuse all filter logic from existing `FilterSidebar`**
    - Adapt for both desktop (fixed sidebar) and mobile (drawer)
    - Implement all filter types (search, location, proximity, experience, salary, work mode, job type)
    - Add clear filters functionality

12. **Step 3.3:** Create `JobMapMarkers.tsx`

    - Implement marker rendering from job data
    - Add marker clustering with `react-leaflet-cluster`
    - **Mobile: Trigger drawer on marker tap**
    - **Desktop: Show Leaflet popup on marker click**
    - Custom cluster icons with job counts

13. **Step 3.4:** Create `JobPreviewDrawer.tsx`

    - **Design drawer UI with HeroUI `Drawer` component**
    - **Display comprehensive job preview (title, org, salary, description, skills)**
    - **Add "View Full Details" and "Close" buttons**
    - **Implement swipe gestures for mobile**
    - Lazy load job details if needed

14. **Step 3.5:** Create `JobMapPopup.tsx`

    - **Desktop-only popup content**
    - Minimal job info (title, org, location)
    - Click to view full details

15. **Step 3.6:** Create `JobMapControls.tsx`

    - **Touch-optimized zoom controls**
    - Reset view button
    - Current location button
    - Responsive sizing for mobile

16. **Step 3.7:** Create `MapViewToggle.tsx`

    - **Floating button on mobile**
    - **Integrated in header on desktop**
    - Preserve filter state on toggle

17. **Step 3.8:** Create `JobMapSkeleton.tsx`
    - Loading skeleton matching responsive layout

### **Phase 4: GraphQL Integration** (2 days)

18. **Step 4.1:** Create GraphQL fragments

    - Define `JobMapMarkerFragment`
    - Define `JobPreviewDrawerFragment`
    - Add to Relay compiler config

19. **Step 4.2:** Create map query

    - Define `JobsMapQuery` with all filter parameters
    - Add bounds parameter support

20. **Step 4.3:** Implement data fetching

    - Use `loadSerializableQuery` in page.tsx
    - Pass preloaded query to client component

21. **Step 4.4:** Integrate with filters
    - Reuse filter state from existing search
    - Update query on filter changes
    - Implement bounds-based refetch on map pan/zoom

### **Phase 5: Mobile & Responsive Polish** (3-4 days)

22. **Step 5.1:** Mobile Layout Implementation

    - Full-screen map on mobile (<768px)
    - Floating filter button
    - Bottom drawer for job preview
    - Touch-optimized controls

23. **Step 5.2:** Tablet Layout Implementation

    - Partial-width filter drawer
    - Bottom drawer for job preview
    - Optimized control positions

24. **Step 5.3:** Desktop Layout Implementation

    - Fixed filter sidebar
    - Popup-based job preview
    - Standard map controls

25. **Step 5.4:** Touch Gesture Support

    - Pan, pinch to zoom
    - Tap markers
    - Swipe drawer
    - Long-press actions

26. **Step 5.5:** Performance Optimization

    - Lazy load map tiles
    - Debounce pan/zoom
    - Limit markers on mobile
    - Optimize animations

27. **Step 5.6:** Accessibility
    - Touch target sizes (44x44px minimum)
    - Screen reader support
    - Keyboard navigation
    - Focus management

### **Phase 6: Filter Integration** (2-3 days)

28. **Step 6.1:** Wire up all filter types

    - Search by speciality
    - Location with proximity
    - Experience range
    - Salary range
    - Work mode checkboxes
    - Job type checkboxes

29. **Step 6.2:** Filter state synchronization

    - URL state with `nuqs`
    - Preserve on view toggle
    - Reset functionality

30. **Step 6.3:** Mobile filter drawer
    - Full-screen drawer on mobile
    - Apply and close buttons
    - Clear filters option

### **Phase 7: Integration & Navigation** (1-2 days)

31. **Step 7.1:** Add navigation links

    - Update `FilterSidebar` to include map view toggle
    - Add map view button to search results header

32. **Step 7.2:** Update sitemap

    - Add `/search/map` to sitemap.ts

33. **Step 7.3:** Update links helper
    - Add `searchMap()` function to `lib/links.ts`

### **Phase 8: Testing & Deployment** (3-4 days)

34. **Step 8.1:** Responsive Testing

    - Test on iPhone (Safari, Chrome)
    - Test on Android (Chrome, Samsung Internet)
    - Test on iPad
    - Test on desktop (Chrome, Firefox, Safari, Edge)

35. **Step 8.2:** Touch Interaction Testing

    - Tap, swipe, pinch gestures
    - Drawer interactions
    - Filter interactions
    - Map controls

36. **Step 8.3:** Performance Testing

    - Mobile performance (< 3s load)
    - Drawer animation smoothness (60fps)
    - Marker clustering performance
    - Filter application speed

37. **Step 8.4:** Accessibility Testing

    - Screen reader compatibility
    - Keyboard navigation
    - Touch target sizes
    - Color contrast

38. **Step 8.5:** Cross-browser Testing

    - Chrome, Firefox, Safari, Edge
    - iOS Safari, Chrome
    - Android Chrome, Samsung Internet

39. **Step 8.6:** Deployment
    - Deploy to staging
    - QA review
    - Production deployment

---

## **4. Technical Specifications**

### **4.1 Responsive Breakpoints**

```typescript
// tailwind.config.js or constants
export const BREAKPOINTS = {
  mobile: 0, // 0-767px
  tablet: 768, // 768-1023px
  desktop: 1024, // 1024px+
};
```

### **4.2 Drawer Configuration**

```typescript
// HeroUI Drawer props for job preview
<Drawer
  isOpen={isOpen}
  onClose={onClose}
  placement="bottom"
  size="lg" // 85% height max
  className="max-h-[85vh]"
  isDismissable={true} // Can swipe down to close
  hideCloseButton={false}
  motionProps={{
    variants: {
      enter: {
        y: 0,
        transition: { duration: 0.3, ease: "easeOut" },
      },
      exit: {
        y: "100%",
        transition: { duration: 0.2, ease: "easeIn" },
      },
    },
  }}
/>
```

### **4.3 Map Configuration**

- **Tile Provider:** OpenStreetMap (https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png)
- **Initial View:** India center ([20.5937, 78.9629]) or user location
- **Default Zoom:** 5 (mobile), 6 (desktop)
- **Max Zoom:** 18
- **Min Zoom:** 4
- **Touch Actions:** Pan, pinch-zoom enabled

### **4.4 Performance Targets**

- **Initial Load:** < 2s (desktop), < 3s (mobile)
- **Drawer Animation:** 60fps
- **Map Interaction:** < 100ms response time
- **Max Markers (Mobile):** 300 initially
- **Max Markers (Desktop):** 500 initially
- **Debounce:** 300ms for bounds-based refetch

### **4.5 Filter State Management**

```typescript
// URL state with nuqs
const [filters, setFilters] = useQueryStates(
  {
    searchTerm: parseAsString,
    location: parseAsString,
    proximityKm: parseAsInteger.withDefault(50),
    minExperience: parseAsInteger,
    minSalary: parseAsInteger,
    maxSalary: parseAsInteger,
    workMode: parseAsArrayOf(parseAsString).withDefault([]),
    jobType: parseAsArrayOf(parseAsString).withDefault([]),
    sortBy: parseAsString.withDefault("RELEVANCE"),
  },
  { shallow: true }
);
```

---

## **5. Design Specifications**

### **5.1 Mobile Drawer Design**

- **Height:** Starts at 40vh, expands to 85vh on swipe up
- **Drag Handle:** Visual indicator at top (horizontal bar)
- **Backdrop:** Semi-transparent with blur effect
- **Animation:** Smooth 300ms spring animation
- **Swipe Threshold:** 50px to dismiss

### **5.2 Filter Sidebar (Mobile)**

- **Type:** Full-screen drawer from left
- **Background:** Solid background color
- **Header:** "Filter Jobs" with close button
- **Footer:** "Apply Filters" and "Clear All" buttons
- **Scroll:** Vertical scroll for all filters

### **5.3 Touch Targets**

- **Minimum Size:** 44x44px for all interactive elements
- **Spacing:** 8px minimum between touch targets
- **Active State:** Visual feedback on tap (ripple effect)

### **5.4 Marker Design**

- **Default Marker:** Custom icon with hospital/medical symbol
- **Desktop Size:** 32px
- **Mobile Size:** 28px (with 44x44px touch area)
- **Active State:** Scale to 1.15x on tap

### **5.5 Cluster Design**

- **Desktop Size:** 40px circle
- **Mobile Size:** 36px circle
- **Color Coding:**
  - 1-10 jobs: Blue (#3b82f6)
  - 11-50 jobs: Orange (#f97316)
  - 51+ jobs: Red (#ef4444)

---

## **6. Edge Cases & Error Handling**

### **6.1 No Jobs in Viewport**

- Display centered message overlay
- "No jobs found in this area"
- "Try zooming out or adjusting filters"
- Action button to zoom out one level

### **6.2 Jobs Without Coordinates**

- Skip jobs with null `geo` field
- Log warning for data quality monitoring
- Don't render markers for these jobs

### **6.3 Location Permission Denied**

- Gracefully fall back to default India view
- Show toast: "Enable location for better results"
- Don't block functionality

### **6.4 Slow Network (Mobile)**

- Show skeleton loader for map
- Progressive loading of markers
- Retry mechanism for failed tile loads
- Timeout after 10 seconds

### **6.5 Drawer State Management**

- Prevent multiple drawers open simultaneously
- Close drawer when switching views
- Preserve scroll position in drawer
- Reset drawer height on close

### **6.6 Filter Application**

- **Mobile:** Apply filters when "Apply" button tapped
- **Desktop:** Apply filters immediately on change
- Show loading indicator during refetch
- Debounce rapid filter changes (300ms)

### **6.7 Browser Compatibility**

- Fallback to list view for unsupported browsers
- Progressive enhancement approach
- Polyfills for older browsers

---

## **7. SEO & Metadata**

### **7.1 Page Metadata**

```typescript
export const metadata: Metadata = {
  title: "Hospital Jobs Map - Find Healthcare Jobs Near You",
  description:
    "Explore hospital and healthcare job opportunities on an interactive map. Find nursing, doctor, and medical staff positions across India.",
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: `${env.NEXT_PUBLIC_URL}/search/map`,
  },
};
```

### **7.2 Structured Data**

- Use existing JobPosting schema
- Add map-specific metadata if needed

---

## **8. Analytics & Tracking**

### **8.1 Events to Track**

- Map view opened
- Filter sidebar opened (mobile)
- Marker clicked
- Cluster expanded
- Drawer opened/closed
- View toggled (list ↔ map)
- Filter applied on map view
- Job applied from map preview drawer
- "View Full Details" clicked from drawer

### **8.2 Metrics**

- Map engagement rate
- Average time on map view
- Jobs viewed via map vs list
- Applications from map view
- Mobile vs desktop usage
- Filter usage patterns
- Drawer interaction rate

---

## **9. Future Enhancements** (Not in Initial Scope)

1. **Heatmap View:** Show job density as a heatmap
2. **Draw Search Area:** Allow users to draw custom search areas
3. **Save Map Searches:** Save map viewport + filters as job alerts
4. **Directions Integration:** "Get Directions" to job location
5. **Street View Integration:** Preview job location area
6. **Commute Time Filter:** Filter by commute time from user location
7. **Multi-Tab Support:** Split view with map and list side-by-side
8. **Offline Support:** Cache map tiles for offline viewing
9. **Augmented Reality:** AR view of jobs around user

---

## **10. Success Metrics**

### **10.1 Adoption Metrics**

- **Target:** 20% of search users try map view within first month
- **Engagement:** Average 2+ minutes on map view
- **Mobile Usage:** 60%+ of map views from mobile devices

### **10.2 Performance Metrics**

- Page load time < 2s (desktop), < 3s (mobile)
- Map interaction latency < 100ms
- Drawer animation 60fps
- 99% uptime

### **10.3 User Experience Metrics**

- Drawer usage rate > 70% on mobile
- Filter application rate similar to list view
- User satisfaction score ≥ 4.5/5

### **10.4 Business Metrics**

- Application rate from map view ≥ list view
- Time to application comparable to list view
- Mobile conversion rate ≥ desktop

---

## **11. Dependencies & Risks**

### **11.1 Dependencies**

- All jobs must have valid `geo` coordinates
- Geocoding service (already exists via `RegionRepo`)
- OpenStreetMap availability
- HeroUI Drawer component support
- Mobile browser geolocation API

### **11.2 Risks**

| Risk                                | Impact | Mitigation                                                         |
| ----------------------------------- | ------ | ------------------------------------------------------------------ |
| Missing geo data for jobs           | High   | Backfill missing coordinates, make geo field required for new jobs |
| Poor performance with 1000+ markers | Medium | Implement clustering and pagination, limit initial markers         |
| OpenStreetMap rate limiting         | Low    | Implement tile caching, consider self-hosting tiles                |
| Mobile performance issues           | Medium | Optimize for mobile, reduce initial marker count, lazy load        |
| Drawer UX issues on some devices    | Medium | Extensive testing on various devices, fallback to modal            |
| Touch gesture conflicts             | Low    | Proper touch-action CSS, test on various devices                   |

---

## **12. Acceptance Criteria**

✅ Map displays on `/search/map` route on all devices
✅ **All filters from list view work on map view**
✅ **Filter sidebar shows on desktop (fixed left)**
✅ **Filter drawer accessible on mobile (swipe from left)**
✅ **Job preview drawer opens on marker click (mobile/tablet)**
✅ **Job popup shows on marker click (desktop)**
✅ **Drawer can be swiped up to expand, down to dismiss**
✅ Jobs render as markers with correct coordinates
✅ Markers cluster when zoomed out
✅ Toggle between map and list view preserves filters
✅ Map is fully responsive (mobile, tablet, desktop)
✅ Touch gestures work smoothly (pan, pinch, tap, swipe)
✅ All touch targets meet 44x44px minimum
✅ Drawer animations run at 60fps
✅ Page load time < 3s on mobile
✅ Works on iOS Safari, Chrome, Android Chrome
✅ Accessibility requirements met (keyboard nav, screen readers)
✅ GraphQL schema updated and regenerated
✅ All tests passing (unit, integration, E2E)

---

## **Appendix A: File Structure**

```
apps/seeker-portal/
├── app/
│   └── search/
│       ├── map/
│       │   ├── page.tsx                    # NEW: Map view page (SSR)
│       │   ├── MapViewClientComponent.tsx  # NEW: Client component with state
│       │   └── loading.tsx                 # NEW: Loading state
│       └── [existing routes...]
├── components/
│   └── search/
│       ├── map/
│       │   ├── JobMapView.tsx             # NEW: Main map with responsive layout
│       │   ├── JobMapMarkers.tsx          # NEW: Markers + clustering
│       │   ├── JobMapPopup.tsx            # NEW: Desktop popup
│       │   ├── JobPreviewDrawer.tsx       # NEW: Bottom drawer (mobile/tablet)
│       │   ├── MapFilterSidebar.tsx       # NEW: Reusable filter component
│       │   ├── JobMapControls.tsx         # NEW: Touch-optimized controls
│       │   ├── JobMapSkeleton.tsx         # NEW: Loading skeleton
│       │   └── MapViewToggle.tsx          # NEW: View toggle button
│       ├── FilterSidebar.tsx              # REFERENCE: Use logic here
│       └── [existing components...]
├── lib/
│   ├── hooks/
│   │   └── useMediaQuery.ts               # NEW: Responsive hook
│   └── links.ts                            # UPDATE: Add searchMap()
└── globals.css                             # UPDATE: Add marker/drawer styles

server/
├── app/
│   ├── base/
│   │   ├── models.py                      # UPDATE: Add BoundingBox
│   │   └── types.py                       # UPDATE: Add GeoObjectType
│   └── jobs/
│       ├── query.py                       # UPDATE: Add bounds param
│       ├── repositories.py                # UPDATE: Add bounds filtering
│       ├── types.py                       # UPDATE: Add BoundingBoxInput
│       └── documents.py                   # VERIFY: geo index exists
└── schema/
    └── schema.graphql                     # REGENERATE: After changes
```

---

## **Appendix B: Mobile Hook Implementation**

```typescript
// lib/hooks/useMediaQuery.ts
import { useEffect, useState } from "react";

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    const listener = () => setMatches(media.matches);
    media.addEventListener("change", listener);

    return () => media.removeEventListener("change", listener);
  }, [matches, query]);

  return matches;
}
```

---

## **Appendix C: Estimated Timeline**

| Phase                         | Duration       | Description                                    |
| ----------------------------- | -------------- | ---------------------------------------------- |
| Phase 1: Backend Foundation   | 2-3 days       | GraphQL schema, repository updates, DB indexes |
| Phase 2: Frontend Setup       | 1 day          | Dependencies, route structure, directories     |
| Phase 3: Core Map Components  | 4-5 days       | Map, markers, drawer, popup, controls          |
| Phase 4: GraphQL Integration  | 2 days         | Fragments, queries, data fetching              |
| Phase 5: Mobile & Responsive  | 3-4 days       | Mobile/tablet/desktop layouts, touch gestures  |
| Phase 6: Filter Integration   | 2-3 days       | All filters, state sync, mobile drawer         |
| Phase 7: Integration & Nav    | 1-2 days       | Navigation, sitemap, links                     |
| Phase 8: Testing & Deployment | 3-4 days       | All testing, deployment                        |
| **Total**                     | **18-24 days** | **3-4 weeks for single developer**             |

---

**This PRD now includes:**

1. ✅ **Complete filter sidebar support** (desktop & mobile)
2. ✅ **Bottom drawer for job previews** (mobile/tablet)
3. ✅ **Comprehensive mobile responsiveness** with touch optimizations
4. ✅ **Detailed component implementations** with code examples
5. ✅ **Touch gesture support** (pan, pinch, tap, swipe)
6. ✅ **Performance targets** specific to mobile
7. ✅ **Accessibility considerations** for touch interfaces
8. ✅ **Complete implementation steps** with timeline

The feature will provide a seamless, mobile-first experience across all devices with full feature parity to the list view!
