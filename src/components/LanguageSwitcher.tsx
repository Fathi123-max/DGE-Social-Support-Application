import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Globe } from 'lucide-react-native';
import { colors, typography, spacing, borderRadius } from '../config/theme';
import { useLocalization } from '../hooks/useLocalization';

export function LanguageSwitcher() {
  const { locale, toggleLocale, t } = useLocalization();

  const displayText = locale === 'en' ? t('language.arabic') : t('language.english');
  const targetLang = locale === 'en' ? 'Arabic' : 'English';

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={toggleLocale}
      accessibilityRole="button"
      accessibilityLabel={t('accessibility.languageSwitch', { language: targetLang })}
      accessibilityHint={t('language.switchTo')}
    >
      <Globe size={18} color={colors.primary[500]} />
      <Text style={styles.text}>{displayText}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary[50],
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    gap: spacing.xs,
  },
  text: {
    ...typography.bodySmall,
    color: colors.primary[600],
    fontWeight: '600',
  },
});
