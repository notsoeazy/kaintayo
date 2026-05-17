import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Coffee, Plus } from 'lucide-react-native';
import { Colors } from '@/styles/theme';
import { styles } from '@/styles/screens/home_screen.styles';
import { useFeedStore } from '@/store/feed_store';
import { useLocation } from '@/hooks/location_hook';
import { useNearbyPlaces } from '@/hooks/nearby_places_hook';
import { FilterBar } from '@/components/FilterBar';
import { FoodCard } from '@/components/FoodCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { KButton } from '@/components/ui/KButton';
import { useTranslation } from '@/hooks/useTranslation';

export default function HomeScreen() {
  const { places, filters, isLoading, fetchPlaces } = useFeedStore();
  const { location } = useLocation();
  const { t } = useTranslation();
  const [refreshing, setRefreshing] = useState(false);

  const filteredPlaces = useNearbyPlaces(places, filters, location);

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
        <Text style={styles.heading}>{t.home.title}</Text>
      </View>
      
      <FilterBar containerStyle={{ marginBottom: 16 }} />

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

    </SafeAreaView>
  );
}
