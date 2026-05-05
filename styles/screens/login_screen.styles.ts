import { StyleSheet } from 'react-native';
import { Colors, FontFamily, FontSize, Radius, Spacing, Typography } from '@/styles/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  inner: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xl,
  },

  // HERO
  heroSection: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  appName: {
    fontFamily: FontFamily.display,
    fontSize: 80,
    color: Colors.primary,
    letterSpacing: 6,
    lineHeight: 84,
  },
  tagline: {
    ...Typography.title,
    fontFamily: FontFamily.accent,
    color: Colors.text,
    marginTop: Spacing.xs,
  },
  sub: {
    ...Typography.caption,
    marginTop: Spacing.sm,
  },

  // FORM
  formSection: {
    width: '100%',
  },
  input: {
    backgroundColor: Colors.linen,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 14,
    fontFamily: FontFamily.body,
    fontSize: FontSize.md,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.sm,
  },
  errorText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.sm,
    color: Colors.secondary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  loader: {
    marginVertical: Spacing.lg,
  },

  // PRIMARY BUTTON
  primaryButton: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: Spacing.xs,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    fontFamily: FontFamily.display,
    fontSize: FontSize.md,
    color: Colors.bg,
    letterSpacing: 1,
  },

  // DIVIDER
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.sm,
    color: Colors.muted,
    marginHorizontal: Spacing.sm,
  },

  // GOOGLE BUTTON
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.full,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  googleIcon: {
    marginRight: Spacing.sm,
  },
  googleButtonText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.md,
    color: Colors.text,
  },
});
