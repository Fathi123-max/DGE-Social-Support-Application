export type FieldType =
  | 'text'
  | 'email'
  | 'phone'
  | 'number'
  | 'date'
  | 'select'
  | 'textarea'
  | 'ai-textarea';

export type KeyboardType =
  | 'default'
  | 'email-address'
  | 'numeric'
  | 'phone-pad'
  | 'decimal-pad';

export interface LocalizedString {
  en: string;
  ar: string;
}

export interface SelectOption {
  value: string;
  label: LocalizedString;
}

export interface ValidationRule {
  type: 'required' | 'minLength' | 'maxLength' | 'pattern' | 'min' | 'max' | 'email' | 'phone' | 'luhn';
  value?: string | number | boolean;
  message: LocalizedString;
}

export interface FieldSchema {
  key: string;
  label: LocalizedString;
  placeholder?: LocalizedString;
  type: FieldType;
  required: boolean;
  keyboardType?: KeyboardType;
  validationRules?: ValidationRule[];
  options?: SelectOption[];
  helpText?: LocalizedString;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  aiPromptContext?: string;
}

export interface StepSchema {
  id: number;
  key: string;
  title: LocalizedString;
  description?: LocalizedString;
  fields: FieldSchema[];
}

export interface FormSchema {
  id: string;
  version: string;
  steps: StepSchema[];
}

export type FormData = Record<string, string | number | Date | null>;

export interface FormState {
  data: FormData;
  currentStep: number;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  lastSavedAt: Date | null;
}

export interface AITone {
  id: string;
  label: LocalizedString;
}

export interface AIAssistRequest {
  fieldKey: string;
  tone: string;
  context: {
    employmentStatus?: string;
    monthlyIncome?: string;
    dependents?: string;
    maritalStatus?: string;
    housingStatus?: string;
    currentValue?: string;
  };
}

export interface AIAssistResponse {
  success: boolean;
  text?: string;
  error?: string;
}
