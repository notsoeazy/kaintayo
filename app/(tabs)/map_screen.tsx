import React, { useState } from 'react';
import { ActivityIndicator, Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Compass, Locate, MapPin, SlidersHorizontal } from 'lucide-react-native';
import { Colors } from '@/styles/theme';
import { styles } from '@/styles/screens/map_screen.styles';
import { SpotCallout } from '@/components/SpotCallout';
import { useTranslation } from '@/hooks/useTranslation';
import { useMapScreen } from '@/hooks/map_screen_hook';
import { MAP_DEFAULT_REGION, MAP_STYLE } from '@/constants/map_config';

export default function MapScreen() {
  const { t } = useTranslation();
  const [filterVisible, setFilterVisible] = useState(false);
  const {
    mapRef,
    places,
    nearbyCount,
    selectedPlace,
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
          <Text style={styles.heading}>{t.mapScreen.title}</Text>
          {/* TODO: nearbyCount uses the 5km radius rule from home screen — should instead
              count spots currently visible within the map viewport using onRegionChange */}
          {!isAnyLoading && (
            <View style={styles.spotCountPill}>
              <Text style={styles.spotCountText}>{nearbyCount}</Text>
            </View>
          )}
        </View>
        {isAnyLoading ? (
          <View style={styles.headerLoadingRow}>
            <ActivityIndicator size="small" color={Colors.primary} />
            <Text style={styles.headerLoadingText}>
              {locationLoading ? t.mapScreen.loadingLocation : t.mapScreen.loadingSpots}
            </Text>
          </View>
        ) : (
          <Text style={styles.subheading}>{t.mapScreen.subtitle}</Text>
        )}
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
        style={styles.filterFab}
        onPress={() => setFilterVisible(true)}
        activeOpacity={0.85}
      >
        <SlidersHorizontal size={16} color={Colors.text} strokeWidth={2} />
        <Text style={styles.filterFabLabel}>{t.mapScreen.filterFab}</Text>
      </TouchableOpacity>

      {/* FILTER BOTTOM SHEET — placeholder, not implemented */}
      <Modal
        visible={filterVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setFilterVisible(false)}
      >
        <Pressable style={styles.bottomSheetBackdrop} onPress={() => setFilterVisible(false)}>
          <Pressable style={styles.bottomSheet} onPress={() => {}}>
            <View style={styles.bottomSheetHandle} />
            <Text style={styles.bottomSheetTitle}>{t.mapScreen.filterModalTitle}</Text>
            {/* TODO: implement map filter — filter visible pins by category and price range */}
            <View style={styles.bottomSheetPlaceholder}>
              <SlidersHorizontal size={32} color={Colors.border} strokeWidth={1.5} />
              <Text style={styles.bottomSheetComingSoonText}>{t.mapScreen.filterComingSoon}</Text>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

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
