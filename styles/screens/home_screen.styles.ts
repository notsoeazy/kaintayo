import { StyleSheet } from 'react-native';
import { Colors, FontFamily, FontSize, UtilStyles, Spacing, Radius, Typography } from '@/styles/theme';

export const styles = StyleSheet.create({
  container: {
    ...UtilStyles.screen,
    backgroundColor: Colors.bg,
  },
  headerContainer: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
  },
  greetingText: {
    ...Typography.subtitle,
    color: Colors.muted,
    marginBottom: Spacing.xs,
  },
  heading: {
    ...Typography.heading,
    marginBottom: Spacing.md,
  },
  listContent: {
    paddingHorizontal: Spacing.md,
    paddingBottom: 40,
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
    color: Colors.muted,
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
});
