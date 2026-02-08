import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Sparkles } from 'lucide-react-native';
import { colors, typography, spacing, borderRadius } from '../../config/theme';
import { FieldSchema, FormData } from '../../types/form.types';
import { useLocalization } from '../../hooks/useLocalization';
import { AIAssistModal } from '../AIAssistModal';

interface AITextAreaFieldProps {
  field: FieldSchema;
  value: string;
  error?: string | null;
  formData: FormData;
  onChangeText: (value: string) => void;
  onBlur?: () => void;
}

export function AITextAreaField({
  field,
  value,
  error,
  formData,
  onChangeText,
  onBlur,
}: AITextAreaFieldProps) {
  const { locale, isRTL, t } = useLocalization();
  const [isFocused, setIsFocused] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);

  const label = field.label[locale];
  const placeholder = field.placeholder?.[locale] || '';
  const maxLength = field.maxLength || 1000;
  const currentLength = value?.length || 0;

  const handleFocus = useCallback(() => setIsFocused(true), []);
  const handleBlur = useCallback(() => {
    setIsFocused(false);
    onBlur?.();
  }, [onBlur]);

  const handleOpenAI = useCallback(() => setShowAIModal(true), []);
  const handleCloseAI = useCallback(() => setShowAIModal(false), []);

  const handleAcceptAI = useCallback(
    (text: string) => {
      onChangeText(text);
      setShowAIModal(false);
    },
    [onChangeText]
  );

  const inputStyle = [
    styles.input,
    isRTL && styles.inputRTL,
    isFocused && styles.inputFocused,
    error && styles.inputError,
  ];

  return (
    <View style={styles.container}>
      <View style={[styles.labelRow, isRTL && styles.labelRowRTL]}>
        <Text style={[styles.label, isRTL && styles.labelRTL]}>
          {label}
          {field.required && <Text style={styles.required}> *</Text>}
        </Text>
        <TouchableOpacity
          style={[styles.aiButton, isRTL && styles.aiButtonRTL]}
          onPress={handleOpenAI}
          accessibilityRole="button"
          accessibilityLabel={t('ai.helpMeWrite')}
          accessibilityHint={t('accessibility.helpMeWriteButton')}
        >
          <Sparkles size={16} color={colors.secondary[500]} />
          <Text style={styles.aiButtonText}>{t('ai.helpMeWrite')}</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={[
          inputStyle,
          { paddingVertical: 12 },
        ]}
        value={value}
        onChangeText={onChangeText}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        placeholderTextColor={colors.neutral[400]}
        multiline
        numberOfLines={5}
        maxLength={maxLength}
        textAlignVertical="top"
        textAlign={isRTL ? 'right' : 'left'}
        accessibilityLabel={`${label}${field.required ? `, ${t('common.required')}` : ''}`}
        accessibilityHint={`${currentLength} ${t('common.of')} ${maxLength} ${t('common.characters')}`}
      />

      <View style={[styles.footer, isRTL && styles.footerRTL]}>
        {field.helpText && !error ? (
          <Text style={[styles.helpText, isRTL && styles.helpTextRTL]}>
            {field.helpText[locale]}
          </Text>
        ) : error ? (
          <Text style={[styles.errorText, isRTL && styles.errorTextRTL]}>
            {error}
          </Text>
        ) : (
          <View />
        )}

        <Text
          style={[
            styles.charCount,
            currentLength > maxLength * 0.9 && styles.charCountWarning,
          ]}
        >
          {currentLength}/{maxLength}
        </Text>
      </View>

      <AIAssistModal
        visible={showAIModal}
        fieldKey={field.key}
        fieldLabel={label}
        currentValue={value}
        context={{
          employmentStatus: formData.employmentStatus as string,
          monthlyIncome: formData.monthlyIncome?.toString(),
          dependents: formData.dependents?.toString(),
          maritalStatus: formData.maritalStatus as string,
          housingStatus: formData.housingStatus as string,
        }}
        onAccept={handleAcceptAI}
        onClose={handleCloseAI}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  labelRowRTL: {
    flexDirection: 'row-reverse',
  },
  label: {
    ...typography.label,
    color: colors.neutral[800],
    flex: 1,
  },
  labelRTL: {
    textAlign: 'right',
  },
  required: {
    color: colors.error[500],
  },
  aiButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondary[50],
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    gap: spacing.xs,
  },
  aiButtonRTL: {
    flexDirection: 'row-reverse',
  },
  aiButtonText: {
    ...typography.caption,
    color: colors.secondary[600],
    fontWeight: '600',
  },
  input: {
    backgroundColor: colors.neutral[50],
    borderWidth: 1,
    borderColor: colors.neutral[300],
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    ...typography.body,
    fontSize: 16,
    fontWeight: '500',
    color: colors.neutral[900],
    minHeight: 140,
    textAlignVertical: 'top',
  },
  inputRTL: {
    textAlign: 'right',
  },
  inputFocused: {
    borderColor: colors.primary[500],
    borderWidth: 2,
    backgroundColor: colors.neutral[0],
  },
  inputError: {
    borderColor: colors.error[500],
    backgroundColor: colors.error[50],
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  footerRTL: {
    flexDirection: 'row-reverse',
  },
  helpText: {
    ...typography.caption,
    color: colors.neutral[600],
    flex: 1,
  },
  helpTextRTL: {
    textAlign: 'right',
  },
  errorText: {
    ...typography.caption,
    color: colors.error[500],
    flex: 1,
  },
  errorTextRTL: {
    textAlign: 'right',
  },
  charCount: {
    ...typography.caption,
    color: colors.neutral[500],
  },
  charCountWarning: {
    color: colors.warning[600],
  },
});
