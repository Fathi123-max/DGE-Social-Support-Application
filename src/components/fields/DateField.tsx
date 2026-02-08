import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  StyleSheet,
  Platform,
} from 'react-native';
import { Calendar } from 'lucide-react-native';
import { colors, typography, spacing, borderRadius, shadows } from '../../config/theme';
import { FieldSchema } from '../../types/form.types';
import { useLocalization } from '../../hooks/useLocalization';
import { Button } from '../ui/Button';

interface DateFieldProps {
  field: FieldSchema;
  value: string;
  error?: string | null;
  onValueChange: (value: string) => void;
  onBlur?: () => void;
}

export function DateField({
  field,
  value,
  error,
  onValueChange,
  onBlur,
}: DateFieldProps) {
  const { locale, isRTL, t } = useLocalization();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState(
    value ? new Date(value).getFullYear() : new Date().getFullYear() - 25
  );
  const [selectedMonth, setSelectedMonth] = useState(
    value ? new Date(value).getMonth() : 0
  );
  const [selectedDay, setSelectedDay] = useState(
    value ? new Date(value).getDate() : 1
  );

  const label = field.label[locale];
  const placeholder = field.placeholder?.[locale] || '';

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);
  const months = Array.from({ length: 12 }, (_, i) => i);
  const maxDay = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  const days = Array.from({ length: maxDay }, (_, i) => i + 1);

  useEffect(() => {
    if (selectedDay > maxDay) {
      setSelectedDay(maxDay);
    }
  }, [selectedMonth, selectedYear, maxDay, selectedDay]);

  const monthNames = locale === 'ar'
    ? ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر']
    : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const formatDate = (dateStr: string): string => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleDateString(locale === 'ar' ? 'ar-AE' : 'en-AE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleOpen = useCallback(() => setIsOpen(true), []);
  const handleClose = useCallback(() => {
    setIsOpen(false);
    onBlur?.();
  }, [onBlur]);

  const handleConfirm = useCallback(() => {
    const clampedDay = Math.min(selectedDay, new Date(selectedYear, selectedMonth + 1, 0).getDate());
    const date = new Date(selectedYear, selectedMonth, clampedDay);
    onValueChange(date.toISOString().split('T')[0]);
    handleClose();
  }, [selectedYear, selectedMonth, selectedDay, onValueChange, handleClose]);

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
        accessibilityRole="button"
        accessibilityLabel={`${label}${field.required ? `, ${t('common.required')}` : ''}`}
        accessibilityHint={value ? formatDate(value) : placeholder}
      >
        <Text
          style={[
            styles.selectorText,
            isRTL && styles.selectorTextRTL,
            !value && styles.placeholderText,
          ]}
        >
          {value ? formatDate(value) : placeholder}
        </Text>
        <Calendar size={20} color={colors.neutral[500]} />
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
          <View
            style={styles.modalContent}
            onStartShouldSetResponder={() => true}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, isRTL && styles.modalTitleRTL]}>
                {label}
              </Text>
            </View>

            <View style={[styles.pickerRow, isRTL && styles.pickerRowRTL]}>
              <View style={styles.pickerColumn}>
                <Text style={styles.pickerLabel}>
                  {t('datePicker.day')}
                </Text>
                <ScrollView style={styles.pickerScrollContainer} showsVerticalScrollIndicator={false}>
                  {days.map((day) => (
                    <TouchableOpacity
                      key={day}
                      style={[
                        styles.pickerItem,
                        selectedDay === day && styles.pickerItemSelected,
                      ]}
                      onPress={() => setSelectedDay(day)}
                    >
                      <Text
                        style={[
                          styles.pickerItemText,
                          selectedDay === day && styles.pickerItemTextSelected,
                        ]}
                      >
                        {day}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <View style={styles.pickerColumn}>
                <Text style={styles.pickerLabel}>
                  {t('datePicker.month')}
                </Text>
                <ScrollView style={styles.pickerScrollContainer} showsVerticalScrollIndicator={false}>
                  {months.map((month) => (
                    <TouchableOpacity
                      key={month}
                      style={[
                        styles.pickerItem,
                        selectedMonth === month && styles.pickerItemSelected,
                      ]}
                      onPress={() => setSelectedMonth(month)}
                    >
                      <Text
                        style={[
                          styles.pickerItemText,
                          selectedMonth === month && styles.pickerItemTextSelected,
                        ]}
                      >
                        {monthNames[month]}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <View style={styles.pickerColumn}>
                <Text style={styles.pickerLabel}>
                  {t('datePicker.year')}
                </Text>
                <ScrollView style={styles.pickerScrollContainer} showsVerticalScrollIndicator={false}>
                  {years.slice(0, 80).map((year) => (
                    <TouchableOpacity
                      key={year}
                      style={[
                        styles.pickerItem,
                        selectedYear === year && styles.pickerItemSelected,
                      ]}
                      onPress={() => setSelectedYear(year)}
                    >
                      <Text
                        style={[
                          styles.pickerItemText,
                          selectedYear === year && styles.pickerItemTextSelected,
                        ]}
                      >
                        {year}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>

            <View style={styles.modalFooter}>
              <Button
                title={t('common.cancel')}
                variant="outline"
                onPress={handleClose}
                style={styles.footerButton}
              />
              <Button
                title={t('common.confirm')}
                onPress={handleConfirm}
                style={styles.footerButton}
              />
            </View>
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
    paddingVertical: 0,
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
    fontSize: 16,
    fontWeight: '500',
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
  pickerRow: {
    flexDirection: 'row',
    padding: spacing.md,
  },
  pickerRowRTL: {
    flexDirection: 'row-reverse',
  },
  pickerColumn: {
    flex: 1,
    marginHorizontal: spacing.xs,
  },
  pickerLabel: {
    ...typography.caption,
    color: colors.neutral[600],
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  pickerScrollContainer: {
    height: 150,
  },
  pickerItem: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    borderRadius: borderRadius.sm,
    alignItems: 'center',
  },
  pickerItemSelected: {
    backgroundColor: colors.primary[100],
  },
  pickerItemText: {
    ...typography.body,
    color: colors.neutral[700],
  },
  pickerItemTextSelected: {
    color: colors.primary[600],
    fontWeight: '600',
  },
  modalFooter: {
    flexDirection: 'row',
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.neutral[200],
    gap: spacing.sm,
  },
  footerButton: {
    flex: 1,
  },
});
