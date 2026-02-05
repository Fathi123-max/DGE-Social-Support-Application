import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { colors, typography, spacing } from '../src/config/theme';
import { useLocalization } from '../src/hooks/useLocalization';

export default function NotFoundScreen() {
  const { t } = useTranslation();
  const { isRTL } = useLocalization();

  return (
    <>
      <Stack.Screen options={{ title: t('notFound.title') }} />
      <View style={styles.container}>
        <Text style={[styles.text, isRTL && styles.textRTL]}>
          {t('notFound.title')}
        </Text>
        <Link href="/" style={styles.link} accessibilityRole="link">
          <Text style={[styles.linkText, isRTL && styles.textRTL]}>
            {t('notFound.goHome')}
          </Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    backgroundColor: colors.neutral[50],
  },
  text: {
    ...typography.h3,
    color: colors.neutral[800],
  },
  textRTL: {
    textAlign: 'center',
  },
  link: {
    marginTop: spacing.md,
    paddingVertical: spacing.md,
  },
  linkText: {
    ...typography.body,
    color: colors.primary[600],
  },
});
