/*
Usage:
<ActionGrid
  googleMapsUrl={googleMapsUrl}
  placeName={placeName}
  isWishlisted={isWishlisted}
  isTried={isTried}
  onWishlist={onWishlist}
  onTried={onTried}
/>
*/
import React from 'react';
import { View, Linking, Share, StyleSheet } from 'react-native';
import { Navigation, Heart, CheckCircle, Share2 } from 'lucide-react-native';
import { KButton } from '@/components/ui/KButton';
import { Spacing } from '@/styles/theme';
import { useTranslation } from '@/hooks/useTranslation';

interface ActionGridProps {
  googleMapsUrl: string;
  placeName: string;
  isWishlisted: boolean;
  isTried: boolean;
  onWishlist: () => void;
  onTried: () => void;
}

export const ActionGrid = React.memo(function ActionGrid({
  googleMapsUrl,
  placeName,
  isWishlisted,
  isTried,
  onWishlist,
  onTried,
}: ActionGridProps) {
  const { t } = useTranslation();

  const handleShare = async () => {
    try {
      const message = t.detailScreen.shareMessage
        .replace('{{placeName}}', placeName)
        .replace('{{url}}', googleMapsUrl);

      await Share.share({ message });
    } catch {
      // User cancelled do nothing
    }
  };

  return (
    <View style={styles.grid}>
      <KButton
        title={t.detailScreen.directionsButton}
        variant="primary"
        icon={<Navigation />}
        style={styles.cell}
        onPress={() => Linking.openURL(googleMapsUrl)}
        size="sm"
      />
      <KButton
        title={isWishlisted ? t.detailScreen.wishlistDone : t.detailScreen.wishlistButton}
        variant={isWishlisted ? 'muted' : 'outline'}
        icon={<Heart />}
        style={styles.cell}
        onPress={onWishlist}
        disabled={isWishlisted}
        size="sm"
      />
      <KButton
        title={isTried ? t.detailScreen.triedDone : t.detailScreen.triedButton}
        variant={isTried ? 'muted' : 'success'}
        icon={<CheckCircle />}
        style={styles.cell}
        onPress={onTried}
        disabled={isTried}
        size="sm"
      />
      <KButton
        title={t.detailScreen.shareButton}
        variant="secondary"
        icon={<Share2 />}
        style={styles.cell}
        onPress={handleShare}
        size="sm"
      />
    </View>
  );
});

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  cell: {
    width: '47.5%',
  },
});
