import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, typography, spacing } from '../config/theme';
import { useLocalization } from '../hooks/useLocalization';
import { LanguageSwitcher } from './LanguageSwitcher';
import { AutosaveIndicator } from './AutosaveIndicator';

interface HeaderProps {
  lastSavedAt?: Date | null;
}

export function Header({ lastSavedAt }: HeaderProps) {
  const insets = useSafeAreaInsets();
  const { isRTL, t } = useLocalization();

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.sm }]}>
      <View style={[styles.topRow, isRTL && styles.topRowRTL]}>
        <View style={[styles.titleContainer, isRTL && styles.titleContainerRTL]}>
          <Text style={[styles.title, isRTL && styles.titleRTL]}>
            {t('app.title')}
          </Text>
          <Text style={[styles.subtitle, isRTL && styles.subtitleRTL]}>
            {t('app.subtitle')}
          </Text>
        </View>
        <LanguageSwitcher />
      </View>

      {lastSavedAt && (
        <View style={[styles.autosaveRow, isRTL && styles.autosaveRowRTL]}>
          <AutosaveIndicator lastSavedAt={lastSavedAt} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.neutral[0],
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[100],
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  topRowRTL: {
    flexDirection: 'row-reverse',
  },
  titleContainer: {
    flex: 1,
    marginRight: spacing.md,
  },
  titleContainerRTL: {
    marginRight: 0,
    marginLeft: spacing.md,
  },
  title: {
    ...typography.h3,
    color: colors.primary[600],
  },
  titleRTL: {
    textAlign: 'right',
  },
  subtitle: {
    ...typography.caption,
    color: colors.neutral[500],
    marginTop: 2,
  },
  subtitleRTL: {
    textAlign: 'right',
  },
  autosaveRow: {
    flexDirection: 'row',
    marginTop: spacing.sm,
  },
  autosaveRowRTL: {
    flexDirection: 'row-reverse',
  },
});
