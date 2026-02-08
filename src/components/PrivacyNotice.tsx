import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Shield } from 'lucide-react-native';
import { colors, typography, spacing, borderRadius } from '../config/theme';
import { useLocalization } from '../hooks/useLocalization';

export function PrivacyNotice() {
  const { isRTL, t } = useLocalization();

  return (
    <View
      style={[styles.container, isRTL && styles.containerRTL]}
      accessibilityRole="text"
      accessibilityLabel={t('accessibility.privacyNotice')}
    >
      <Shield size={20} color={colors.primary[500]} accessibilityElementsHidden />
      <Text style={[styles.text, isRTL && styles.textRTL]}>
        {t('privacy.notice')}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.primary[50],
    padding: spacing.md,
    borderRadius: borderRadius.md,
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  containerRTL: {
    flexDirection: 'row-reverse',
  },
  text: {
    ...typography.bodySmall,
    color: colors.primary[700],
    flex: 1,
  },
  textRTL: {
    textAlign: 'right',
  },
});
