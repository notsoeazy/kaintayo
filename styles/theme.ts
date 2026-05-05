import { StyleSheet } from 'react-native';

// COLOR PALETTE
export const Colors = {
  primary:   '#E8A838', // Sorbetes Yellow for CTAs and active states
  secondary: '#C25B4E', // Ribbon Red for likes, badges, and errors
  accent:    '#4A9B94', // Tindahan Teal for tags and secondary actions
  bg:        '#FAF3E8', // Capiz Cream app base background
  surface:   '#FFF8F0', // Bahay White for cards and modals
  linen:     '#F2E8D9', // Kamiseta Linen for input fields and section fills
  blush:     '#F5D9B8', // Sampaguita Blush for hover states and warm surfaces
  sky:       '#A8C8D0', // Langit Blue decorative only
  success:   '#5E9E6A', // Pandan Sage for Na try Ko Na confirmed
  text:      '#2C1A0E', // Uling Deep Brown body text
  muted:     '#8A7060', // Abo Warm Grey for captions and placeholders
  border:    '#C9B49A', // Niyog Shell for dividers and card borders
} as const;

// SPACING SCALE
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 40,
} as const;

// BORDER RADIUS SCALE
export const Radius = {
  sm:   8,
  md:   16,
  lg:   24,
  full: 9999,
} as const;

// TYPOGRAPHY
// Loaded via expo google fonts in app layout
export const FontFamily = {
  display: 'BebasNeue_400Regular',  // Screen titles and hero text in uppercase
  body:       'DMSans_400Regular',    // Descriptions, captions, and UI labels
  bodyMedium: 'DMSans_500Medium',     // Category chips, badges
  accent:   'Pacifico_400Regular',  // Kahit Saan button and Taglish moments
  mono:     'JetBrainsMono_400Regular', // Price displays in PHP amounts
} as const;

// FONT SIZE SCALE
export const FontSize = {
  xs:   11,
  sm:   13,
  md:   15,
  lg:   18,
  xl:   22,
  xxl:  28,
} as const;

// TYPOGRAPHY TOKENS
export const Typography = {
  heading: {
    fontFamily: FontFamily.accent,
    fontSize: FontSize.xxl,
    color: Colors.primary,
    marginBottom: Spacing.sm,
  },
  title: {
    fontFamily: FontFamily.display,
    fontSize: FontSize.xl,
    color: Colors.text,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.md,
    color: Colors.muted,
    lineHeight: 22,
  },
  body: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.md,
    color: Colors.text,
    lineHeight: 20,
  },
  caption: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.sm,
    color: Colors.muted,
  },
  price: {
    fontFamily: FontFamily.mono,
    fontSize: FontSize.md,
    color: Colors.text,
  },
} as const;

// SHARED UTILITY STYLES
export const UtilStyles = StyleSheet.create({
  // Full screen base background
  screen: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  // Standard horizontal padding for all screens
  screenPadding: {
    paddingHorizontal: Spacing.md,
  },
  // Card surface styling
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  // Pill container for tags and badges
  pill: {
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  // Row flexbox alignment
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  // Centered content alignment
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
