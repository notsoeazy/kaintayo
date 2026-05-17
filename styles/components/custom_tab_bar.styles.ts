import { StyleSheet } from 'react-native';
import { Colors, FontFamily, FontSize, Spacing } from '@/styles/theme';

export const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: Colors.bg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabSlot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabItem: {
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    width: '100%',
  },
  tabLabel: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.xs,
    marginTop: 4,
  },
  fabContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.bg,
    marginTop: -24,
  },
  fab: {
    flex: 1,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
