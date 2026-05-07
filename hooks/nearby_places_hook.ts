import { useMemo } from 'react';
import type { Place, FeedFilters } from '@/types';
import type { LocationObject } from 'expo-location';

const NEARBY_RADIUS_KM = 5;

// Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

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
        distance: calculateDistance(
          userLocation.coords.latitude,
          userLocation.coords.longitude,
          place.latitude,
          place.longitude
        ),
      }));

      // Auto-filter to 5km radius
      if (!filters.showAllDistances) {
        result = result.filter((p) => (p.distance ?? Infinity) <= NEARBY_RADIUS_KM);
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
