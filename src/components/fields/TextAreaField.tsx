import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Platform,
} from 'react-native';
import { colors, typography, spacing, borderRadius } from '../../config/theme';
import { FieldSchema } from '../../types/form.types';
import { useLocalization } from '../../hooks/useLocalization';

interface TextAreaFieldProps {
  field: FieldSchema;
  value: string;
  error?: string | null;
  onChangeText: (value: string) => void;
  onBlur?: () => void;
}

export function TextAreaField({
  field,
  value,
  error,
  onChangeText,
  onBlur,
}: TextAreaFieldProps) {
  const { locale, isRTL, t } = useLocalization();
  const [isFocused, setIsFocused] = useState(false);

  const label = field.label[locale];
  const placeholder = field.placeholder?.[locale] || '';
  const maxLength = field.maxLength || 1000;
  const currentLength = value?.length || 0;

  const handleFocus = useCallback(() => setIsFocused(true), []);
  const handleBlur = useCallback(() => {
    setIsFocused(false);
    onBlur?.();
  }, [onBlur]);

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
    marginBottom: spacing.xs,
  },
  labelRowRTL: {
    flexDirection: 'row-reverse',
  },
  label: {
    ...typography.label,
    color: colors.neutral[800],
  },
  labelRTL: {
    textAlign: 'right',
  },
  required: {
    color: colors.error[500],
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
    minHeight: 120,
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
