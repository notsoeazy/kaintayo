import React, { useEffect, useRef } from 'react';
import { Animated, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors, FontFamily, FontSize, Radius, Spacing } from '@/styles/theme';
import { useTranslation } from '@/hooks/useTranslation';

interface InviteModalProps {
  visible: boolean;
  invitedBy: string;
  placeName: string;
  onAccept: () => void;
  onClose: () => void;
}

export function InviteModal({ visible, invitedBy, placeName, onAccept, onClose }: InviteModalProps) {
  const { t } = useTranslation();
  const scaleAnim = useRef(new Animated.Value(0.85)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, { toValue: 1, tension: 60, friction: 8, useNativeDriver: true }),
        Animated.timing(opacityAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  const renderMessage = () => {
    const bodyStr = t.detailScreen.inviteModalBody || "Ininvite ka ni @{{username}} kumain sa {{placeName}}!";
    const parts = bodyStr.split(/(\{\{username\}\}|\{\{placeName\}\})/);
    return (
      <Text style={styles.message}>
        {parts.map((part, index) => {
          if (part === '{{username}}') {
            return <Text key={index} style={styles.username}>@{invitedBy}</Text>;
          }
          if (part === '{{placeName}}') {
            return <Text key={index} style={styles.placeName}>{placeName}</Text>;
          }
          return part;
        })}
      </Text>
    );
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <Animated.View style={[styles.card, { transform: [{ scale: scaleAnim }], opacity: opacityAnim }]}>
          <View style={styles.avatarContainer}>
            <Text style={styles.emoji}>😋</Text>
          </View>
          <Text style={styles.tagline}>{t.detailScreen.inviteModalTitle}</Text>
          {renderMessage()}
          
          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.button, styles.closeButton]} onPress={onClose}>
              <Text style={styles.closeButtonText}>{t.detailScreen.inviteModalDetails}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.acceptButton]} onPress={onAccept}>
              <Text style={styles.acceptButtonText}>{t.detailScreen.inviteModalAccept}</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(44, 26, 14, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: Radius.full,
    backgroundColor: Colors.blush,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  emoji: {
    fontSize: 32,
  },
  tagline: {
    fontFamily: FontFamily.accent,
    fontSize: FontSize.xl,
    color: Colors.secondary,
    marginBottom: Spacing.sm,
  },
  message: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.md,
    color: Colors.text,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: Spacing.lg,
  },
  username: {
    fontFamily: FontFamily.bodyMedium,
    color: Colors.primary,
  },
  placeName: {
    fontFamily: FontFamily.bodyMedium,
    color: Colors.accent,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    width: '100%',
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: Radius.full,
    alignItems: 'center',
  },
  closeButton: {
    backgroundColor: Colors.linen,
  },
  closeButtonText: {
    fontFamily: FontFamily.bodyMedium,
    color: Colors.muted,
  },
  acceptButton: {
    backgroundColor: Colors.primary,
  },
  acceptButtonText: {
    fontFamily: FontFamily.bodyMedium,
    color: Colors.white,
  },
});
