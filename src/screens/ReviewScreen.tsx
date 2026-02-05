import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CheckSquare, Square } from 'lucide-react-native';
import { colors, typography, spacing, borderRadius } from '../config/theme';
import { FormData, FormSchema } from '../types/form.types';
import { useLocalization } from '../hooks/useLocalization';
import { submissionService } from '../services/submissionService';
import { analyticsService } from '../services/analyticsService';
import { ReviewSection } from '../components/ReviewSection';
import { Button } from '../components/ui/Button';
import { TouchableOpacity } from 'react-native';

interface ReviewScreenProps {
  formData: FormData;
  schema: FormSchema;
  onEditStep: (stepId: number) => void;
  onSubmissionComplete: (referenceId: string) => void;
}

export function ReviewScreen({
  formData,
  schema,
  onEditStep,
  onSubmissionComplete,
}: ReviewScreenProps) {
  const { locale, isRTL, t } = useLocalization();
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const stepsToReview = schema.steps.filter((step) => step.fields.length > 0);

  const handleToggleConfirm = useCallback(() => {
    setIsConfirmed((prev) => !prev);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!isConfirmed || isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await submissionService.submitApplication(formData);

      if (response.success && response.referenceId) {
        onSubmissionComplete(response.referenceId);
      } else {
        setSubmitError(response.error || t('submission.error'));
        analyticsService.trackError('submission', response.error || 'Unknown error');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setSubmitError(t('submission.error'));
      analyticsService.trackError('submission', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }, [isConfirmed, formData, onSubmissionComplete, t]);

  return (
    <View style={styles.container}>
      <Text style={[styles.title, isRTL && styles.titleRTL]}>
        {t('review.title')}
      </Text>
      <Text style={[styles.subtitle, isRTL && styles.subtitleRTL]}>
        {t('review.subtitle')}
      </Text>

      {stepsToReview.map((step) => (
        <ReviewSection
          key={step.id}
          step={step}
          formData={formData}
          onEdit={() => onEditStep(step.id)}
        />
      ))}

      <TouchableOpacity
        style={[styles.confirmRow, isRTL && styles.confirmRowRTL]}
        onPress={handleToggleConfirm}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: isConfirmed }}
        accessibilityLabel={t('review.confirmLabel')}
      >
        {isConfirmed ? (
          <CheckSquare size={24} color={colors.primary[500]} />
        ) : (
          <Square size={24} color={colors.neutral[400]} />
        )}
        <Text style={[styles.confirmText, isRTL && styles.confirmTextRTL]}>
          {t('review.confirmLabel')}
        </Text>
      </TouchableOpacity>

      {submitError && (
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, isRTL && styles.errorTextRTL]}>
            {submitError}
          </Text>
        </View>
      )}

      <Button
        title={isSubmitting ? t('submission.submitting') : t('common.submit')}
        onPress={handleSubmit}
        disabled={!isConfirmed}
        loading={isSubmitting}
        fullWidth
        size="lg"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    ...typography.h2,
    color: colors.neutral[900],
    marginBottom: spacing.xs,
  },
  titleRTL: {
    textAlign: 'right',
  },
  subtitle: {
    ...typography.body,
    color: colors.neutral[600],
    marginBottom: spacing.lg,
  },
  subtitleRTL: {
    textAlign: 'right',
  },
  confirmRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    backgroundColor: colors.neutral[0],
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.neutral[200],
    marginBottom: spacing.lg,
  },
  confirmRowRTL: {
    flexDirection: 'row-reverse',
  },
  confirmText: {
    ...typography.body,
    color: colors.neutral[800],
    flex: 1,
  },
  confirmTextRTL: {
    textAlign: 'right',
  },
  errorContainer: {
    backgroundColor: colors.error[50],
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
  },
  errorText: {
    ...typography.body,
    color: colors.error[600],
  },
  errorTextRTL: {
    textAlign: 'right',
  },
});
