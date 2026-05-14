import { StyleSheet } from 'react-native';
import { Colors, FontFamily, FontSize, Radius, Spacing, Typography } from '@/styles/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },

  // HEADER
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
  },
  title: {
    fontFamily: FontFamily.display,
    fontSize: FontSize.xl,
    color: Colors.text,
    letterSpacing: 1,
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    backgroundColor: Colors.linen,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },

  // HERO SECTION (Task 3)
  heroSection: {
    alignItems: 'center',
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  avatarRing: {
    width: 108,
    height: 108,
    borderRadius: 54,
    borderWidth: 2.5,
    borderColor: Colors.primary,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  avatarImage: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: Colors.linen,
  },
  avatarPlaceholder: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: Colors.linen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  changePhotoLabel: {
    ...Typography.caption,
    color: Colors.primary,
    marginTop: Spacing.xs,
    marginBottom: Spacing.md,
  },
  usernameText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.lg,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  usernameHint: {
    ...Typography.caption,
  },
  usernameEditRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  usernameInput: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.md,
    color: Colors.text,
    borderBottomWidth: 1.5,
    borderBottomColor: Colors.primary,
    paddingBottom: Spacing.xs,
    minWidth: 160,
    textAlign: 'center',
  },
  saveButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    backgroundColor: Colors.primary,
    borderRadius: Radius.sm,
  },
  saveButtonText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.sm,
    color: Colors.surface,
  },
  cancelButtonText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.sm,
    color: Colors.muted,
  },

  // TAB BAR (Task 4)
  tabBar: {
    flexDirection: 'row',
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    borderRadius: Radius.full,
    backgroundColor: Colors.linen,
    padding: 4,
  },
  tabItem: {
    flex: 1,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    borderRadius: Radius.full,
  },
  tabItemActive: {
    backgroundColor: Colors.surface,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.sm,
    color: Colors.muted,
  },
  tabTextActive: {
    fontFamily: FontFamily.bodyMedium,
    color: Colors.text,
  },

  // GRID (Task 4)
  gridContent: {
    paddingHorizontal: Spacing.sm,
    paddingBottom: 100,
  },
  gridColumn: {
    flex: 1,
    paddingHorizontal: Spacing.xs,
  },

  // EMPTY STATE
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
  },
});
