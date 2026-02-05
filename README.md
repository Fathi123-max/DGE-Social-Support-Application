# DGE Social Support Application

A production-ready React Native (Expo) mobile application for the Abu Dhabi Department of Government Enablement (DGE). This app provides citizens with a simple, guided, and intuitive way to submit applications for financial assistance.

## Features

- Multi-step application wizard with progress tracking
- Schema-driven form engine (ready for server-driven UI)
- AI-powered writing assistance using OpenAI GPT
- Full localization support (English + Arabic with RTL)
- Auto-save with local storage persistence
- Comprehensive field validation
- Accessibility-first design
- Mock submission with reference ID generation

## Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- OpenAI API key (for AI assistance feature)

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd dge-social-support

# Install dependencies
npm install
# or
yarn install
```

## Configuration

### Environment Variables

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Add your OpenAI API key:
```
EXPO_PUBLIC_OPENAI_API_KEY=your_openai_api_key_here
```

> **Note**: The AI assistance feature will show a warning if the API key is not configured, but the app will still function without it.

## Running the App

```bash
# Start the development server
npm run dev
# or
yarn dev

# For web
# Press 'w' in the terminal after starting

# For iOS Simulator
# Press 'i' in the terminal after starting

# For Android Emulator
# Press 'a' in the terminal after starting
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── fields/         # Form field components
│   │   ├── TextField.tsx
│   │   ├── SelectField.tsx
│   │   ├── DateField.tsx
│   │   ├── TextAreaField.tsx
│   │   └── AITextAreaField.tsx
│   ├── ui/             # Base UI components
│   │   ├── Button.tsx
│   │   └── Card.tsx
│   ├── AIAssistModal.tsx
│   ├── AutosaveIndicator.tsx
│   ├── FormRenderer.tsx
│   ├── Header.tsx
│   ├── LanguageSwitcher.tsx
│   ├── PrivacyNotice.tsx
│   ├── ReviewSection.tsx
│   └── Stepper.tsx
├── config/
│   ├── formSchema.ts   # Schema-driven form definition
│   └── theme.ts        # Design system tokens
├── hooks/
│   ├── useFormState.ts # Form state management
│   └── useLocalization.ts
├── i18n/
│   ├── index.ts        # i18next configuration
│   ├── en.json         # English translations
│   └── ar.json         # Arabic translations
├── screens/
│   ├── FormWizard.tsx  # Main form screen
│   ├── ReviewScreen.tsx
│   └── ConfirmationScreen.tsx
├── services/
│   ├── analyticsService.ts     # Console-based analytics
│   ├── localStorageService.ts  # Async storage wrapper
│   ├── openaiService.ts        # OpenAI API integration
│   ├── remoteConfigService.ts  # Mock remote config
│   └── submissionService.ts    # Mock submission API
├── types/
│   └── form.types.ts   # TypeScript definitions
└── utils/
    └── validation.ts   # Validation helpers
```

## Architecture Decisions

### Schema-Driven UI

The form is entirely defined by a JSON schema (`src/config/formSchema.ts`). This architecture enables:

- **Easy modifications**: Add/remove fields without code changes
- **Server-driven UI**: The `remoteConfigService` is structured to fetch schemas from a backend
- **Localization**: Labels and messages are embedded in the schema with `{en, ar}` objects
- **Validation**: Rules are declarative and part of the schema

### Local Autosave

All form data is automatically saved to AsyncStorage with a 500ms debounce. This provides:

- **Data recovery**: Users don't lose progress if the app closes
- **Offline support**: Works without network connectivity
- **Privacy**: Data stays on-device until explicit submission

### Mock Services

All external integrations use mock implementations:

- `remoteConfigService`: Returns local schema, ready for API replacement
- `submissionService`: Simulates submission with delay and generates reference IDs
- `analyticsService`: Logs to console, structured for production analytics swap

### Why These Choices?

1. **Expo**: Cross-platform development with excellent developer experience
2. **TypeScript**: Type safety prevents runtime errors
3. **Schema-driven**: Reduces code duplication and enables future server-driven UI
4. **AsyncStorage**: Native storage solution optimized for React Native
5. **i18next**: Industry-standard i18n with excellent React Native support

## Form Schema Structure

```typescript
interface FieldSchema {
  key: string;
  label: { en: string; ar: string };
  type: 'text' | 'email' | 'phone' | 'number' | 'date' | 'select' | 'textarea' | 'ai-textarea';
  required: boolean;
  validationRules?: ValidationRule[];
  options?: SelectOption[];      // For select fields
  aiPromptContext?: string;      // For AI-assisted fields
}

interface StepSchema {
  id: number;
  key: string;
  title: { en: string; ar: string };
  fields: FieldSchema[];
}
```

## Switching to Production

### Remote Config

Replace the mock in `remoteConfigService.ts`:

```typescript
async fetchFormSchema(): Promise<RemoteConfigResponse> {
  const response = await fetch('https://api.example.com/form-schema');
  return response.json();
}
```

### Analytics

Replace console logging in `analyticsService.ts` with your analytics provider:

```typescript
trackEvent(name: EventName, properties: EventProperties): void {
  // Example: Firebase Analytics
  analytics().logEvent(name, properties);
}
```

### Submission API

Update `submissionService.ts` to call your real API:

```typescript
async submitApplication(formData: FormData): Promise<SubmissionResponse> {
  const response = await fetch('https://api.example.com/submit', {
    method: 'POST',
    body: JSON.stringify(formData),
  });
  return response.json();
}
```

## Testing Checklist

- [ ] Complete form flow from Step 1 to Confirmation
- [ ] Validate all required fields show errors when empty
- [ ] Test AI assistance with all three tones
- [ ] Switch language and verify RTL layout
- [ ] Close and reopen app to verify autosave restore
- [ ] Test on both iOS and Android simulators
- [ ] Verify accessibility with VoiceOver/TalkBack

## Demo Recording Script

### Flow 1: Complete Application (English)

1. Launch app - show header and Step 1
2. Fill personal information fields
3. Tap Next - navigate to Step 2
4. Fill family/financial information
5. Tap Next - navigate to Step 3
6. Use "Help Me Write" on first textarea
7. Select "Detailed" tone and generate
8. Accept generated text
9. Fill remaining textareas manually
10. Tap Next - navigate to Review
11. Expand/collapse review sections
12. Tap Edit to return to Step 2
13. Make a change and navigate back to Review
14. Check confirmation checkbox
15. Submit - show confirmation with reference ID

### Flow 2: Arabic RTL Demo

1. Tap language switcher to Arabic
2. Observe RTL layout flip
3. Navigate through steps showing Arabic labels
4. Use AI assistance in Arabic
5. Complete submission

### Flow 3: Autosave Demo

1. Fill partial form data
2. Close app (simulate)
3. Reopen app
4. Show restored data with "Draft saved" indicator

## Future Scalability Vision

1. **Server-Driven UI**: Schema fetched from backend enables A/B testing and dynamic forms
2. **Real-time Validation**: WebSocket connection for server-side validation
3. **Document Upload**: Add file attachment fields to schema
4. **Biometric Authentication**: Integrate Face ID/Touch ID for sensitive data
5. **Push Notifications**: Status updates for submitted applications
6. **Offline Queue**: Queue submissions when offline, sync when connected

## License

This project is proprietary software for the Abu Dhabi Department of Government Enablement.
