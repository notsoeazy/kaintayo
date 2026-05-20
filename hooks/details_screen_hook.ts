import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useAuthStore } from '@/store/auth_store';
import { useListStore } from '@/store/list_store';
import { useFeedStore } from '@/store/feed_store';
import { useTranslation } from '@/hooks/useTranslation';
import {
  getPlaceById,
  getPlacePhotos,
  addPlacePhoto,
  votePriceTier,
  removePriceVote,
  getUserPriceVote,
  getPriceVoteTally,
} from '@/lib/firestore_service';
import { uploadPlacePhoto } from '@/lib/firebase_storage_service';
import { PRICE_TIERS } from '@/constants/price_ranges';
import type { Place, PriceTier } from '@/types';

export function useDetailScreen(placeId: string) {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const { wishlistIds, triedIds, toggleWishlist, toggleTried } = useListStore();
  const updatePlace = useFeedStore((state) => state.updatePlace);

  const [place, setPlace] = useState<Place | null>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const [voteTally, setVoteTally] = useState<Record<PriceTier, number>>({
    'very-budget': 0,
    affordable: 0,
    moderate: 0,
    expensive: 0,
  });
  const [userVote, setUserVote] = useState<PriceTier | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isVoting, setIsVoting] = useState(false);

  // FETCH
  useEffect(() => {
    let active = true;
    (async () => {
      setIsLoading(true);
      try {
        const fetchPromises: [Promise<Place | null>, Promise<string[]>, Promise<Record<PriceTier, number>>] = [
          getPlaceById(placeId),
          getPlacePhotos(placeId),
          getPriceVoteTally(placeId),
        ];
        const [fetchedPlace, fetchedPhotos, tally] = await Promise.all(fetchPromises);
        if (!active) return;
        if (fetchedPlace) setPlace(fetchedPlace);
        setPhotos(fetchedPhotos);
        setVoteTally(tally);

        // Fetch the existing vote
        if (user && fetchedPlace) {
          const existingVote = await getUserPriceVote(placeId, user.uid);
          if (active) setUserVote(existingVote);
        }
      } catch (err) {
        console.error('[details_screen_hook] Fetch failed:', err);
      } finally {
        if (active) setIsLoading(false);
      }
    })();
    return () => { active = false; };
  }, [placeId, user?.uid]);

  // PHOTO UPLOAD
  const launchPicker = useCallback(async (source: 'camera' | 'gallery') => {
    if (!user) return;

    let result: ImagePicker.ImagePickerResult;
    if (source === 'camera') {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(t.addSpot.permissionDenied, t.addSpot.cameraPermissionMsg);
        return;
      }
      result = await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [4, 3], quality: 0.8 });
    } else {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(t.addSpot.permissionDenied, t.addSpot.galleryPermissionMsg);
        return;
      }
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
    }

    if (result.canceled) return;

    setIsUploadingPhoto(true);
    try {
      const url = await uploadPlacePhoto(result.assets[0].uri, placeId, user.uid);
      await addPlacePhoto(placeId, url, user.uid);
      setPhotos((prev) => [url, ...prev]);
    } catch {
      Alert.alert(t.addSpot.errorTitle, t.detailScreen.uploadFailed);
    } finally {
      setIsUploadingPhoto(false);
    }
  }, [user, placeId]);

  const handleAddPhoto = useCallback(() => {
    if (!user) {
      Alert.alert(t.detailScreen.signInToPhoto);
      return;
    }
    Alert.alert(t.detailScreen.addPhotoTitle, t.detailScreen.addPhotoSource, [
      { text: t.detailScreen.cameraOption, onPress: () => launchPicker('camera') },
      { text: t.detailScreen.galleryOption, onPress: () => launchPicker('gallery') },
      { text: t.detailScreen.cancel, style: 'cancel' },
    ]);
  }, [user, launchPicker, t]);

  // PRICE VOTE
  const handleVote = useCallback(async (tier: PriceTier) => {
    if (!user || isVoting) return;
    setIsVoting(true);
    const prevVote = userVote;
    const prevTally = { ...voteTally };

    // Toggling: If clicking the same tier, remove it
    const isUnvoting = prevVote === tier;

    // Optimistic update
    const nextTally = { ...voteTally };
    if (prevVote) nextTally[prevVote] = Math.max(0, nextTally[prevVote] - 1);
    
    if (isUnvoting) {
      setUserVote(null);
    } else {
      nextTally[tier]++;
      setUserVote(tier);
    }
    setVoteTally(nextTally);

    try {
      if (isUnvoting) {
        await removePriceVote(placeId, user.uid);
      } else {
        await votePriceTier(placeId, user.uid, tier);
      }
      // Refresh from server to get accurate count
      const tally = await getPriceVoteTally(placeId);
      setVoteTally(tally);

      // Fetch updated place to sync consensus
      const updatedPlace = await getPlaceById(placeId);
      if (updatedPlace) {
        setPlace(updatedPlace);
        updatePlace(placeId, {
          communityPriceTier: updatedPlace.communityPriceTier,
          totalVotes: updatedPlace.totalVotes,
        });
      }
    } catch {
      // Rollback on error
      setUserVote(prevVote);
      setVoteTally(prevTally);
    } finally {
      setIsVoting(false);
    }
  }, [user, placeId, isVoting, userVote, voteTally, updatePlace]);

  const isWishlisted = wishlistIds.includes(placeId);
  const isTried = triedIds.includes(placeId);
  const canVote = !!user && isTried;

  const handleWishlist = useCallback(() => {
    if (user) toggleWishlist(user.uid, placeId);
  }, [user, placeId, toggleWishlist]);

  const handleTried = useCallback(async () => {
    if (!user) return;
    
    const wasTried = triedIds.includes(placeId);
    
    // Toggle the tried state
    await toggleTried(user.uid, placeId);

    // If it was tried and is now NOT tried, and user has a vote, remove the vote
    if (wasTried && userVote) {
      await handleVote(userVote);
    }
  }, [user, placeId, triedIds, userVote, toggleTried, handleVote]);

  return {
    place,
    photos,
    voteTally,
    userVote,
    isLoading,
    isUploadingPhoto,
    isVoting,
    isWishlisted,
    isTried,
    canVote,
    PRICE_TIERS,
    handleAddPhoto,
    handleVote,
    handleWishlist,
    handleTried,
  };
}

export function useDetailsNavigation() {
  const openDetails = (placeId: string) => {
    router.push(`/detail/${placeId}`);
  };

  const openDetailsForPlace = (place: Place) => {
    router.push(`/detail/${place.id}`);
  };

  return { openDetails, openDetailsForPlace };
}
