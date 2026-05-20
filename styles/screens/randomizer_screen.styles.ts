import { Dimensions, StyleSheet } from 'react-native';
import { Colors, FontFamily, FontSize, Radius, Spacing } from '../theme';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },

  // HEADER ROW (title + filter button)
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
  },
  headerTitle: {
    fontFamily: FontFamily.display,
    fontSize: FontSize.xxl,
    color: Colors.text,
    letterSpacing: 1,
  },
  filterButton: {
    width: 48,
    height: 48,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },

  // IDLE STATE (big button view)
  idleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
  },
  idleSubtitle: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.md,
    color: Colors.muted,
    textAlign: 'center',
    marginTop: Spacing.xl,
    marginBottom: Spacing.xs,
  },
  filterHint: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.sm,
    color: Colors.primary,
    textAlign: 'center',
    marginTop: Spacing.xs,
    marginBottom: 0,
  },

  // BIG KAHIT SAAN BUTTON
  kahitSaanButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.xl,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    width: width * 0.72,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
    marginBottom: Spacing.md,
  },
  kahitSaanButtonText: {
    fontFamily: FontFamily.accent,
    fontSize: FontSize.xxl + 10,
    color: Colors.text,
    letterSpacing: 1,
  },
  kahitSaanIcon: {
    marginBottom: Spacing.sm,
  },

  // RESULT STATE (card + re-roll view)
  resultContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  resultLabel: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.sm,
    color: Colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: Spacing.md,
  },
  cardWrapper: {
    width: '100%',
    marginBottom: Spacing.lg,
  },
  pickAgainButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: Spacing.sm,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  pickAgainButtonText: {
    fontFamily: FontFamily.accent,
    fontSize: FontSize.xl,
    color: Colors.text,
  },

  // EMPTY / NO-RESULTS STATE
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
  },
});
