/*
Usage:
<LocationMap
  latitude={place.latitude}
  longitude={place.longitude}
  googleMapsUrl={place.googleMapsUrl}
  address={place.address}
/>
*/

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Linking, StyleSheet } from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import { Navigation, MapPin, WifiOff } from 'lucide-react-native';
import { Colors, FontFamily, FontSize, Radius, Spacing } from '@/styles/theme';
import { useTranslation } from '@/hooks/useTranslation';

const MAP_HEIGHT = 200;
const DELTA = 0.006;

interface LocationMapProps {
  latitude: number;
  longitude: number;
  googleMapsUrl: string;
  address?: string;
}

export const LocationMap = React.memo(function LocationMap({
  latitude,
  longitude,
  googleMapsUrl,
  address,
}: LocationMapProps) {
  const { t } = useTranslation();
  const [mapError, setMapError] = useState(false);

  const handleDirections = () => Linking.openURL(googleMapsUrl);

  return (
    <View style={styles.container}>
      {/* SECTION HEADER */}
      <View style={styles.header}>
        <MapPin size={14} color={Colors.muted} strokeWidth={2} />
        <Text style={styles.sectionLabel}>{t.detailScreen.locationLabel}</Text>
      </View>

      {/* MAP */}
      {mapError ? (
        <View style={styles.offlineCard}>
          <WifiOff size={24} color={Colors.muted} strokeWidth={1.5} />
          <Text style={styles.offlineTitle}>{t.detailScreen.offlineMapTitle}</Text>
          <Text style={styles.offlineHint}>{t.detailScreen.offlineMapHint}</Text>
          {address ? (
            <Text style={styles.offlineAddress}>{address}</Text>
          ) : null}
        </View>
      ) : (
        <View style={styles.mapWrapper}>
          <MapView
            style={styles.map}
            provider={PROVIDER_DEFAULT}
            initialRegion={{
              latitude,
              longitude,
              latitudeDelta: DELTA,
              longitudeDelta: DELTA,
            }}
            scrollEnabled={false}
            zoomEnabled={false}
            rotateEnabled={false}
            pitchEnabled={false}
            onMapLoaded={() => setMapError(false)}
          >
            <Marker
              coordinate={{ latitude, longitude }}
              pinColor={Colors.primary}
            />
          </MapView>
        </View>
      )}

      {/* ADDRESS TEXT */}
      {address ? (
        <Text style={styles.address}>{address}</Text>
      ) : null}

      {/* GET DIRECTIONS BUTTON */}
      <TouchableOpacity
        style={styles.directionsButton}
        onPress={handleDirections}
        activeOpacity={0.8}
      >
        <Navigation size={16} color={Colors.text} strokeWidth={2} />
        <Text style={styles.directionsLabel}>{t.detailScreen.directionsButton}</Text>
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: Spacing.sm,
  },
  sectionLabel: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.xs,
    color: Colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  mapWrapper: {
    borderRadius: Radius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.sm,
  },
  map: {
    width: '100%',
    height: MAP_HEIGHT,
  },
  offlineCard: {
    height: MAP_HEIGHT,
    backgroundColor: Colors.linen,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  offlineTitle: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.sm,
    color: Colors.text,
    marginTop: Spacing.xs,
  },
  offlineHint: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.xs,
    color: Colors.muted,
  },
  offlineAddress: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.sm,
    color: Colors.muted,
    marginTop: Spacing.xs,
  },
  address: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.sm,
    color: Colors.muted,
    marginBottom: Spacing.md,
  },
  directionsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    paddingVertical: Spacing.sm + 2,
    marginBottom: Spacing.sm,
  },
  directionsLabel: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.md,
    color: Colors.text,
  },
});
