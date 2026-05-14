import { router } from 'expo-router';
import type { Place } from '@/types';

export function useDetailsNavigation() {
  const openDetails = (placeId: string) => {
    router.push(`/detail/${placeId}`);
  };

  const openDetailsForPlace = (place: Place) => {
    router.push(`/detail/${place.id}`);
  };

  return { openDetails, openDetailsForPlace };
}
