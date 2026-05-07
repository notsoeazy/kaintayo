import React, { useEffect, useRef } from 'react';
import { Animated, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors, FontFamily, FontSize, Radius, Spacing } from '@/styles/theme';

interface SuccessFeedbackModalProps {
  visible: boolean;
  title: string;
  message: string;
  buttonLabel: string;
  onClose: () => void;
}

export function SuccessFeedbackModal({
  visible,
  title,
  message,
  buttonLabel,
  onClose,
}: SuccessFeedbackModalProps) {
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 60,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scaleAnim.setValue(0.8);
      opacityAnim.setValue(0);
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.backdrop}>
        <Animated.View
          style={[styles.card, { transform: [{ scale: scaleAnim }], opacity: opacityAnim }]}
        >
          {/* DECORATIVE DOTS */}
          <View style={[styles.decorDot, { width: 60, height: 60, top: -16, right: -16, opacity: 0.4 }]} />
          <View style={[styles.decorDot, { width: 30, height: 30, bottom: 20, left: -10, opacity: 0.25 }]} />

          {/* ICON */}
          <View style={styles.iconContainer}>
            <Text style={styles.emoji}>🎉</Text>
          </View>

          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          <TouchableOpacity style={styles.button} onPress={onClose} activeOpacity={0.85}>
            <Text style={styles.buttonText}>{buttonLabel}</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(44, 26, 14, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.xl,
    paddingVertical: 36,
    alignItems: 'center',
    width: '100%',
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: Radius.full,
    backgroundColor: 'rgba(94, 158, 106, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  emoji: {
    fontSize: 36,
  },
  title: {
    fontFamily: FontFamily.accent,
    fontSize: FontSize.xxl,
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  message: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.md,
    color: Colors.muted,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing.xl,
  },
  button: {
    backgroundColor: Colors.success,
    paddingHorizontal: 48,
    paddingVertical: 14,
    borderRadius: Radius.full,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.md,
    color: Colors.surface,
    letterSpacing: 0.5,
  },
  decorDot: {
    position: 'absolute',
    borderRadius: Radius.full,
    backgroundColor: Colors.blush,
  },
});
