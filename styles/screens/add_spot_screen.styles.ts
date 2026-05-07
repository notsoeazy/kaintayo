import { StyleSheet } from 'react-native';
import { Colors, FontFamily, FontSize, Radius, Spacing } from '@/styles/theme';

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
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.bg,
  },
  backButton: {
    padding: Spacing.xs,
    marginRight: Spacing.sm,
  },
  headerTitle: {
    fontFamily: FontFamily.display,
    fontSize: FontSize.xl,
    color: Colors.text,
    letterSpacing: 1,
    flex: 1,
  },
  stepIndicator: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.sm,
    color: Colors.muted,
  },

  // SCROLL CONTENT
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: 120,
  },

  // ORDER SLIP CARD
  slipCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  slipLabel: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.xs,
    color: Colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: Spacing.xs,
  },

  // IMAGE PICKER
  imagePicker: {
    height: 180,
    borderRadius: Radius.md,
    borderWidth: 2,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    backgroundColor: Colors.linen,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
    overflow: 'hidden',
  },
  imagePickerText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.sm,
    color: Colors.muted,
    marginTop: Spacing.sm,
    textAlign: 'center',
  },
  selectedImage: {
    width: '100%',
    height: '100%',
  },

  // FORM INPUTS
  inputWrapper: {
    marginBottom: Spacing.md,
  },
  inputLabel: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.sm,
    color: Colors.muted,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  input: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.md,
    color: Colors.text,
    backgroundColor: Colors.linen,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  inputFocused: {
    borderColor: Colors.primary,
    borderWidth: 2,
  },
  inputMultiline: {
    minHeight: 80,
    textAlignVertical: 'top',
  },

  // PRICE ROW
  priceRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  priceInputWrapper: {
    flex: 1,
  },
  pricePrefix: {
    fontFamily: FontFamily.mono,
    fontSize: FontSize.md,
    color: Colors.muted,
    position: 'absolute',
    left: Spacing.sm,
    top: Spacing.sm + 2,
    zIndex: 1,
  },
  priceInput: {
    paddingLeft: Spacing.lg,
  },

  // CATEGORY CHIPS
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  categoryChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.linen,
  },
  categoryChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryChipText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.sm,
    color: Colors.muted,
  },
  categoryChipTextActive: {
    color: Colors.text,
  },

  // LOCATION CARD (static preview replacing broken MapView)
  locationCard: {
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    backgroundColor: Colors.linen,
    marginBottom: Spacing.sm,
    overflow: 'hidden',
  },
  locationCardPinned: {
    borderStyle: 'solid',
    borderColor: Colors.secondary,
    backgroundColor: Colors.surface,
  },
  locationCardInner: {
    padding: Spacing.md,
    alignItems: 'center',
    gap: Spacing.sm,
  },
  locationCardText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.sm,
    color: Colors.muted,
    textAlign: 'center',
  },
  locationCardCoords: {
    fontFamily: FontFamily.mono,
    fontSize: FontSize.sm,
    color: Colors.text,
    textAlign: 'center',
  },
  openMapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: Radius.full,
  },
  openMapButtonText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.sm,
    color: Colors.text,
  },
  mapHint: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.sm,
    color: Colors.muted,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  coordinateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.linen,
    borderRadius: Radius.sm,
    marginBottom: Spacing.md,
  },
  coordinateText: {
    fontFamily: FontFamily.mono,
    fontSize: FontSize.sm,
    color: Colors.text,
  },
  coordinateMuted: {
    color: Colors.muted,
  },

  // FOOTER BUTTONS
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.bg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  nextButton: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  nextButtonText: {
    fontFamily: FontFamily.display,
    fontSize: FontSize.lg,
    color: Colors.text,
    letterSpacing: 1,
  },
  submitButton: {
    backgroundColor: Colors.secondary,
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  submitButtonText: {
    fontFamily: FontFamily.display,
    fontSize: FontSize.lg,
    color: Colors.surface,
    letterSpacing: 1,
  },
  disabledButton: {
    opacity: 0.5,
  },
  errorText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.sm,
    color: Colors.secondary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },

  // MAP MODAL
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  modalTitle: {
    flex: 1,
    fontFamily: FontFamily.display,
    fontSize: FontSize.xl,
    color: Colors.text,
    textAlign: 'center',
    letterSpacing: 1,
  },
  centerPinOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerPinDot: {
    width: 8,
    height: 8,
    borderRadius: Radius.full,
    backgroundColor: Colors.secondary,
    marginTop: -4,
    opacity: 0.5,
  },
  modalFooter: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  modalFooterHint: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.sm,
    color: Colors.muted,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
});
