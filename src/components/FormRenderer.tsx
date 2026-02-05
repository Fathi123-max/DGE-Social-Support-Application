import React from 'react';
import { View, StyleSheet } from 'react-native';
import { FieldSchema, FormData } from '../types/form.types';
import { TextField } from './fields/TextField';
import { SelectField } from './fields/SelectField';
import { DateField } from './fields/DateField';
import { TextAreaField } from './fields/TextAreaField';
import { AITextAreaField } from './fields/AITextAreaField';

interface FormRendererProps {
  fields: FieldSchema[];
  formData: FormData;
  errors: Record<string, string>;
  onFieldChange: (key: string, value: string | number | Date | null) => void;
  onFieldBlur: (key: string) => void;
  getFieldError: (key: string) => string | null;
}

export function FormRenderer({
  fields,
  formData,
  errors,
  onFieldChange,
  onFieldBlur,
  getFieldError,
}: FormRendererProps) {
  const renderField = (field: FieldSchema) => {
    const value = formData[field.key];
    const error = getFieldError(field.key);

    switch (field.type) {
      case 'text':
      case 'email':
      case 'phone':
      case 'number':
        return (
          <TextField
            key={field.key}
            field={field}
            value={(value as string) || ''}
            error={error}
            onChangeText={(val) => onFieldChange(field.key, val)}
            onBlur={() => onFieldBlur(field.key)}
          />
        );

      case 'select':
        return (
          <SelectField
            key={field.key}
            field={field}
            value={(value as string) || ''}
            error={error}
            onValueChange={(val) => onFieldChange(field.key, val)}
            onBlur={() => onFieldBlur(field.key)}
          />
        );

      case 'date':
        return (
          <DateField
            key={field.key}
            field={field}
            value={(value as string) || ''}
            error={error}
            onValueChange={(val) => onFieldChange(field.key, val)}
            onBlur={() => onFieldBlur(field.key)}
          />
        );

      case 'textarea':
        return (
          <TextAreaField
            key={field.key}
            field={field}
            value={(value as string) || ''}
            error={error}
            onChangeText={(val) => onFieldChange(field.key, val)}
            onBlur={() => onFieldBlur(field.key)}
          />
        );

      case 'ai-textarea':
        return (
          <AITextAreaField
            key={field.key}
            field={field}
            value={(value as string) || ''}
            error={error}
            formData={formData}
            onChangeText={(val) => onFieldChange(field.key, val)}
            onBlur={() => onFieldBlur(field.key)}
          />
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {fields.map(renderField)}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
