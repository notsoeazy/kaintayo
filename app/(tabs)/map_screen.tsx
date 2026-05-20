import { SpotCallout } from '@/components/SpotCallout';
import { FilterModal } from '@/components/ui/FilterModal';
import { MAP_DEFAULT_REGION, MAP_STYLE } from '@/constants/map_config';
import { useMapScreen } from '@/hooks/map_screen_hook';
import { useTranslation } from '@/hooks/useTranslation';
import { styles } from '@/styles/screens/map_screen.styles';
import { Colors } from '@/styles/theme';
import { Compass, Locate, MapPin, SlidersHorizontal } from 'lucide-react-native';
import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MapScreen() {
  const { t } = useTranslation();
  const [filterVisible, setFilterVisible] = useState(false);
  const {
    mapRef,
    places,
    nearbyCount,
    selectedPlace,
    hasActiveFilters,
    isAnyLoading,
    locationLoading,
    handleLocateMe,
    handleNorthUp,
    handleMarkerPress,
    handleCalloutClose,
    handleSpotPress,
  } = useMapScreen();

  return (
    <View style={styles.container}>
      {/* FULL SCREEN MAP */}
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={MAP_DEFAULT_REGION}
        customMapStyle={MAP_STYLE}
        showsUserLocation={true}
        showsMyLocationButton={false}
        showsCompass={false}
        showsScale
        mapType="standard"
      >
        {/* ALL SPOT PINS */}
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

      {/* HEADER */}
      <SafeAreaView style={styles.headerOverlay} edges={['top']}>
        <View style={styles.headerRow}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.title}>{t.mapScreen.title}</Text>
            <Text style={styles.subtitle} numberOfLines={1}>
              {locationLoading
                ? t.mapScreen.loadingLocation
                : isAnyLoading
                ? t.mapScreen.loadingSpots
                : t.mapScreen.subtitle}
            </Text>
          </View>

          {!isAnyLoading && (
            <View style={styles.spotCountPill}>
              <MapPin size={14} color={Colors.text} strokeWidth={2.5} style={styles.pillIcon} />
              <Text style={styles.spotCountText}>{t.mapScreen.spotsCount(nearbyCount)}</Text>
            </View>
          )}
          {isAnyLoading && (
            <ActivityIndicator size="small" color={Colors.primary} style={styles.headerLoader} />
          )}
        </View>
      </SafeAreaView>

      {/* MY LOCATION BUTTON */}
      <TouchableOpacity
        style={styles.locationButton}
        onPress={handleLocateMe}
        activeOpacity={0.8}
      >
        <Locate size={22} color={Colors.primary} strokeWidth={2} />
      </TouchableOpacity>

      {/* COMPASS BUTTON */}
      <TouchableOpacity
        style={styles.compassButton}
        onPress={handleNorthUp}
        activeOpacity={0.8}
      >
        <Compass size={22} color={Colors.primary} strokeWidth={2} />
      </TouchableOpacity>

      {/* FILTER FAB */}
      <TouchableOpacity
        style={[styles.filterFab, hasActiveFilters && styles.filterFabActive]}
        onPress={() => setFilterVisible(true)}
        activeOpacity={0.85}
      >
        <SlidersHorizontal
          size={16}
          color={hasActiveFilters ? Colors.bg : Colors.text}
          strokeWidth={2}
        />
        <Text style={[styles.filterFabLabel, hasActiveFilters && styles.filterFabLabelActive]}>
          {t.mapScreen.filterFab}
        </Text>
      </TouchableOpacity>

      {/* FILTER BOTTOM SHEET */}
      <FilterModal
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
      />

      {/* SPOT DETAIL POPUP */}
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
