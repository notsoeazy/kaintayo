import React from 'react';
import { View, ScrollView, ActivityIndicator, Text, Share, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { useDetailScreen } from '@/hooks/useDetailScreen';
import { HeroTopBar } from '@/components/detail/HeroTopBar';
import { InfoSection } from '@/components/detail/InfoSection';
import { PhotoGallery } from '@/components/detail/PhotoGallery';
import { PriceSurvey } from '@/components/detail/PriceSurvey';
import { LocationMap } from '@/components/detail/LocationMap';
import { ActionRow } from '@/components/detail/ActionRow';
import { InviteModal } from '@/components/detail/InviteModal';
import { InviteFriendsModal } from '@/components/detail/InviteFriendsModal';
import { useProfileStore } from '@/store/profile_store';
import { Colors, FontFamily, FontSize, Spacing } from '@/styles/theme';
import { useTranslation } from '@/hooks/useTranslation';

export default function DetailScreen() {
  const { id, invitedBy } = useLocalSearchParams<{ id: string; invitedBy?: string }>();
  const { t } = useTranslation();
  const { profile } = useProfileStore();

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

  const [isInviteModalVisible, setIsInviteModalVisible] = React.useState(!!invitedBy);
  const [isInviteFriendsVisible, setIsInviteFriendsVisible] = React.useState(false);

  // Show invite modal on mount if invitedBy is present
  React.useEffect(() => {
    if (invitedBy) {
      setIsInviteModalVisible(true);
    }
  }, [invitedBy]);

  const handleAcceptInvite = () => {
    setIsInviteModalVisible(false);
    if (!isWishlisted) {
      handleWishlist();
    }
  };

  const handleShare = async () => {
    if (!place) return;
    const username = profile?.username || '';
    const deepLink = `kaintayo://detail/${place.id}${username ? `?invitedBy=${username}` : ''}`;
    const msg = (t.detailScreen.shareMessageScheme || "Tara kain sa {{placeName}}! Open this in KainTayo: {{url}}")
      .replace('{{placeName}}', place.name)
      .replace('{{url}}', deepLink);
    await Share.share({ message: msg });
  };

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
        {/* 1. HERO + TOP BAR */}
        <HeroTopBar
          photoUrl={place.photoUrl}
          placeName={place.name}
          onShare={handleShare}
          onInvite={() => setIsInviteFriendsVisible(true)}
        />

        {/* 2. CORE INFO: NAME → DESC → TAGS → PRICE/ADDRESS */}
        <InfoSection place={place} />

        {/* 3. ACTION ROW: I-SAVE + NA-TRY KO NA */}
        <ActionRow
          isWishlisted={isWishlisted}
          isTried={isTried}
          onWishlist={handleWishlist}
          onTried={handleTried}
        />

        {/* 4. PHOTO GALLERY (COLLAGE) */}
        <View style={styles.sectionPadding}>
          <PhotoGallery
            photos={photos}
            isUploading={isUploadingPhoto}
            onAddPhoto={handleAddPhoto}
          />
        </View>

        {/* 5. PRICE SURVEY */}
        <PriceSurvey
          voteTally={voteTally}
          userVote={userVote}
          isVoting={isVoting}
          canVote={canVote}
          onVote={handleVote}
        />

        {/* 6. LOCATION MAP + DIRECTIONS */}
        {place.latitude && place.longitude ? (
          <LocationMap
            latitude={place.latitude}
            longitude={place.longitude}
            googleMapsUrl={place.googleMapsUrl ?? ''}
            address={place.address}
          />
        ) : null}

        {/* BOTTOM SPACER */}
        <View style={{ height: Spacing.xl }} />
      </ScrollView>

      <InviteModal
        visible={isInviteModalVisible}
        invitedBy={invitedBy || ''}
        placeName={place.name}
        onAccept={handleAcceptInvite}
        onClose={() => setIsInviteModalVisible(false)}
      />

      <InviteFriendsModal
        visible={isInviteFriendsVisible}
        placeId={place.id}
        placeName={place.name}
        onClose={() => setIsInviteFriendsVisible(false)}
      />
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
  sectionPadding: {
    marginBottom: Spacing.xs,
  },
});
