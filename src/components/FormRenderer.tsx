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
  onFieldLayout?: (key: string, y: number) => void;
}

export function FormRenderer({
  fields,
  formData,
  errors,
  onFieldChange,
  onFieldBlur,
  getFieldError,
  onFieldLayout,
}: FormRendererProps) {
  const renderField = (field: FieldSchema) => {
    const value = formData[field.key];
    const error = getFieldError(field.key);

    let component = null;

    switch (field.type) {
      case 'text':
      case 'email':
      case 'phone':
      case 'number':
        component = (
          <TextField
            key={field.key}
            field={field}
            value={(value as string) || ''}
            error={error}
            onChangeText={(val) => onFieldChange(field.key, val)}
            onBlur={() => onFieldBlur(field.key)}
          />
        );
        break;

      case 'select':
        component = (
          <SelectField
            key={field.key}
            field={field}
            value={(value as string) || ''}
            error={error}
            onValueChange={(val) => onFieldChange(field.key, val)}
            onBlur={() => onFieldBlur(field.key)}
          />
        );
        break;

      case 'date':
        component = (
          <DateField
            key={field.key}
            field={field}
            value={(value as string) || ''}
            error={error}
            onValueChange={(val) => onFieldChange(field.key, val)}
            onBlur={() => onFieldBlur(field.key)}
          />
        );
        break;

      case 'textarea':
        component = (
          <TextAreaField
            key={field.key}
            field={field}
            value={(value as string) || ''}
            error={error}
            onChangeText={(val) => onFieldChange(field.key, val)}
            onBlur={() => onFieldBlur(field.key)}
          />
        );
        break;

      case 'ai-textarea':
        component = (
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
        break;

      default:
        component = null;
    }

    if (!component) return null;

    return (
      <View
        key={field.key}
        onLayout={(e) => onFieldLayout?.(field.key, e.nativeEvent.layout.y)}
      >
        {component}
      </View>
    );
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
