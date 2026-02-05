import { useState, useCallback, useEffect, useRef } from 'react';
import { FormData, FormSchema, FieldSchema, ValidationRule } from '../types/form.types';
import { localStorageService } from '../services/localStorageService';
import { analyticsService } from '../services/analyticsService';
import { useTranslation } from 'react-i18next';

interface UseFormStateReturn {
  formData: FormData;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  currentStep: number;
  lastSavedAt: Date | null;
  isRestoring: boolean;
  setFieldValue: (key: string, value: string | number | Date | null) => void;
  setFieldTouched: (key: string) => void;
  validateField: (field: FieldSchema) => string | null;
  validateStep: (fields: FieldSchema[]) => boolean;
  goToStep: (step: number) => void;
  nextStep: (totalSteps: number) => void;
  prevStep: () => void;
  resetForm: () => void;
  getFieldError: (key: string) => string | null;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^(\+971|971|0)?[0-9]{9,10}$/;

export function useFormState(schema: FormSchema): UseFormStateReturn {
  const { i18n } = useTranslation();
  const locale = i18n.language as 'en' | 'ar';

  const [formData, setFormData] = useState<FormData>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [currentStep, setCurrentStep] = useState(1);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [isRestoring, setIsRestoring] = useState(true);

  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const initialLoadDone = useRef(false);

  useEffect(() => {
    const restoreData = async () => {
      try {
        const stored = await localStorageService.loadFormData();
        if (stored) {
          setFormData(stored.data);
          setCurrentStep(stored.currentStep);
          setLastSavedAt(new Date(stored.lastSavedAt));
          analyticsService.trackDraftRestored(Object.keys(stored.data).length);
        }
      } catch (error) {
        console.error('Error restoring form data:', error);
      } finally {
        setIsRestoring(false);
        initialLoadDone.current = true;
      }
    };

    restoreData();
  }, []);

  useEffect(() => {
    if (!initialLoadDone.current) return;
    if (Object.keys(formData).length === 0) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(async () => {
      const success = await localStorageService.saveFormData(formData, currentStep);
      if (success) {
        const now = new Date();
        setLastSavedAt(now);
        analyticsService.trackDraftSaved(Object.keys(formData).length);
      }
    }, 500);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [formData, currentStep]);

  const validateRule = useCallback(
    (value: string | number | null | undefined, rule: ValidationRule): boolean => {
      const strValue = value?.toString() || '';

      switch (rule.type) {
        case 'required':
          return strValue.trim().length > 0;
        case 'minLength':
          return strValue.length >= (rule.value as number);
        case 'maxLength':
          return strValue.length <= (rule.value as number);
        case 'min': {
          const num = Number(strValue);
          return !isNaN(num) && num >= (rule.value as number);
        }
        case 'max': {
          const num = Number(strValue);
          return !isNaN(num) && num <= (rule.value as number);
        }
        case 'email':
          return EMAIL_REGEX.test(strValue);
        case 'phone':
          return PHONE_REGEX.test(strValue.replace(/\s/g, ''));
        case 'pattern':
          return new RegExp(rule.value as string).test(strValue);
        default:
          return true;
      }
    },
    []
  );

  const validateField = useCallback(
    (field: FieldSchema): string | null => {
      const value = formData[field.key];

      if (!field.validationRules) return null;

      for (const rule of field.validationRules) {
        if (!validateRule(value as string | number | null, rule)) {
          return rule.message[locale];
        }
      }

      return null;
    },
    [formData, locale, validateRule]
  );

  const setFieldValue = useCallback((key: string, value: string | number | Date | null) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }, []);

  const setFieldTouched = useCallback((key: string) => {
    setTouched((prev) => ({ ...prev, [key]: true }));
  }, []);

  const validateStep = useCallback(
    (fields: FieldSchema[]): boolean => {
      const stepErrors: Record<string, string> = {};
      const clearedKeys: string[] = [];
      let isValid = true;

      for (const field of fields) {
        const error = validateField(field);
        if (error) {
          stepErrors[field.key] = error;
          isValid = false;
        } else {
          clearedKeys.push(field.key);
        }
      }

      setErrors((prev) => {
        const next = { ...prev, ...stepErrors };
        for (const key of clearedKeys) {
          delete next[key];
        }
        return next;
      });

      const touchedFields: Record<string, boolean> = {};
      for (const field of fields) {
        touchedFields[field.key] = true;
      }
      setTouched((prev) => ({ ...prev, ...touchedFields }));

      return isValid;
    },
    [validateField]
  );

  const goToStep = useCallback((step: number) => {
    setCurrentStep(step);
    analyticsService.trackStepViewed(step, schema.steps[step - 1]?.key || '');
  }, [schema.steps]);

  const nextStep = useCallback(
    (totalSteps: number) => {
      if (currentStep < totalSteps) {
        const newStep = currentStep + 1;
        setCurrentStep(newStep);
        analyticsService.trackStepCompleted(currentStep, schema.steps[currentStep - 1]?.key || '', 0);
        analyticsService.trackStepViewed(newStep, schema.steps[newStep - 1]?.key || '');
      }
    },
    [currentStep, schema.steps]
  );

  const prevStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  const resetForm = useCallback(async () => {
    setFormData({});
    setErrors({});
    setTouched({});
    setCurrentStep(1);
    setLastSavedAt(null);
    await localStorageService.clearFormData();
  }, []);

  const getFieldError = useCallback(
    (key: string): string | null => {
      if (!touched[key]) return null;
      return errors[key] || null;
    },
    [touched, errors]
  );

  return {
    formData,
    errors,
    touched,
    currentStep,
    lastSavedAt,
    isRestoring,
    setFieldValue,
    setFieldTouched,
    validateField,
    validateStep,
    goToStep,
    nextStep,
    prevStep,
    resetForm,
    getFieldError,
  };
}
