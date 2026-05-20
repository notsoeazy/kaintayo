import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, RefreshControl, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Coffee, Plus } from 'lucide-react-native';
import { Colors } from '@/styles/theme';
import { styles } from '@/styles/screens/home_screen.styles';
import { useFeedStore } from '@/store/feed_store';
import { useLocation } from '@/hooks/location_hook';
import { useNearbyPlaces } from '@/hooks/nearby_places_hook';
import { EmptyState } from '@/components/ui/EmptyState';
import { FoodCard } from '@/components/FoodCard';
import { KButton } from '@/components/ui/KButton';
import { SearchBar } from '@/components/ui/SearchBar';
import { FilterModal } from '@/components/ui/FilterModal';
import { useTranslation } from '@/hooks/useTranslation';
import { SlidersHorizontal } from 'lucide-react-native';

export default function HomeScreen() {
  const { places, filters, isLoading, fetchPlaces } = useFeedStore();
  const { location } = useLocation();
  const { t } = useTranslation();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);

  const hasActiveFilters = filters.categories.length > 0 || filters.priceTier !== null || filters.maxDistance !== 5;

  const baseFilteredPlaces = useNearbyPlaces(places, filters, location);

  const filteredPlaces = baseFilteredPlaces.filter(place => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      place.name?.toLowerCase().includes(query) ||
      place.categories?.some((c: string) => c.toLowerCase().includes(query)) ||
      place.description?.toLowerCase().includes(query)
    );
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Magandang Umaga! ☀️";
    if (hour < 18) return "Magandang Hapon! 🌤️";
    return "Magandang Gabi! 🌙";
  };

  useEffect(() => {
    fetchPlaces();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchPlaces();
    setRefreshing(false);
  }, [fetchPlaces]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.headerContainer}>
        <Text style={styles.greetingText}>{getGreeting()}</Text>
        <Text style={styles.heading}>{t.home.title}</Text>
        <View style={styles.searchRow}>
          <View style={styles.searchBarWrapper}>
            <SearchBar 
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder={t.home.searchPlaceholder}
            />
          </View>
          <TouchableOpacity 
            style={[styles.filterButton, hasActiveFilters && styles.filterButtonActive]}
            onPress={() => setIsFilterModalVisible(true)}
            activeOpacity={0.7}
          >
            <SlidersHorizontal size={20} color={hasActiveFilters ? Colors.bg : Colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      {isLoading && !refreshing ? (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <FlatList
          data={filteredPlaces}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[styles.listContent, { flexGrow: 1 }]}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={Colors.primary}
              colors={[Colors.primary]}
            />
          }
          renderItem={({ item }) => (
            <FoodCard
              place={item}
              distance={item.distance}
            />
          )}
          ListEmptyComponent={
            <EmptyState
              icon={<Coffee size={64} color={Colors.muted} strokeWidth={1.5} />}
              title={t.home.emptyStateTitle}
              description={t.home.emptyStateDesc}
              action={
                <KButton 
                  title={t.home.emptyStateAction} 
                  onPress={() => router.push('/add_spot_screen')} 
                  variant="danger"
                  size="lg"
                  icon={ <Plus/> }
                />
              }
            />
          }
        />
      )}

      <FilterModal 
        visible={isFilterModalVisible}
        onClose={() => setIsFilterModalVisible(false)}
      />
    </SafeAreaView>
  );
}
