# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

React Native (Expo) mobile app for Abu Dhabi DGE. Citizens submit financial assistance applications via a 4-step form wizard (personal → financial → situation → review).

## Common Commands

```bash
npm run dev          # Start dev server (press i/a/w for iOS/Android/Web)
npm run build:web    # Export for web
npm run lint         # Run Expo lint
npm run typecheck    # TypeScript check
```

## Architecture

### Schema-Driven Forms

Form is defined declaratively in `src/config/formSchema.ts`:
- `FieldSchema`: field definition with `LocalizedString {en, ar}` for i18n
- `StepSchema`: collection of fields forming a step
- `FormSchema`: complete form with version and steps

Field types: `text` | `email` | `phone` | `number` | `date` | `select` | `textarea` | `ai-textarea`

### Service Layer Pattern

All external integrations use mock implementations:
- `submissionService.ts`: mock API, generates reference IDs
- `remoteConfigService.ts`: returns local schema, ready for backend fetch
- `analyticsService.ts`: console logging, structured for analytics swap
- `openaiService.ts`: AI text generation via OpenAI

### Key Types (src/types/form.types.ts)

```typescript
interface FieldSchema {
  key: string;
  label: { en: string; ar: string };
  type: FieldType;
  required: boolean;
  validationRules?: ValidationRule[];
  options?: SelectOption[];      // for select fields
  aiPromptContext?: string;       // for AI-assisted fields
}
```

### Localization

- i18next with `react-i18next`
- Files: `src/i18n/en.json`, `ar.json`
- RTL handled automatically via `expo-localization`

### Form State

- `useFormState` hook: step navigation, validation, autosave
- 500ms debounced autosave to AsyncStorage
- Touch tracking for error display

## Key Files

| File | Purpose |
|------|---------|
| `src/config/formSchema.ts` | Form field definitions |
| `src/components/FormRenderer.tsx` | Renders fields from schema |
| `src/screens/FormWizard.tsx` | Wizard container + stepper |
| `src/hooks/useFormState.ts` | Form state + autosave |
| `src/services/openaiService.ts` | AI text generation |
| `src/hooks/useLocalization.ts` | Language switching + RTL |

## Environment Variables

Copy `.env.example` to `.env`:
- `EXPO_PUBLIC_OPENAI_API_KEY` - Required for AI assistance feature
