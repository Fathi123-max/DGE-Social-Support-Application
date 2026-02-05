import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Sparkles, X, RefreshCw, AlertCircle } from 'lucide-react-native';
import { colors, typography, spacing, borderRadius, shadows } from '../config/theme';
import { aiTones } from '../config/formSchema';
import { openaiService } from '../services/openaiService';
import { analyticsService } from '../services/analyticsService';
import { useLocalization } from '../hooks/useLocalization';
import { Button } from './ui/Button';

interface AIAssistModalProps {
  visible: boolean;
  fieldKey: string;
  fieldLabel: string;
  currentValue?: string;
  context: {
    employmentStatus?: string;
    monthlyIncome?: string;
    dependents?: string;
    maritalStatus?: string;
    housingStatus?: string;
  };
  onAccept: (text: string) => void;
  onClose: () => void;
}

export function AIAssistModal({
  visible,
  fieldKey,
  fieldLabel,
  currentValue,
  context,
  onAccept,
  onClose,
}: AIAssistModalProps) {
  const { locale, isRTL, t } = useLocalization();
  const [selectedTone, setSelectedTone] = useState('detailed');
  const [generatedText, setGeneratedText] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (isLoading) return;
    setIsLoading(true);
    setError(null);
    analyticsService.trackAIAssist('opened', fieldKey, selectedTone);

    try {
      const response = await openaiService.generateText(
        {
          fieldKey,
          tone: selectedTone,
          context: {
            ...context,
            currentValue,
          },
        },
        locale
      );

      if (response.success && response.text) {
        setGeneratedText(response.text);
        analyticsService.trackAIAssist('generated', fieldKey, selectedTone);
      } else {
        let errorMessage = t('ai.error');
        if (response.error) {
          if (response.error.includes('timed out') || response.error.includes('timeout')) {
            errorMessage = t('ai.timeout');
          } else if (response.error.includes('network') || response.error.includes('Network')) {
            errorMessage = t('ai.networkError');
          } else if (response.error.includes('API key') || response.error.includes('not configured')) {
            errorMessage = t('ai.notConfigured');
          }
        }
        setError(errorMessage);
        analyticsService.trackAIAssist('error', fieldKey, selectedTone, response.error);
      }
    } catch (err) {
      setError(t('ai.error'));
      analyticsService.trackAIAssist('error', fieldKey, selectedTone, err instanceof Error ? err.message : 'Unknown');
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, fieldKey, selectedTone, context, currentValue, locale, t]);

  const handleAccept = useCallback(() => {
    onAccept(generatedText);
    analyticsService.trackAIAssist('accepted', fieldKey, selectedTone);
    resetState();
  }, [generatedText, onAccept, fieldKey, selectedTone]);

  const handleEdit = useCallback(() => {
    setIsEditing(true);
    analyticsService.trackAIAssist('edited', fieldKey, selectedTone);
  }, [fieldKey, selectedTone]);

  const handleDiscard = useCallback(() => {
    analyticsService.trackAIAssist('discarded', fieldKey, selectedTone);
    resetState();
    onClose();
  }, [fieldKey, selectedTone, onClose]);

  const resetState = () => {
    setGeneratedText('');
    setIsEditing(false);
    setError(null);
    setSelectedTone('detailed');
  };

  const handleClose = useCallback(() => {
    resetState();
    onClose();
  }, [onClose]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <View style={[styles.header, isRTL && styles.headerRTL]}>
            <View style={[styles.titleRow, isRTL && styles.titleRowRTL]}>
              <Sparkles size={24} color={colors.secondary[500]} />
              <Text style={styles.title}>{t('ai.helpMeWrite')}</Text>
            </View>
            <TouchableOpacity
              onPress={handleClose}
              accessibilityRole="button"
              accessibilityLabel={t('common.close')}
            >
              <X size={24} color={colors.neutral[600]} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            <Text style={[styles.fieldLabel, isRTL && styles.fieldLabelRTL]}>
              {fieldLabel}
            </Text>

            {!generatedText && !isLoading && (
              <>
                <Text style={[styles.sectionTitle, isRTL && styles.sectionTitleRTL]}>
                  {t('ai.selectTone')}
                </Text>
                <View style={[styles.tonesContainer, isRTL && styles.tonesContainerRTL]}>
                  {aiTones.map((tone) => (
                    <TouchableOpacity
                      key={tone.id}
                      style={[
                        styles.toneButton,
                        selectedTone === tone.id && styles.toneButtonSelected,
                      ]}
                      onPress={() => setSelectedTone(tone.id)}
                      accessibilityRole="radio"
                      accessibilityState={{ selected: selectedTone === tone.id }}
                    >
                      <Text
                        style={[
                          styles.toneButtonText,
                          selectedTone === tone.id && styles.toneButtonTextSelected,
                        ]}
                      >
                        {tone.label[locale]}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}

            {isLoading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary[500]} />
                <Text style={styles.loadingText}>{t('ai.generating')}</Text>
              </View>
            )}

            {error && (
              <View style={styles.errorContainer}>
                <AlertCircle size={24} color={colors.error[500]} />
                <Text style={[styles.errorText, isRTL && styles.errorTextRTL]}>
                  {error}
                </Text>
                <Button
                  title={t('common.retry')}
                  variant="outline"
                  size="sm"
                  onPress={handleGenerate}
                />
              </View>
            )}

            {generatedText && !isLoading && (
              <View style={styles.resultContainer}>
                {isEditing ? (
                  <TextInput
                    style={[styles.editInput, isRTL && styles.editInputRTL]}
                    value={generatedText}
                    onChangeText={setGeneratedText}
                    multiline
                    numberOfLines={6}
                    textAlignVertical="top"
                    textAlign={isRTL ? 'right' : 'left'}
                  />
                ) : (
                  <View style={styles.generatedTextContainer}>
                    <Text style={[styles.generatedText, isRTL && styles.generatedTextRTL]}>
                      {generatedText}
                    </Text>
                  </View>
                )}
              </View>
            )}
          </ScrollView>

          <View style={styles.footer}>
            {!generatedText && !isLoading && (
              <Button
                title={t('ai.helpMeWrite')}
                onPress={handleGenerate}
                fullWidth
                disabled={!openaiService.isConfigured()}
              />
            )}

            {generatedText && !isLoading && (
              <View style={[styles.actionButtons, isRTL && styles.actionButtonsRTL]}>
                <Button
                  title={t('ai.discard')}
                  variant="ghost"
                  onPress={handleDiscard}
                  style={styles.actionButton}
                />
                {!isEditing && (
                  <Button
                    title={t('ai.editText')}
                    variant="outline"
                    onPress={handleEdit}
                    style={styles.actionButton}
                  />
                )}
                <Button
                  title={t('ai.accept')}
                  onPress={handleAccept}
                  style={styles.actionButton}
                />
              </View>
            )}

            {!openaiService.isConfigured() && !generatedText && !isLoading && (
              <Text style={styles.notConfiguredText}>
                {t('ai.notConfigured')}
              </Text>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
  },
  modalContent: {
    backgroundColor: colors.neutral[0],
    borderRadius: borderRadius.lg,
    width: '100%',
    maxWidth: 500,
    maxHeight: '85%',
    ...shadows.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  headerRTL: {
    flexDirection: 'row-reverse',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  titleRowRTL: {
    flexDirection: 'row-reverse',
  },
  title: {
    ...typography.h4,
    color: colors.neutral[900],
  },
  body: {
    padding: spacing.md,
  },
  fieldLabel: {
    ...typography.label,
    color: colors.neutral[600],
    marginBottom: spacing.md,
  },
  fieldLabelRTL: {
    textAlign: 'right',
  },
  sectionTitle: {
    ...typography.label,
    color: colors.neutral[800],
    marginBottom: spacing.sm,
  },
  sectionTitleRTL: {
    textAlign: 'right',
  },
  tonesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  tonesContainerRTL: {
    flexDirection: 'row-reverse',
  },
  toneButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.neutral[300],
    backgroundColor: colors.neutral[50],
  },
  toneButtonSelected: {
    borderColor: colors.primary[500],
    backgroundColor: colors.primary[50],
  },
  toneButtonText: {
    ...typography.bodySmall,
    color: colors.neutral[700],
  },
  toneButtonTextSelected: {
    color: colors.primary[600],
    fontWeight: '600',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
  },
  loadingText: {
    ...typography.body,
    color: colors.neutral[600],
    marginTop: spacing.md,
  },
  errorContainer: {
    alignItems: 'center',
    padding: spacing.lg,
    gap: spacing.sm,
  },
  errorText: {
    ...typography.body,
    color: colors.error[600],
    textAlign: 'center',
  },
  errorTextRTL: {
    textAlign: 'center',
  },
  resultContainer: {
    marginTop: spacing.sm,
  },
  generatedTextContainer: {
    backgroundColor: colors.neutral[50],
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.neutral[200],
  },
  generatedText: {
    ...typography.body,
    color: colors.neutral[800],
    lineHeight: 24,
  },
  generatedTextRTL: {
    textAlign: 'right',
  },
  editInput: {
    backgroundColor: colors.neutral[0],
    borderWidth: 1,
    borderColor: colors.primary[300],
    borderRadius: borderRadius.md,
    padding: spacing.md,
    ...typography.body,
    color: colors.neutral[800],
    minHeight: 150,
  },
  editInputRTL: {
    textAlign: 'right',
  },
  footer: {
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.neutral[200],
  },
  actionButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionButtonsRTL: {
    flexDirection: 'row-reverse',
  },
  actionButton: {
    flex: 1,
  },
  notConfiguredText: {
    ...typography.caption,
    color: colors.warning[600],
    textAlign: 'center',
    marginTop: spacing.sm,
  },
});
