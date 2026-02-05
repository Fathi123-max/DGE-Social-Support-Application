import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
  Platform,
} from 'react-native';
import { colors, typography, spacing, borderRadius } from '../../config/theme';
import { FieldSchema, KeyboardType } from '../../types/form.types';
import { useLocalization } from '../../hooks/useLocalization';

interface TextFieldProps {
  field: FieldSchema;
  value: string;
  error?: string | null;
  onChangeText: (value: string) => void;
  onBlur?: () => void;
}

const keyboardTypeMap: Record<KeyboardType, TextInputProps['keyboardType']> = {
  default: 'default',
  'email-address': 'email-address',
  numeric: 'numeric',
  'phone-pad': 'phone-pad',
  'decimal-pad': 'decimal-pad',
};

export function TextField({
  field,
  value,
  error,
  onChangeText,
  onBlur,
}: TextFieldProps) {
  const { locale, isRTL } = useLocalization();
  const [isFocused, setIsFocused] = useState(false);

  const label = field.label[locale];
  const placeholder = field.placeholder?.[locale] || '';

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
        style={inputStyle}
        value={value}
        onChangeText={onChangeText}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        placeholderTextColor={colors.neutral[400]}
        keyboardType={keyboardTypeMap[field.keyboardType || 'default']}
        maxLength={field.maxLength}
        autoCapitalize={field.type === 'email' ? 'none' : 'sentences'}
        autoCorrect={false}
        textAlign={isRTL ? 'right' : 'left'}
        accessibilityLabel={`${label}${field.required ? ', required' : ''}`}
        accessibilityHint={placeholder}
        accessibilityState={{ disabled: false }}
      />

      {field.helpText && !error && (
        <Text style={[styles.helpText, isRTL && styles.helpTextRTL]}>
          {field.helpText[locale]}
        </Text>
      )}

      {error && (
        <Text style={[styles.errorText, isRTL && styles.errorTextRTL]}>
          {error}
        </Text>
      )}
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
    paddingVertical: Platform.OS === 'ios' ? spacing.md : spacing.sm,
    ...typography.body,
    color: colors.neutral[900],
    minHeight: 48,
  },
  inputRTL: {
    textAlign: 'right',
  },
  inputFocused: {
    borderColor: colors.primary[500],
    backgroundColor: colors.neutral[0],
  },
  inputError: {
    borderColor: colors.error[500],
    backgroundColor: colors.error[50],
  },
  helpText: {
    ...typography.caption,
    color: colors.neutral[600],
    marginTop: spacing.xs,
  },
  helpTextRTL: {
    textAlign: 'right',
  },
  errorText: {
    ...typography.caption,
    color: colors.error[500],
    marginTop: spacing.xs,
  },
  errorTextRTL: {
    textAlign: 'right',
  },
});
