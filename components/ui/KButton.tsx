/* 
Usage: 
<KButton
  title="Button"
  onPress={() => console.log('Button pressed')}
  variant="primary"
  size="md"
  loading={false}
  disabled={false}
  style={{}}
  icon={<Plus />}
/>
*/

import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  View,
  StyleSheet, 
  ActivityIndicator, 
  type ViewStyle, 
  type StyleProp 
} from 'react-native';
import { Colors, Spacing, Radius, Typography, FontSize } from '@/styles/theme';

export type KButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'muted' | 'outline';
export type KButtonSize = 'sm' | 'md' | 'lg';

interface KButtonProps {
  title: string;
  onPress: () => void;
  variant?: KButtonVariant;
  size?: KButtonSize;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  icon?: React.ReactNode;
}

export const KButton = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  style,
  icon,
}: KButtonProps) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':   return { bg: Colors.primary,   text: Colors.text };
      case 'secondary': return { bg: Colors.accent,    text: Colors.bg };
      case 'success':   return { bg: Colors.success,   text: Colors.bg };
      case 'danger':    return { bg: Colors.secondary, text: Colors.bg };
      case 'muted':     return { bg: Colors.border,    text: Colors.muted };
      case 'outline':   return { bg: 'transparent',    text: Colors.primary, border: Colors.primary };
      default:          return { bg: Colors.primary,   text: Colors.text };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm': return { paddingV: Spacing.xs, paddingH: Spacing.md, fontSize: FontSize.sm };
      case 'md': return { paddingV: Spacing.sm, paddingH: Spacing.lg, fontSize: FontSize.md };
      case 'lg': return { paddingV: Spacing.md, paddingH: Spacing.xl, fontSize: FontSize.lg };
      default:   return { paddingV: Spacing.sm, paddingH: Spacing.lg, fontSize: FontSize.md };
    }
  };

  const vStyles = getVariantStyles();
  const sStyles = getSizeStyles();

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.base,
        { 
          backgroundColor: vStyles.bg,
          paddingVertical: sStyles.paddingV,
          paddingHorizontal: sStyles.paddingH,
          borderColor: vStyles.border || 'transparent',
          borderWidth: vStyles.border ? 1 : 0,
        },
        disabled && styles.disabled,
        style
      ]}
    >
      {loading ? (
        <ActivityIndicator color={vStyles.text} size="small" />
      ) : (
        <>
          {icon && React.isValidElement(icon) && (
            <View style={styles.icon}>
              {React.cloneElement(icon as React.ReactElement<any>, {
                color: vStyles.text,
                size: sStyles.fontSize * 1.1,
                strokeWidth: 3.5,
              })}
            </View>
          )}
          <Text style={[
            styles.text, 
            { 
              color: vStyles.text,
              fontSize: sStyles.fontSize,
            }
          ]}>
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: Radius.full, // Pill shape as requested
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    ...Typography.title,
  },
  icon: {
    marginRight: Spacing.xs,
  },
  disabled: {
    opacity: 0.5,
  },
});
