import { StyleSheet } from 'react-native';
import { Colors, FontFamily, FontSize, Radius, Spacing, Typography } from '../theme';

// PIN MARKER CONSTANTS
export const PIN_SIZE = 28;
export const LABEL_MAX_WIDTH = 110;

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
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.sm,
    backgroundColor: 'rgba(250, 243, 232, 0.92)',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    zIndex: 10,
  },
  heading: {
    fontFamily: FontFamily.display,
    fontSize: FontSize.xl,
    color: Colors.text,
    letterSpacing: 1,
  },
  subheading: {
    ...Typography.caption,
    marginTop: 2,
  },

  // PLACE COUNT BADGE
  countBadge: {
    position: 'absolute',
    bottom: Spacing.xl,
    alignSelf: 'center',
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  countBadgeText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.sm,
    color: Colors.text,
  },

  // MY LOCATION BUTTON
  locationButton: {
    position: 'absolute',
    bottom: Spacing.xl + 52,
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

  // LOADING OVERLAY
  loadingOverlay: {
    position: 'absolute',
    bottom: Spacing.xl,
    alignSelf: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    elevation: 3,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  loadingText: {
    ...Typography.caption,
  },
});
