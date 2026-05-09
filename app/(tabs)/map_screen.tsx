import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { router } from 'expo-router';
import { Locate, MapPin } from 'lucide-react-native';
import { Colors } from '@/styles/theme';
import { styles } from '@/styles/screens/map_screen.styles';
import { useFeedStore } from '@/store/feed_store';
import { useLocation } from '@/hooks/location_hook';
import { SpotCallout } from '@/components/SpotCallout';
import { useTranslation } from '@/hooks/useTranslation';
import type { Place } from '@/types';

// DEFAULT MAP REGION — centers on Legazpi City, Albay (project's target area)
const DEFAULT_REGION = {
  latitude: 13.1391,
  longitude: 123.7438,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

// HIDE GOOGLE MAPS BUILT-IN POI PINS — only KainTayo spots should appear
const MAP_STYLE = [
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
];

const NEARBY_RADIUS_KM = 5;

// Haversine distance in km
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const toRad = (d: number) => d * (Math.PI / 180);
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function MapScreen() {
  const { t } = useTranslation();
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
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        },
        800
      );
    }
  }, [location]);

  // Badge count: only spots within 5km radius (same as home screen)
  const nearbyCount = useMemo(() => {
    if (!location) return places.length;
    return places.filter((p) =>
      calculateDistance(
        location.coords.latitude,
        location.coords.longitude,
        p.latitude,
        p.longitude
      ) <= NEARBY_RADIUS_KM
    ).length;
  }, [places, location]);

  const handleLocateMe = useCallback(() => {
    if (location && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
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
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
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

  const isAnyLoading = isLoading || locationLoading;

  return (
    <View style={styles.container}>
      {/* FULL SCREEN MAP */}
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={DEFAULT_REGION}
        customMapStyle={MAP_STYLE}
        showsUserLocation
        showsMyLocationButton={false}
        showsCompass
        showsScale
        mapType="standard"
      >
        {/* ALL SPOT PINS — all places shown regardless of distance */}
        {places.map((place) => (
          <Marker
            key={place.id}
            identifier={place.id}
            coordinate={{
              latitude: place.latitude,
              longitude: place.longitude,
            }}
            onPress={() => handleMarkerPress(place)}
            tracksViewChanges={false}
            anchor={{ x: 0.5, y: 1 }}
          >
            <View style={pinStyles.wrapper}>
              <MapPin size={32} color={Colors.primary} strokeWidth={2} />
            </View>
          </Marker>
        ))}
      </MapView>

      {/* HEADER OVERLAY */}
      <SafeAreaView style={styles.headerOverlay} edges={['top']} pointerEvents="box-none">
        <Text style={styles.heading}>{t.mapScreen.title}</Text>
        <Text style={styles.subheading}>{t.mapScreen.subtitle}</Text>
      </SafeAreaView>

      {/* MY LOCATION BUTTON */}
      <TouchableOpacity
        style={styles.locationButton}
        onPress={handleLocateMe}
        activeOpacity={0.8}
      >
        <Locate size={22} color={Colors.primary} strokeWidth={2} />
      </TouchableOpacity>

      {/* LOADING / SPOT COUNT BADGE — nearby count only */}
      {isAnyLoading ? (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="small" color={Colors.primary} />
          <Text style={styles.loadingText}>
            {locationLoading ? t.mapScreen.loadingLocation : t.mapScreen.loadingSpots}
          </Text>
        </View>
      ) : (
        <View style={styles.countBadge}>
          <Text style={styles.countBadgeText}>
            {t.mapScreen.spotsCount(nearbyCount)}
          </Text>
        </View>
      )}

      {/* SPOT DETAIL POPUP — centered Modal, dismisses on backdrop tap */}
      <SpotCallout
        place={selectedPlace}
        onPress={handleSpotPress}
        onClose={handleCalloutClose}
      />
    </View>
  );
}

// PIN MARKER STYLES — colocated per DEV_GUIDE (screen-level, not reusable)
const pinStyles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
  },
});
