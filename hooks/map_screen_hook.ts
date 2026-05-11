import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { RefObject } from 'react';
import MapView from 'react-native-maps';
import { router } from 'expo-router';
import { useFeedStore } from '@/store/feed_store';
import { useLocation } from '@/hooks/location_hook';
import { haversineKm } from '@/lib/geo_utils';
import { MAP_NEARBY_RADIUS_KM, MAP_DEFAULT_DELTA } from '@/constants/map_config';
import type { Place } from '@/types';

export function useMapScreen() {
  const { places, isLoading, fetchPlaces } = useFeedStore();
  const { location, isLoading: locationLoading } = useLocation();
  const mapRef = useRef<MapView>(null);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  useEffect(() => {
    fetchPlaces();
  }, []);

  // Animate camera to user's location when it becomes available
  useEffect(() => {
    if (location && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: MAP_DEFAULT_DELTA,
          longitudeDelta: MAP_DEFAULT_DELTA,
        },
        800
      );
    }
  }, [location]);

  // Badge count: only spots within nearby radius
  const nearbyCount = useMemo(() => {
    if (!location) return places.length;
    return places.filter((p) =>
      haversineKm(
        location.coords.latitude,
        location.coords.longitude,
        p.latitude,
        p.longitude
      ) <= MAP_NEARBY_RADIUS_KM
    ).length;
  }, [places, location]);

  const handleLocateMe = useCallback(() => {
    if (location && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: MAP_DEFAULT_DELTA,
          longitudeDelta: MAP_DEFAULT_DELTA,
        },
        600
      );
    }
  }, [location]);

  const handleMarkerPress = useCallback((place: Place) => {
    setSelectedPlace(place);
    // Pan camera up so the pin is visible below the popup
    if (mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: place.latitude + 0.01,
          longitude: place.longitude,
          latitudeDelta: MAP_DEFAULT_DELTA,
          longitudeDelta: MAP_DEFAULT_DELTA,
        },
        500
      );
    }
  }, []);

  const handleCalloutClose = useCallback(() => {
    setSelectedPlace(null);
  }, []);

  const handleSpotPress = useCallback((place: Place) => {
    setSelectedPlace(null);
    router.push(`/detail/${place.id}` as any);
  }, []);

  // Snap map back to north-up orientation
  const handleNorthUp = useCallback(() => {
    mapRef.current?.animateCamera({ heading: 0 }, { duration: 400 });
  }, []);

  return {
    mapRef,
    places,
    nearbyCount,
    selectedPlace,
    isLoading,
    locationLoading,
    isAnyLoading: isLoading || locationLoading,
    handleLocateMe,
    handleNorthUp,
    handleMarkerPress,
    handleCalloutClose,
    handleSpotPress,
  };
}
