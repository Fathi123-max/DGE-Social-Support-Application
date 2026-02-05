import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import { Check } from 'lucide-react-native';
import { colors, typography, spacing, borderRadius } from '../config/theme';
import { StepSchema } from '../types/form.types';
import { useLocalization } from '../hooks/useLocalization';

interface StepperProps {
  steps: StepSchema[];
  currentStep: number;
  onStepPress?: (stepId: number) => void;
  allowNavigation?: boolean;
}

export function Stepper({
  steps,
  currentStep,
  onStepPress,
  allowNavigation = false,
}: StepperProps) {
  const { locale, isRTL, t } = useLocalization();

  const renderStep = (step: StepSchema, index: number) => {
    const stepNumber = index + 1;
    const isActive = stepNumber === currentStep;
    const isCompleted = stepNumber < currentStep;
    const isClickable = allowNavigation && (isCompleted || isActive);

    const handlePress = () => {
      if (isClickable && onStepPress) {
        onStepPress(stepNumber);
      }
    };

    const circleStyle = useAnimatedStyle(() => ({
      backgroundColor: withTiming(
        isCompleted
          ? colors.success[500]
          : isActive
          ? colors.primary[500]
          : colors.neutral[200],
        { duration: 300 }
      ),
      borderColor: withTiming(
        isCompleted
          ? colors.success[500]
          : isActive
          ? colors.primary[500]
          : colors.neutral[300],
        { duration: 300 }
      ),
    }));

    return (
      <View
        key={step.id}
        style={[styles.stepContainer, isRTL && styles.stepContainerRTL]}
      >
        <TouchableOpacity
          style={styles.stepContent}
          onPress={handlePress}
          disabled={!isClickable}
          accessibilityRole="button"
          accessibilityLabel={t('accessibility.stepIndicator', {
            current: stepNumber,
            total: steps.length,
            title: step.title[locale],
          })}
          accessibilityState={{
            selected: isActive,
            disabled: !isClickable,
          }}
        >
          <Animated.View style={[styles.circle, circleStyle]}>
            {isCompleted ? (
              <Check size={16} color={colors.neutral[0]} strokeWidth={3} />
            ) : (
              <Text
                style={[
                  styles.stepNumber,
                  (isActive || isCompleted) && styles.stepNumberActive,
                ]}
              >
                {stepNumber}
              </Text>
            )}
          </Animated.View>

          <Text
            style={[
              styles.stepTitle,
              isRTL && styles.stepTitleRTL,
              isActive && styles.stepTitleActive,
              isCompleted && styles.stepTitleCompleted,
            ]}
            numberOfLines={2}
          >
            {step.title[locale]}
          </Text>
        </TouchableOpacity>

        {index < steps.length - 1 && (
          <View
            style={[
              styles.connector,
              isRTL && styles.connectorRTL,
              isCompleted && styles.connectorCompleted,
            ]}
          />
        )}
      </View>
    );
  };

  return (
    <View style={[styles.container, isRTL && styles.containerRTL]}>
      {steps.map((step, index) => renderStep(step, index))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.md,
  },
  containerRTL: {
    flexDirection: 'row-reverse',
  },
  stepContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stepContainerRTL: {
    flexDirection: 'row-reverse',
  },
  stepContent: {
    alignItems: 'center',
    flex: 1,
  },
  circle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  stepNumber: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.neutral[500],
  },
  stepNumberActive: {
    color: colors.neutral[0],
  },
  stepTitle: {
    ...typography.caption,
    color: colors.neutral[500],
    textAlign: 'center',
    paddingHorizontal: 2,
  },
  stepTitleRTL: {
    textAlign: 'center',
  },
  stepTitleActive: {
    color: colors.primary[600],
    fontWeight: '600',
  },
  stepTitleCompleted: {
    color: colors.success[600],
  },
  connector: {
    position: 'absolute',
    top: 15,
    left: '50%',
    right: 0,
    height: 2,
    backgroundColor: colors.neutral[200],
    zIndex: -1,
  },
  connectorRTL: {
    left: 0,
    right: '50%',
  },
  connectorCompleted: {
    backgroundColor: colors.success[500],
  },
});
