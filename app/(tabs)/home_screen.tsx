import React from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
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

export default function HomeScreen() {
  const { places, filters, isLoading } = useFeedStore();
  const { location } = useLocation();

  const filteredPlaces = useNearbyPlaces(places, filters, location);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.headerContainer}>
        <Text style={styles.heading}>Saan tayo kakain?</Text>
      </View>
      
      <FilterBar containerStyle={{ marginBottom: 16 }} />

      {isLoading ? (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <FlatList
          data={filteredPlaces}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[styles.listContent, { flexGrow: 1 }]}
          renderItem={({ item }) => (
            <FoodCard 
              place={item} 
              distance={item.distance} 
              onPress={(place) => router.push(`/detail/${place.id}` as any)} 
            />
          )}
          ListEmptyComponent={
            <EmptyState
              icon={<Coffee size={64} color={Colors.muted} strokeWidth={1.5} />}
              title="Wala pang listings dito"
              description="Maging lodi! Ikaw ang unang mag-add ng paborito mong kainan para dito."
              action={
                <KButton 
                  title="Mag-add ka!" 
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

      {/* Floating Action Button */}
      <TouchableOpacity 
        style={styles.fab} 
        activeOpacity={0.8}
        onPress={() => router.push('/add_spot_screen')}
      >
        <FontAwesome name="plus" size={24} color={Colors.text} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
