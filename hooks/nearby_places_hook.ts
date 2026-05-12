import { useMemo } from 'react';
import type { Place, FeedFilters } from '@/types';
import type { LocationObject } from 'expo-location';
import { haversineKm } from '@/lib/geo_utils';
import { MAP_NEARBY_RADIUS_KM } from '@/constants/map_config';



export interface PlaceWithDistance extends Place {
  distance?: number;
}

export function useNearbyPlaces(
  places: Place[],
  filters: FeedFilters,
  userLocation: LocationObject | null
) {
  return useMemo(() => {
    let result: PlaceWithDistance[] = [...places];

    // Calculate distance for all places when location is available
    if (userLocation) {
      result = result.map((place) => ({
        ...place,
        distance: haversineKm(
          userLocation.coords.latitude,
          userLocation.coords.longitude,
          place.latitude,
          place.longitude
        ),
      }));

      // Auto-filter to 5km radius
      if (!filters.showAllDistances) {
        result = result.filter((p) => (p.distance ?? Infinity) <= MAP_NEARBY_RADIUS_KM);
      }

      result.sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity));
    }

    // Multi-category filter
    if (filters.categories.length > 0) {
      result = result.filter((place) =>
        place.categories.some((c) => filters.categories.includes(c))
      );
    }

    return result;
  }, [places, filters, userLocation]);
}
