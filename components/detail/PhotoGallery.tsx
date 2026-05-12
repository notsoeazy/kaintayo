import React, { useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ActivityIndicator,
  Text,
  Pressable,
} from 'react-native';
import { Image } from 'expo-image';
import { Plus, X } from 'lucide-react-native';
import { Colors, FontFamily, FontSize, Radius, Spacing } from '@/styles/theme';
import { useTranslation } from '@/hooks/useTranslation';

const THUMB_SIZE = 88;

interface PhotoGalleryProps {
  photos: string[];
  isUploading: boolean;
  onAddPhoto: () => void;
}

export const PhotoGallery = React.memo(function PhotoGallery({ photos, isUploading, onAddPhoto }: PhotoGalleryProps) {
  const { t } = useTranslation();
  const [viewerUrl, setViewerUrl] = useState<string | null>(null);

  const renderPhotoCount = () => {
    if (photos.length === 0) return null;
    const text = t.detailScreen.photoCount
      .replace('{{count}}', photos.length.toString())
      .replace('{{s}}', photos.length > 1 ? 's' : '');
    return <Text style={styles.photoCount}>{text}</Text>;
  };

  return (
    <>
      {/* SECTION HEADER */}
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>{t.detailScreen.photosLabel}</Text>
        {renderPhotoCount()}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {/* ADD PHOTO BUTTON */}
        <TouchableOpacity
          style={[styles.thumb, styles.addButton]}
          onPress={onAddPhoto}
          disabled={isUploading}
          activeOpacity={0.75}
        >
          {isUploading ? (
            <ActivityIndicator color={Colors.muted} />
          ) : (
            <>
              <Plus size={22} color={Colors.muted} strokeWidth={1.5} />
              <Text style={styles.addLabel}>{t.detailScreen.addPhotoTitle.split(' ')[0]}</Text>
            </>
          )}
        </TouchableOpacity>

        {/* PHOTO THUMBNAILS */}
        {photos.map((url, i) => (
          <TouchableOpacity
            key={`${url}-${i}`}
            style={styles.thumb}
            onPress={() => setViewerUrl(url)}
            activeOpacity={0.85}
          >
            <Image
              source={url}
              style={styles.thumbImage}
              contentFit="cover"
              transition={200}
            />
          </TouchableOpacity>
        ))}

        {/* EMPTY PLACEHOLDER */}
        {photos.length === 0 && !isUploading && (
          <View style={[styles.thumb, styles.emptyThumb]}>
            <Text style={styles.emptyText}>{t.detailScreen.noPhotos}</Text>
          </View>
        )}
      </ScrollView>

      <Modal
        visible={!!viewerUrl}
        transparent
        animationType="fade"
        onRequestClose={() => setViewerUrl(null)}
        statusBarTranslucent
      >
        <View style={styles.viewerBg}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setViewerUrl(null)} />
          {viewerUrl && (
            <Image
              source={viewerUrl}
              style={styles.viewerImage}
              contentFit="contain"
            />
          )}
          <TouchableOpacity style={styles.closeButton} onPress={() => setViewerUrl(null)}>
            <X size={22} color={Colors.surface} strokeWidth={2.5} />
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  );
});

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.sm,
    color: Colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  photoCount: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.xs,
    color: Colors.muted,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: Radius.md,
    overflow: 'hidden',
  },
  thumbImage: {
    width: '100%',
    height: '100%',
  },
  addButton: {
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    backgroundColor: Colors.linen,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  addLabel: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.xs,
    color: Colors.muted,
  },
  emptyThumb: {
    backgroundColor: Colors.linen,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.xs,
    color: Colors.muted,
  },

  // FULL-SCREEN VIEWER
  viewerBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.92)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewerImage: {
    width: '100%',
    height: '80%',
  },
  closeButton: {
    position: 'absolute',
    top: 52,
    right: Spacing.md,
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
