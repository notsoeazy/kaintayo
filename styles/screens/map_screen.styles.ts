import { StyleSheet } from 'react-native';
import { Colors, FontFamily, FontSize, Radius, Spacing, Typography } from '../theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },

  // FULL SCREEN MAP
  map: {
    flex: 1,
  },

  // HEADER OVERLAY
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 8,
    zIndex: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heading: {
    fontFamily: FontFamily.display,
    fontSize: FontSize.xxl,
    color: Colors.text,
    letterSpacing: 1,
  },
  spotCountPill: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    minWidth: 28,
    alignItems: 'center',
  },
  spotCountText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.sm,
    color: Colors.text,
  },
  subheading: {
    ...Typography.caption,
    marginTop: 2,
  },
  headerLoadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: 2,
  },
  headerLoadingText: {
    ...Typography.caption,
  },

  // MY LOCATION BUTTON
  locationButton: {
    position: 'absolute',
    bottom: Spacing.xl + 52 + 20,
    right: Spacing.md,
    width: 46,
    height: 46,
    borderRadius: Radius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 4,
  },

  // COMPASS BUTTON
  compassButton: {
    position: 'absolute',
    bottom: Spacing.xl + 52 + 54 + Spacing.sm + 20,
    right: Spacing.md,
    width: 46,
    height: 46,
    borderRadius: Radius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 4,
  },

  // FILTER FAB
  filterFab: {
    position: 'absolute',
    bottom: Spacing.xl,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  filterFabLabel: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.sm,
    color: Colors.text,
  },

  // FILTER BOTTOM SHEET
  bottomSheetBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(44, 26, 14, 0.45)',
  },
  bottomSheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: Radius.lg,
    borderTopRightRadius: Radius.lg,
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xl,
    paddingTop: Spacing.sm,
    minHeight: 300,
  },
  bottomSheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: Radius.full,
    alignSelf: 'center',
    marginBottom: Spacing.md,
  },
  bottomSheetTitle: {
    fontFamily: FontFamily.display,
    fontSize: FontSize.xl,
    color: Colors.text,
    letterSpacing: 0.5,
    marginBottom: Spacing.md,
  },
  bottomSheetPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xl,
    gap: Spacing.sm,
  },
  bottomSheetComingSoonText: {
    ...Typography.caption,
  },
});
