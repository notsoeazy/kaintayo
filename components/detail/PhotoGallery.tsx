import React, { useState, useRef } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ActivityIndicator,
  Text,
  Pressable,
  Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { Plus, X, Camera } from 'lucide-react-native';
import { Colors, FontFamily, FontSize, Radius, Spacing } from '@/styles/theme';
import { useTranslation } from '@/hooks/useTranslation';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const FEATURED_SIZE = 160;
const THUMB_SIZE = 108;
const GAP = Spacing.sm;

interface PhotoGalleryProps {
  photos: string[];
  isUploading: boolean;
  onAddPhoto: () => void;
}

export const PhotoGallery = React.memo(function PhotoGallery({
  photos,
  isUploading,
  onAddPhoto,
}: PhotoGalleryProps) {
  const { t } = useTranslation();
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const viewerRef = useRef<FlatList>(null);

  const openViewer = (index: number) => setViewerIndex(index);
  const closeViewer = () => setViewerIndex(null);

  const onViewerScroll = (index: number) => setViewerIndex(index);

  const renderPhotoCount = () => {
    if (photos.length === 0) return null;
    const text = t.detailScreen.photoCount
      .replace('{{count}}', photos.length.toString())
      .replace('{{s}}', photos.length > 1 ? 's' : '');
    return <Text style={styles.photoCount}>{text}</Text>;
  };

  // EMPTY STATE
  if (photos.length === 0 && !isUploading) {
    return (
      <View style={styles.emptyCard}>
        <Camera size={28} color={Colors.muted} strokeWidth={1.5} />
        <Text style={styles.emptyTitle}>{t.detailScreen.noPhotos}</Text>
        <Text style={styles.emptyHint}>{t.detailScreen.noPhotosHint}</Text>
        <TouchableOpacity
          style={styles.emptyAddButton}
          onPress={onAddPhoto}
          activeOpacity={0.75}
        >
          <Plus size={14} color={Colors.bg} strokeWidth={2.5} />
          <Text style={styles.emptyAddLabel}>{t.detailScreen.addPhotoButton}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderCollage = () => {
    if (photos.length === 0) return null;

    const displayPhotos = photos.slice(0, 3);
    const hasMore = photos.length > 3;

    return (
      <View style={styles.collageContainer}>
        {/* MAIN FEATURED PHOTO */}
        <TouchableOpacity
          style={styles.mainTile}
          onPress={() => openViewer(0)}
          activeOpacity={0.9}
        >
          <Image
            source={photos[0]}
            style={styles.tileImage}
            contentFit="cover"
            transition={300}
          />
        </TouchableOpacity>

        {/* SIDE STACK */}
        <View style={styles.sideStack}>
          {displayPhotos.slice(1).map((url, idx) => (
            <TouchableOpacity
              key={url}
              style={styles.sideTile}
              onPress={() => openViewer(idx + 1)}
              activeOpacity={0.9}
            >
              <Image
                source={url}
                style={styles.tileImage}
                contentFit="cover"
                transition={300}
              />
              {idx === 1 && hasMore && (
                <View style={styles.moreOverlay}>
                  <Text style={styles.moreText}>+{photos.length - 3}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}

          {/* ADD PHOTO BUTTON */}
          {displayPhotos.length < 3 && (
            <TouchableOpacity
              style={styles.addTileInCollage}
              onPress={onAddPhoto}
              disabled={isUploading}
            >
              {isUploading ? (
                <ActivityIndicator color={Colors.muted} />
              ) : (
                <Plus size={24} color={Colors.muted} />
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <>
      <View style={styles.container}>
      {/* SECTION HEADER */}
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>{t.detailScreen.photosLabel}</Text>
        {renderPhotoCount()}
        <TouchableOpacity onPress={onAddPhoto} style={styles.headerAddBtn}>
          <Plus size={16} color={Colors.primary} strokeWidth={2.5} />
          <Text style={styles.headerAddLabel}>{t.detailScreen.addPhotoButton}</Text>
        </TouchableOpacity>
      </View>

      {renderCollage()}
    </View>

      {/* FULLSCREEN VIEWER MODAL */}
      <Modal
        visible={viewerIndex !== null}
        transparent
        animationType="fade"
        onRequestClose={closeViewer}
        statusBarTranslucent
      >
        {/* PRESS OUTSIDE BACKDROP */}
        <Pressable style={styles.viewerBg} onPress={closeViewer}>
          <Pressable onPress={() => {}} style={styles.viewerContent}>
            {/* PHOTO COUNTER */}
            {viewerIndex !== null && photos.length > 1 && (
              <Text style={styles.viewerCounter}>
                {t.detailScreen.photoOf(viewerIndex + 1, photos.length)}
              </Text>
            )}

            {/* SWIPEABLE PHOTO LIST */}
            <FlatList
              ref={viewerRef}
              data={photos}
              keyExtractor={(url, i) => `viewer-${url}-${i}`}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              initialScrollIndex={viewerIndex ?? 0}
              getItemLayout={(_, index) => ({
                length: SCREEN_WIDTH,
                offset: SCREEN_WIDTH * index,
                index,
              })}
              onMomentumScrollEnd={(e) => {
                const newIndex = Math.round(
                  e.nativeEvent.contentOffset.x / SCREEN_WIDTH
                );
                onViewerScroll(newIndex);
              }}
              renderItem={({ item: url }) => (
                <View style={styles.viewerSlide}>
                  <Image
                    source={url}
                    style={styles.viewerImage}
                    contentFit="contain"
                  />
                </View>
              )}
            />

            {/* CLOSE BUTTON */}
            <TouchableOpacity style={styles.closeButton} onPress={closeViewer}>
              <X size={20} color={Colors.surface} strokeWidth={2.5} />
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingBottom: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.xs,
    color: Colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  headerAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  headerAddLabel: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.xs,
    color: Colors.primary,
  },
  photoCount: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.xs,
    color: Colors.muted,
  },
  collageContainer: {
    flexDirection: 'row',
    height: 220,
    paddingHorizontal: Spacing.md,
    gap: GAP,
  },
  mainTile: {
    flex: 2,
    borderRadius: Radius.md,
    overflow: 'hidden',
    backgroundColor: Colors.linen,
  },
  sideStack: {
    flex: 1,
    gap: GAP,
  },
  sideTile: {
    flex: 1,
    borderRadius: Radius.md,
    overflow: 'hidden',
    backgroundColor: Colors.linen,
  },
  addTileInCollage: {
    flex: 1,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    backgroundColor: Colors.linen,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tileImage: {
    width: '100%',
    height: '100%',
  },
  moreOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreText: {
    fontFamily: FontFamily.display,
    fontSize: FontSize.xl,
    color: '#FFF',
  },

  // EMPTY STATE
  emptyCard: {
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    backgroundColor: Colors.linen,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    paddingVertical: Spacing.lg,
    alignItems: 'center',
    gap: Spacing.xs,
  },
  emptyTitle: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.sm,
    color: Colors.muted,
    marginTop: Spacing.xs,
  },
  emptyHint: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.xs,
    color: Colors.muted,
  },
  emptyAddButton: {
    marginTop: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  emptyAddLabel: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.sm,
    color: '#FFF',
  },

  // FULLSCREEN VIEWER
  viewerBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
  },
  viewerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewerCounter: {
    position: 'absolute',
    top: 60,
    fontFamily: FontFamily.body,
    fontSize: FontSize.sm,
    color: 'rgba(255,255,255,0.7)',
    zIndex: 10,
  },
  viewerSlide: {
    width: SCREEN_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewerImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 1.3,
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: Spacing.md,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
  },
});
