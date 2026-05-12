import React from 'react';
import { View, ScrollView, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { useDetailScreen } from '@/hooks/useDetailScreen';
import { HeroImage } from '@/components/detail/HeroImage';
import { InfoSection } from '@/components/detail/InfoSection';
import { PhotoGallery } from '@/components/detail/PhotoGallery';
import { PriceSurvey } from '@/components/detail/PriceSurvey';
import { ActionGrid } from '@/components/detail/ActionGrid';
import { Colors, FontFamily, FontSize, Spacing } from '@/styles/theme';
import { useTranslation } from '@/hooks/useTranslation';

export default function DetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useTranslation();

  const {
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
    handleAddPhoto,
    handleVote,
    handleWishlist,
    handleTried,
  } = useDetailScreen(id);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator color={Colors.primary} size="large" />
        <Text style={styles.loadingText}>{t.detailScreen.loading}</Text>
      </SafeAreaView>
    );
  }

  if (!place) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.loadingText}>{t.detailScreen.notFound}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <HeroImage photoUrl={place.photoUrl} />

        <InfoSection place={place} />

        <View style={styles.divider} />

        <PhotoGallery
          photos={photos}
          isUploading={isUploadingPhoto}
          onAddPhoto={handleAddPhoto}
        />

        <PriceSurvey
          voteTally={voteTally}
          userVote={userVote}
          isVoting={isVoting}
          canVote={canVote}
          onVote={handleVote}
        />

        <ActionGrid
          googleMapsUrl={place.googleMapsUrl}
          placeName={place.name}
          isWishlisted={isWishlisted}
          isTried={isTried}
          onWishlist={handleWishlist}
          onTried={handleTried}
        />

        {/* BOTTOM SPACER */}
        <View style={{ height: Spacing.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  scrollContent: {
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.bg,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  loadingText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.md,
    color: Colors.muted,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
  },
});
