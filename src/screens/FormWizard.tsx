import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ActivityIndicator,
  Text,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing } from '../config/theme';
import { formSchema } from '../config/formSchema';
import { useFormState } from '../hooks/useFormState';
import { useLocalization } from '../hooks/useLocalization';
import { analyticsService } from '../services/analyticsService';
import { Header } from '../components/Header';
import { Stepper } from '../components/Stepper';
import { FormRenderer } from '../components/FormRenderer';
import { ReviewScreen } from './ReviewScreen';
import { ConfirmationScreen } from './ConfirmationScreen';
import { PrivacyNotice } from '../components/PrivacyNotice';
import { Button } from '../components/ui/Button';

export function FormWizard() {
  const insets = useSafeAreaInsets();
  const { locale, isRTL, t } = useLocalization();

  const {
    formData,
    errors,
    currentStep,
    lastSavedAt,
    isRestoring,
    setFieldValue,
    setFieldTouched,
    validateStep,
    goToStep,
    nextStep,
    prevStep,
    resetForm,
    getFieldError,
  } = useFormState(formSchema);

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [referenceId, setReferenceId] = useState<string | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    analyticsService.trackStepViewed(currentStep, formSchema.steps[currentStep - 1]?.key || '');
  }, [currentStep]);

  const currentStepData = formSchema.steps[currentStep - 1];
  const totalSteps = formSchema.steps.length;
  const isReviewStep = currentStep === totalSteps;

  const handleNext = useCallback(() => {
    if (currentStepData && !isReviewStep) {
      const isValid = validateStep(currentStepData.fields);
      if (isValid) {
        nextStep(totalSteps);
      }
    }
  }, [currentStepData, isReviewStep, validateStep, nextStep, totalSteps]);

  const handleBack = useCallback(() => {
    prevStep();
  }, [prevStep]);

  const handleEditStep = useCallback(
    (stepId: number) => {
      goToStep(stepId);
    },
    [goToStep]
  );

  const handleSubmissionComplete = useCallback((refId: string) => {
    setReferenceId(refId);
    setIsSubmitted(true);
    analyticsService.trackFormSubmitted(refId);
  }, []);

  const handleStartNew = useCallback(async () => {
    await resetForm();
    setIsSubmitted(false);
    setReferenceId(null);
  }, [resetForm]);

  if (isRestoring) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary[500]} />
        <Text style={styles.loadingText}>{t('autosave.restoring')}</Text>
      </View>
    );
  }

  if (isSubmitted && referenceId) {
    return (
      <ConfirmationScreen
        referenceId={referenceId}
        onStartNew={handleStartNew}
      />
    );
  }

  return (
    <View style={styles.container}>
      <Header lastSavedAt={lastSavedAt} />

      <Stepper
        steps={formSchema.steps}
        currentStep={currentStep}
        onStepPress={handleEditStep}
        allowNavigation
      />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + 100 },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {currentStep === 1 && <PrivacyNotice />}

          {currentStepData && !isReviewStep && (
            <>
              <Text style={[styles.stepTitle, isRTL && styles.stepTitleRTL]}>
                {currentStepData.title[locale]}
              </Text>
              {currentStepData.description && (
                <Text style={[styles.stepDescription, isRTL && styles.stepDescriptionRTL]}>
                  {currentStepData.description[locale]}
                </Text>
              )}

              <FormRenderer
                fields={currentStepData.fields}
                formData={formData}
                errors={errors}
                onFieldChange={setFieldValue}
                onFieldBlur={setFieldTouched}
                getFieldError={getFieldError}
              />
            </>
          )}

          {isReviewStep && (
            <ReviewScreen
              formData={formData}
              schema={formSchema}
              onEditStep={handleEditStep}
              onSubmissionComplete={handleSubmissionComplete}
            />
          )}
        </ScrollView>

        {!isReviewStep && (
          <View
            style={[
              styles.footer,
              isRTL && styles.footerRTL,
              { paddingBottom: insets.bottom + spacing.md },
            ]}
          >
            {currentStep > 1 && (
              <Button
                title={t('common.back')}
                variant="outline"
                onPress={handleBack}
                style={styles.backButton}
              />
            )}
            <Button
              title={t('common.next')}
              onPress={handleNext}
              style={currentStep > 1 ? styles.nextButton : styles.fullButton}
            />
          </View>
        )}
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral[50],
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.neutral[50],
  },
  loadingText: {
    marginTop: spacing.md,
    color: colors.neutral[600],
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
  },
  stepTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: colors.neutral[900],
    marginBottom: spacing.xs,
  },
  stepTitleRTL: {
    textAlign: 'right',
  },
  stepDescription: {
    fontSize: 14,
    color: colors.neutral[600],
    marginBottom: spacing.lg,
  },
  stepDescriptionRTL: {
    textAlign: 'right',
  },
  footer: {
    flexDirection: 'row',
    padding: spacing.md,
    backgroundColor: colors.neutral[0],
    borderTopWidth: 1,
    borderTopColor: colors.neutral[200],
    gap: spacing.sm,
  },
  footerRTL: {
    flexDirection: 'row-reverse',
  },
  backButton: {
    flex: 1,
  },
  nextButton: {
    flex: 2,
  },
  fullButton: {
    flex: 1,
  },
});
