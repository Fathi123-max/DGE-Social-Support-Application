# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

DGE Social Support is a React Native (Expo) mobile application for Abu Dhabi Department of Government Enablement. Citizens use it to submit applications for financial assistance through a multi-step form wizard.

## Common Commands

```bash
# Start development server
npm run dev

# Build for web
npm run build:web

# Run linting
npm run lint

# TypeScript type checking
npm run typecheck
```

When running `npm run dev`, press:
- `i` - iOS Simulator
- `a` - Android Emulator
- `w` - Web

## Architecture

### Schema-Driven Forms

The entire form is defined declaratively in `src/config/formSchema.ts`. The schema structure enables:
- Field definitions with type, validation rules, and localization
- Step-based navigation (4 steps: personal, financial, situation, review)
- AI-assisted text areas with prompt context
- Server-driven UI readiness via `remoteConfigService`

Key types in `src/types/form.types.ts`:
- `FieldSchema` - Individual field definition with `LocalizedString` objects for en/ar
- `StepSchema` - Collection of fields forming a step
- `FormSchema` - Complete form with version and steps

### Service Layer Pattern

All external integrations use mock implementations designed for production replacement:
- `submissionService.ts` - Mock API with simulated delays, generates reference IDs
- `remoteConfigService.ts` - Returns local schema, ready for backend fetch
- `analyticsService.ts` - Console logging, structured for analytics provider swap
- `openaiService.ts` - AI assistance integration

### Localization

- Built on i18next with `react-i18next`
- Translation files in `src/i18n/` (en.json, ar.json)
- All UI text uses `{ en: string; ar: string }` structure
- RTL layout automatic via `expo-localization`

### Form State Management

- `useFormState` hook manages step navigation, validation, and autosave
- 500ms debounced autosave to AsyncStorage
- Touch tracking for error display strategy

## Key Files

- `src/config/formSchema.ts` - Form definition (fields, validation, AI prompts)
- `src/components/FormRenderer.tsx` - Renders fields from schema
- `src/screens/FormWizard.tsx` - Main wizard container with stepper
- `src/services/openaiService.ts` - AI text generation
- `src/hooks/useLocalization.ts` - Language switching with RTL support

## Environment Variables

Copy `.env.example` to `.env` and set:
- `EXPO_PUBLIC_OPENAI_API_KEY` - Required for AI assistance feature
