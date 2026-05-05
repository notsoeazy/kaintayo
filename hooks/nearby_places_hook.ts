import { useMemo } from 'react';
import type { Place, FeedFilters } from '@/types';
import type { LocationObject } from 'expo-location';

// Haversine formula to calculate distance between two coordinates in km
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
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
    let filteredPlaces: PlaceWithDistance[] = [...places];

    // 1. Calculate distances if location is available
    if (userLocation) {
      filteredPlaces = filteredPlaces.map(place => ({
        ...place,
        distance: calculateDistance(
          userLocation.coords.latitude,
          userLocation.coords.longitude,
          place.latitude,
          place.longitude
        )
      }));
    }

    // 2. Filter by category
    if (filters.category) {
      filteredPlaces = filteredPlaces.filter(place => place.category === filters.category);
    }

    // 3. Sort by distance if nearMe is active and location is available
    if (filters.nearMe && userLocation) {
      filteredPlaces.sort((a, b) => {
        if (a.distance === undefined) return 1;
        if (b.distance === undefined) return -1;
        return a.distance - b.distance;
      });
    }

    return filteredPlaces;
  }, [places, filters, userLocation]);
}
