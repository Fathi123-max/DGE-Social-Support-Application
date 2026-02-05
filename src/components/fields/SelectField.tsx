import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  Platform,
} from 'react-native';
import { ChevronDown, Check } from 'lucide-react-native';
import { colors, typography, spacing, borderRadius, shadows } from '../../config/theme';
import { FieldSchema, SelectOption } from '../../types/form.types';
import { useLocalization } from '../../hooks/useLocalization';

interface SelectFieldProps {
  field: FieldSchema;
  value: string;
  error?: string | null;
  onValueChange: (value: string) => void;
  onBlur?: () => void;
}

export function SelectField({
  field,
  value,
  error,
  onValueChange,
  onBlur,
}: SelectFieldProps) {
  const { locale, isRTL, t } = useLocalization();
  const [isOpen, setIsOpen] = useState(false);

  const label = field.label[locale];
  const placeholder = field.placeholder?.[locale] || t('common.select');
  const options = field.options || [];

  const selectedOption = options.find((opt) => opt.value === value);
  const displayValue = selectedOption?.label[locale] || '';

  const handleOpen = useCallback(() => setIsOpen(true), []);
  const handleClose = useCallback(() => {
    setIsOpen(false);
    onBlur?.();
  }, [onBlur]);

  const handleSelect = useCallback(
    (option: SelectOption) => {
      onValueChange(option.value);
      handleClose();
    },
    [onValueChange, handleClose]
  );

  const renderOption = useCallback(
    ({ item }: { item: SelectOption }) => {
      const isSelected = item.value === value;
      return (
        <TouchableOpacity
          style={[styles.option, isSelected && styles.optionSelected]}
          onPress={() => handleSelect(item)}
          accessibilityRole="menuitem"
          accessibilityState={{ selected: isSelected }}
        >
          <Text
            style={[
              styles.optionText,
              isRTL && styles.optionTextRTL,
              isSelected && styles.optionTextSelected,
            ]}
          >
            {item.label[locale]}
          </Text>
          {isSelected && (
            <Check size={20} color={colors.primary[500]} />
          )}
        </TouchableOpacity>
      );
    },
    [value, locale, isRTL, handleSelect]
  );

  return (
    <View style={styles.container}>
      <View style={[styles.labelRow, isRTL && styles.labelRowRTL]}>
        <Text style={[styles.label, isRTL && styles.labelRTL]}>
          {label}
          {field.required && <Text style={styles.required}> *</Text>}
        </Text>
      </View>

      <TouchableOpacity
        style={[
          styles.selector,
          isRTL && styles.selectorRTL,
          error && styles.selectorError,
        ]}
        onPress={handleOpen}
        accessibilityRole="combobox"
        accessibilityLabel={`${label}${field.required ? `, ${t('common.required')}` : ''}`}
        accessibilityHint={displayValue || placeholder}
        accessibilityState={{ expanded: isOpen }}
      >
        <Text
          style={[
            styles.selectorText,
            isRTL && styles.selectorTextRTL,
            !displayValue && styles.placeholderText,
          ]}
        >
          {displayValue || placeholder}
        </Text>
        <ChevronDown size={20} color={colors.neutral[500]} />
      </TouchableOpacity>

      {error && (
        <Text style={[styles.errorText, isRTL && styles.errorTextRTL]}>
          {error}
        </Text>
      )}

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={handleClose}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={handleClose}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, isRTL && styles.modalTitleRTL]}>
                {label}
              </Text>
            </View>
            <FlatList
              data={options}
              renderItem={renderOption}
              keyExtractor={(item) => item.value}
              style={styles.optionsList}
            />
          </View>
        </TouchableOpacity>
      </Modal>
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
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.neutral[50],
    borderWidth: 1,
    borderColor: colors.neutral[300],
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: Platform.OS === 'ios' ? spacing.md : spacing.sm,
    minHeight: 48,
  },
  selectorRTL: {
    flexDirection: 'row-reverse',
  },
  selectorError: {
    borderColor: colors.error[500],
    backgroundColor: colors.error[50],
  },
  selectorText: {
    ...typography.body,
    color: colors.neutral[900],
    flex: 1,
  },
  selectorTextRTL: {
    textAlign: 'right',
  },
  placeholderText: {
    color: colors.neutral[400],
  },
  errorText: {
    ...typography.caption,
    color: colors.error[500],
    marginTop: spacing.xs,
  },
  errorTextRTL: {
    textAlign: 'right',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalContent: {
    backgroundColor: colors.neutral[0],
    borderRadius: borderRadius.lg,
    width: '100%',
    maxWidth: 400,
    maxHeight: '70%',
    ...shadows.lg,
  },
  modalHeader: {
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  modalTitle: {
    ...typography.h4,
    color: colors.neutral[900],
  },
  modalTitleRTL: {
    textAlign: 'right',
  },
  optionsList: {
    maxHeight: 300,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[100],
  },
  optionSelected: {
    backgroundColor: colors.primary[50],
  },
  optionText: {
    ...typography.body,
    color: colors.neutral[800],
    flex: 1,
  },
  optionTextRTL: {
    textAlign: 'right',
  },
  optionTextSelected: {
    color: colors.primary[600],
    fontWeight: '600',
  },
});
