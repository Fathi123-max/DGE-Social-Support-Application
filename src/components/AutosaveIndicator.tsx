import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withDelay,
} from 'react-native-reanimated';
import { Cloud, Check } from 'lucide-react-native';
import { colors, typography, spacing, borderRadius } from '../config/theme';
import { useLocalization } from '../hooks/useLocalization';
import { getTimeAgo } from '../utils/validation';

interface AutosaveIndicatorProps {
  lastSavedAt: Date | null;
}

export function AutosaveIndicator({ lastSavedAt }: AutosaveIndicatorProps) {
  const { locale, isRTL, t } = useLocalization();
  const opacity = useSharedValue(0.7);

  useEffect(() => {
    if (lastSavedAt) {
      opacity.value = withSequence(
        withTiming(1, { duration: 200 }),
        withDelay(1000, withTiming(0.7, { duration: 500 }))
      );
    }
  }, [lastSavedAt]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  if (!lastSavedAt) return null;

  const timeAgo = getTimeAgo(lastSavedAt, locale);

  return (
    <Animated.View style={[styles.container, isRTL && styles.containerRTL, animatedStyle]}>
      <Cloud size={14} color={colors.success[500]} />
      <Check size={10} color={colors.success[500]} style={styles.checkIcon} />
      <Text style={[styles.text, isRTL && styles.textRTL]}>
        {t('autosave.saved')} · {timeAgo}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.success[50],
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    gap: spacing.xs,
  },
  containerRTL: {
    flexDirection: 'row-reverse',
  },
  checkIcon: {
    marginLeft: -8,
    marginTop: 4,
  },
  text: {
    ...typography.caption,
    color: colors.success[700],
  },
  textRTL: {
    textAlign: 'right',
  },
});
