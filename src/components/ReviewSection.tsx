import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
} from 'react-native-reanimated';
import { ChevronDown, Edit2 } from 'lucide-react-native';
import { colors, typography, spacing, borderRadius } from '../config/theme';
import { StepSchema, FormData } from '../types/form.types';
import { useLocalization } from '../hooks/useLocalization';

interface ReviewSectionProps {
  step: StepSchema;
  formData: FormData;
  onEdit: () => void;
}

export function ReviewSection({ step, formData, onEdit }: ReviewSectionProps) {
  const { locale, isRTL, t } = useLocalization();
  const [isExpanded, setIsExpanded] = useState(true);
  const rotation = useSharedValue(0);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
    rotation.value = withTiming(isExpanded ? -90 : 0, { duration: 200 });
  };

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const getDisplayValue = (key: string, value: unknown): string => {
    if (value === null || value === undefined || value === '') {
      return '-';
    }

    const field = step.fields.find((f) => f.key === key);
    if (field?.options) {
      const option = field.options.find((o) => o.value === value);
      return option?.label[locale] || String(value);
    }

    if (field?.type === 'date' && typeof value === 'string') {
      return new Date(value).toLocaleDateString(
        locale === 'ar' ? 'ar-AE' : 'en-AE',
        { year: 'numeric', month: 'long', day: 'numeric' }
      );
    }

    return String(value);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.header, isRTL && styles.headerRTL]}
        onPress={handleToggle}
        accessibilityRole="button"
        accessibilityState={{ expanded: isExpanded }}
        accessibilityLabel={
          isExpanded
            ? t('accessibility.collapseSection', { section: step.title[locale] })
            : t('accessibility.expandSection', { section: step.title[locale] })
        }
      >
        <View style={[styles.titleRow, isRTL && styles.titleRowRTL]}>
          <Animated.View style={chevronStyle}>
            <ChevronDown size={20} color={colors.neutral[600]} />
          </Animated.View>
          <Text style={[styles.title, isRTL && styles.titleRTL]}>
            {step.title[locale]}
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.editButton, isRTL && styles.editButtonRTL]}
          onPress={onEdit}
          accessibilityRole="button"
          accessibilityLabel={t('review.editSection')}
        >
          <Edit2 size={16} color={colors.primary[500]} />
          <Text style={styles.editText}>{t('common.edit')}</Text>
        </TouchableOpacity>
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.content}>
          {step.fields.map((field) => (
            <View
              key={field.key}
              style={[styles.fieldRow, isRTL && styles.fieldRowRTL]}
            >
              <Text style={[styles.fieldLabel, isRTL && styles.fieldLabelRTL]}>
                {field.label[locale]}
              </Text>
              <Text
                style={[styles.fieldValue, isRTL && styles.fieldValueRTL]}
                numberOfLines={field.type === 'ai-textarea' ? 4 : 1}
              >
                {getDisplayValue(field.key, formData[field.key])}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.neutral[0],
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.neutral[200],
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    backgroundColor: colors.neutral[50],
  },
  headerRTL: {
    flexDirection: 'row-reverse',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    flex: 1,
  },
  titleRowRTL: {
    flexDirection: 'row-reverse',
  },
  title: {
    ...typography.h4,
    color: colors.neutral[800],
  },
  titleRTL: {
    textAlign: 'right',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  editButtonRTL: {
    flexDirection: 'row-reverse',
  },
  editText: {
    ...typography.bodySmall,
    color: colors.primary[500],
    fontWeight: '600',
  },
  content: {
    padding: spacing.md,
  },
  fieldRow: {
    flexDirection: 'row',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[100],
  },
  fieldRowRTL: {
    flexDirection: 'row-reverse',
  },
  fieldLabel: {
    ...typography.bodySmall,
    color: colors.neutral[600],
    flex: 1,
  },
  fieldLabelRTL: {
    textAlign: 'right',
  },
  fieldValue: {
    ...typography.body,
    color: colors.neutral[900],
    flex: 2,
    textAlign: 'right',
  },
  fieldValueRTL: {
    textAlign: 'left',
  },
});
