import { StyleSheet } from 'react-native';
import { Colors, FontFamily, Radius, Spacing, Typography } from '@/styles/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },

  // HEADER
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
    gap: Spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    backgroundColor: Colors.linen,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  title: {
    fontFamily: FontFamily.display,
    fontSize: 24,
    color: Colors.text,
    letterSpacing: 1,
  },

  // SUB-TAB BAR
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
    fontSize: 14,
    color: Colors.muted,
  },
  tabTextActive: {
    fontFamily: FontFamily.bodyMedium,
    color: Colors.text,
  },
  tabBadge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    marginLeft: Spacing.xs,
  },
  tabBadgeText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 10,
    color: Colors.surface,
    lineHeight: 12,
  },

  // SEARCH AND ACTIONS SECTION
  searchSection: {
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    height: 44,
    backgroundColor: Colors.linen,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.md,
    fontFamily: FontFamily.body,
    fontSize: 16,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchButton: {
    height: 44,
    backgroundColor: Colors.primary,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 14,
    color: Colors.surface,
  },
  searchIndicator: {
    marginVertical: Spacing.sm,
  },

  // SEARCH RESULTS
  searchResultsContainer: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.xs,
    gap: Spacing.xs,
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.linen,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  smallAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.linen,
  },
  smallAvatarPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.linen,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchResultUsername: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 16,
    color: Colors.text,
  },
  statusLabel: {
    fontFamily: FontFamily.body,
    fontSize: 12,
    color: Colors.muted,
  },
  addButton: {
    backgroundColor: Colors.accent,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
    borderRadius: Radius.sm,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  actionButton: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
    borderRadius: Radius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  acceptBtn: {
    backgroundColor: Colors.success,
  },
  declineBtn: {
    backgroundColor: Colors.secondary,
  },
  actionButtonText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 12,
    color: Colors.surface,
  },

  // LIST SECTIONS
  listContent: {
    paddingBottom: Spacing.xl,
  },
  sectionHeader: {
    backgroundColor: Colors.bg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  sectionTitle: {
    fontFamily: FontFamily.display,
    fontSize: 16,
    color: Colors.text,
    letterSpacing: 0.5,
    marginTop: Spacing.sm,
    marginBottom: Spacing.xs,
  },

  // ITEM ROWS
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
    padding: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  friendAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.linen,
  },
  friendAvatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.linen,
    justifyContent: 'center',
    alignItems: 'center',
  },
  friendUsername: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 16,
    color: Colors.text,
  },
  unfriendButton: {
    padding: Spacing.sm,
  },

  requestItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
    padding: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  requestUsername: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 16,
    color: Colors.text,
  },

  // EMPTY STATES & FEEDBACK
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl * 2,
    gap: Spacing.sm,
  },
  emptyTitle: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 18,
    color: Colors.text,
    textAlign: 'center',
  },
  emptyDesc: {
    ...Typography.caption,
    color: Colors.muted,
    textAlign: 'center',
    paddingHorizontal: Spacing.md,
  },
  noResultsContainer: {
    padding: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noResultsText: {
    fontFamily: FontFamily.body,
    fontSize: 14,
    color: Colors.muted,
  },
});
