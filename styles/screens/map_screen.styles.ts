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
    backgroundColor: Colors.bg,
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,
    zIndex: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTextContainer: {
    flex: 1,
    marginRight: Spacing.md,
  },
  title: {
    fontFamily: FontFamily.accent,
    fontSize: FontSize.xxl + 2,
    color: Colors.primary,
  },
  subtitle: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.sm - 1,
    color: Colors.muted,
    marginTop: 2,
  },
  spotCountPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: Spacing.xs,
    gap: 4,
  },
  pillIcon: {
    marginRight: 2,
  },
  spotCountText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.sm,
    color: Colors.text,
  },
  headerLoader: {
    alignSelf: 'center',
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
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
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

  // FILTER FAB ACTIVE STATE
  filterFabActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterFabLabelActive: {
    color: Colors.bg,
  },
});
