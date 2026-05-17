import { useMemo } from 'react';
import type { Place, FeedFilters } from '@/types';
import type { LocationObject } from 'expo-location';
import { haversineKm } from '@/lib/geo_utils';

export interface PlaceWithDistance extends Place {
  distance?: number;
}

export function filterPlaces(
  places: Place[],
  filters: FeedFilters,
  userLocation: { latitude: number; longitude: number } | null
): PlaceWithDistance[] {
  let result: PlaceWithDistance[] = places.map((place) => {
    if (!userLocation) return { ...place };
    return {
      ...place,
      distance: haversineKm(
        userLocation.latitude,
        userLocation.longitude,
        place.latitude,
        place.longitude
      ),
    };
  });

  const maxDist = filters.maxDistance ?? null;
  if (userLocation && maxDist !== null) {
    result = result.filter((p) => (p.distance ?? Infinity) <= maxDist);
  }

  if (userLocation) {
    result.sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity));
  }

  if (filters.categories.length > 0) {
    result = result.filter((place) =>
      place.categories.some((c) => filters.categories.includes(c))
    );
  }

  if (filters.priceTier !== null) {
    result = result.filter((place) => place.priceTier === filters.priceTier);
  }

  return result;
}

export function useNearbyPlaces(
  places: Place[],
  filters: FeedFilters,
  userLocation: LocationObject | null
) {
  return useMemo(() => {
    const coords = userLocation
      ? { latitude: userLocation.coords.latitude, longitude: userLocation.coords.longitude }
      : null;
    return filterPlaces(places, filters, coords);
  }, [places, filters, userLocation]);
}
