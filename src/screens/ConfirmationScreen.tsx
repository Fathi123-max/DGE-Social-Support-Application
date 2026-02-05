import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withSequence,
} from 'react-native-reanimated';
import { CheckCircle, Copy } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import { colors, typography, spacing, borderRadius } from '../config/theme';
import { useLocalization } from '../hooks/useLocalization';
import { Button } from '../components/ui/Button';
import { localStorageService } from '../services/localStorageService';
import { TouchableOpacity } from 'react-native';

interface ConfirmationScreenProps {
  referenceId: string;
  onStartNew: () => void;
}

export function ConfirmationScreen({
  referenceId,
  onStartNew,
}: ConfirmationScreenProps) {
  const insets = useSafeAreaInsets();
  const { isRTL, t } = useLocalization();

  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withDelay(200, withSpring(1, { damping: 12 }));
    opacity.value = withDelay(400, withSpring(1));

    localStorageService.clearFormData();
  }, []);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const contentStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const handleCopyReference = async () => {
    await Clipboard.setStringAsync(referenceId);
  };

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top + spacing.xxl, paddingBottom: insets.bottom + spacing.lg },
      ]}
    >
      <View style={styles.content}>
        <Animated.View style={[styles.iconContainer, iconStyle]}>
          <CheckCircle
            size={80}
            color={colors.success[500]}
            strokeWidth={1.5}
          />
        </Animated.View>

        <Animated.View style={[styles.textContainer, contentStyle]}>
          <Text style={[styles.title, isRTL && styles.titleRTL]}>
            {t('submission.success')}
          </Text>

          <Text style={[styles.label, isRTL && styles.labelRTL]}>
            {t('submission.referenceId')}
          </Text>

          <TouchableOpacity
            style={[styles.referenceBox, isRTL && styles.referenceBoxRTL]}
            onPress={handleCopyReference}
            accessibilityRole="button"
            accessibilityLabel={`${t('submission.referenceId')}: ${referenceId}. Tap to copy.`}
          >
            <Text style={styles.referenceText}>{referenceId}</Text>
            <Copy size={20} color={colors.primary[500]} />
          </TouchableOpacity>

          <Text style={[styles.saveNote, isRTL && styles.saveNoteRTL]}>
            {t('submission.saveReference')}
          </Text>

          <View style={styles.divider} />

          <Text style={[styles.sectionTitle, isRTL && styles.sectionTitleRTL]}>
            {t('submission.whatNext')}
          </Text>
          <Text style={[styles.nextSteps, isRTL && styles.nextStepsRTL]}>
            {t('submission.nextSteps')}
          </Text>
        </Animated.View>
      </View>

      <Animated.View style={contentStyle}>
        <Button
          title={t('submission.startNew')}
          variant="outline"
          onPress={onStartNew}
          fullWidth
          size="lg"
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral[50],
    padding: spacing.lg,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginBottom: spacing.xl,
  },
  textContainer: {
    width: '100%',
    alignItems: 'center',
  },
  title: {
    ...typography.h2,
    color: colors.success[600],
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  titleRTL: {
    textAlign: 'center',
  },
  label: {
    ...typography.label,
    color: colors.neutral[600],
    marginBottom: spacing.sm,
  },
  labelRTL: {
    textAlign: 'center',
  },
  referenceBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary[50],
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.primary[200],
    borderStyle: 'dashed',
    marginBottom: spacing.sm,
  },
  referenceBoxRTL: {
    flexDirection: 'row-reverse',
  },
  referenceText: {
    ...typography.h3,
    color: colors.primary[600],
    fontFamily: 'monospace',
    letterSpacing: 1,
  },
  saveNote: {
    ...typography.caption,
    color: colors.neutral[500],
    marginBottom: spacing.xl,
  },
  saveNoteRTL: {
    textAlign: 'center',
  },
  divider: {
    width: '60%',
    height: 1,
    backgroundColor: colors.neutral[200],
    marginVertical: spacing.lg,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.neutral[800],
    marginBottom: spacing.sm,
  },
  sectionTitleRTL: {
    textAlign: 'center',
  },
  nextSteps: {
    ...typography.body,
    color: colors.neutral[600],
    textAlign: 'center',
    lineHeight: 24,
  },
  nextStepsRTL: {
    textAlign: 'center',
  },
});
