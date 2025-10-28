#!/usr/bin/env python3
"""Debug script to understand H3 clustering issue."""

import h3


def test_h3_intersections():
    """Test H3 intersection calculations."""
    # Bangalore bounding box (from test)
    bounds = {
        "sw_lat": 12.85,
        "sw_lng": 77.55,
        "ne_lat": 13.05,
        "ne_lng": 77.70,
    }

    # Create polygon from bounding box
    bbox_polygon = [
        [bounds["sw_lng"], bounds["sw_lat"]],
        [bounds["ne_lng"], bounds["sw_lat"]],
        [bounds["ne_lng"], bounds["ne_lat"]],
        [bounds["sw_lng"], bounds["ne_lat"]],
        [bounds["sw_lng"], bounds["sw_lat"]],  # Close the polygon
    ]

    # Create GeoJSON polygon
    geojson_polygon = {
        "type": "Polygon",
        "coordinates": [bbox_polygon],
    }

    print("Testing H3 intersections for Bangalore area:")
    print(f"Bounds: {bounds}")
    print(f"GeoJSON Polygon: {geojson_polygon}")
    print()

    # Test different resolutions
    for resolution in [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]:
        try:
            intersecting_hexes = list(h3.geo_to_cells(geojson_polygon, res=resolution))
            print(f"Resolution {resolution}: {len(intersecting_hexes)} hexes")
            if len(intersecting_hexes) > 0 and len(intersecting_hexes) <= 5:
                print(f"  First few hexes: {intersecting_hexes[:5]}")
        except Exception as e:
            print(f"Resolution {resolution}: ERROR - {e}")

    print()
    # Test with coordinates around Bangalore center
    bangalore_center = (12.9716, 77.5946)  # lat, lng
    print(f"Testing H3 indexing for Bangalore center: {bangalore_center}")

    for resolution in [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]:
        try:
            h3_index = h3.latlng_to_cell(
                bangalore_center[0], bangalore_center[1], resolution
            )
            print(f"Resolution {resolution}: {h3_index}")
        except Exception as e:
            print(f"Resolution {resolution}: ERROR - {e}")


if __name__ == "__main__":
    test_h3_intersections()
