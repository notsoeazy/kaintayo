import { StyleSheet } from 'react-native';
import { Colors, FontFamily, FontSize, UtilStyles, Spacing, Radius, Typography } from '@/styles/theme';

export const styles = StyleSheet.create({
  container: {
    ...UtilStyles.screen,
    backgroundColor: Colors.bg,
  },
  headerContainer: {
    paddingHorizontal: Spacing.md,
    paddingTop: 0,
    paddingBottom: 0,
  },
  heading: {
    ...Typography.heading,
  },
  listContent: {
    paddingHorizontal: Spacing.md,
    paddingBottom: 100, // Space for FAB
    paddingTop: Spacing.md,
  },
  emptyContainer: {
    flex: 1,
    padding: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIcon: {
    marginBottom: Spacing.md,
    opacity: 0.8,
  },
  emptyTitle: {
    ...Typography.title,
    color: Colors.muted, // Keep muted color for empty state
    textAlign: 'center',
  },
  emptyText: {
    ...Typography.subtitle,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  emptyButton: {
    backgroundColor: Colors.secondary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: Radius.full,
    shadowColor: Colors.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  emptyButtonText: {
    fontFamily: FontFamily.display,
    fontSize: FontSize.md,
    color: Colors.bg,
    letterSpacing: 1,
  },
  fab: {
    position: 'absolute',
    bottom: Spacing.lg,
    right: Spacing.lg,
    backgroundColor: Colors.primary,
    width: 64,
    height: 64,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
});
