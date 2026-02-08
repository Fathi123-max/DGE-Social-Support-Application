<p align="center">
  <img src="https://img.shields.io/badge/React_Native-Expo-blue?style=for-the-badge&logo=expo" alt="Expo"/>
  <img src="https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/OpenAI-GPT_API-412991?style=for-the-badge&logo=openai" alt="OpenAI"/>
  <img src="https://img.shields.io/badge/i18n-EN_|_AR-green?style=for-the-badge" alt="i18n"/>
</p>

# 🏛️ DGE Social Support Application

> **A mobile-first wizard that helps citizens apply for government financial assistance — with AI-powered writing help, bilingual support, and a premium UX.**

Built for the Abu Dhabi Department of Government Enablement (DGE), this React Native (Expo) application guides users through a simple, accessible 3-step form to submit assistance requests.

---

## 📹 Demo

<p align="center">
  <a href="https://youtu.be/_uetMaSMo5I">
    <img src="https://img.shields.io/badge/▶_Watch_Demo-YouTube-red?style=for-the-badge&logo=youtube" alt="Watch Demo"/>
  </a>
</p>

**What you'll see:**
- ✅ Complete 3-step wizard flow
- ✅ AI "Help Me Write" assistance
- ✅ English ↔ Arabic (RTL) switching
- ✅ Auto-save & validation in action
- ✅ Confirmation screen with reference ID

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| **📝 Multi-Step Wizard** | 3-step form with progress indicator and smooth navigation |
| **🤖 AI Writing Assistant** | GPT-powered "Help Me Write" with Accept / Edit / Discard modal |
| **🌍 Bilingual (EN/AR)** | Full localization with automatic RTL layout |
| **💾 Auto-Save** | Drafts saved locally — never lose progress |
| **♿ Accessible** | Screen reader support, font scaling, safe-area aware |
| **📐 Schema-Driven** | Forms defined via JSON — ready for server-driven UI |
| **✅ Smart Validation** | Emirates ID validation with Luhn algorithm, auto-scroll to errors |

---

## 🚀 Quickstart

Get up and running in under 2 minutes.

```bash
# 1. Clone & install
git clone <repository-url>
cd dge-social-support
npm install

# 2. Configure environment
cp .env.example .env
# Add your OpenAI API key (see Configuration below)

# 3. Start the app
npm run dev
```

Then press:
| Key | Platform |
|-----|----------|
| `w` | Web browser |
| `i` | iOS Simulator |
| `a` | Android Emulator |

---

## 📋 Prerequisites

Before you begin, ensure you have:

- [ ] **Node.js 18+** installed
- [ ] **npm** or **yarn** package manager
- [ ] **Expo CLI** — install via `npm install -g expo-cli`
- [ ] **OpenAI API Key** — [Get one here](https://platform.openai.com/api-keys)

---

## ⚙️ Configuration

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `EXPO_PUBLIC_OPENAI_API_KEY` | ✅ Yes | Your API key (Minimax or OpenAI) |
| `EXPO_PUBLIC_OPENAI_API_URL` | ✅ Yes | API endpoint URL |
| `EXPO_PUBLIC_OPENAI_API_MODEL` | ✅ Yes | Model name to use |

**Supported AI Providers:**

| Provider | API URL | Model Examples |
|----------|---------|----------------|
| **Minimax** | `https://api.minimax.io/v1/chat/completions` | `MiniMax-M2.1` |
| **OpenAI** | `https://api.openai.com/v1/chat/completions` | `gpt-4o`, `gpt-4o-mini` |

**Setup:**

```bash
# Copy the template
cp .env.example .env

# Edit .env with your configuration
EXPO_PUBLIC_OPENAI_API_KEY=your_api_key_here
EXPO_PUBLIC_OPENAI_API_URL=https://api.minimax.io/v1/chat/completions
EXPO_PUBLIC_OPENAI_API_MODEL=MiniMax-M2.1
```

> **Note:** The app requires valid AI credentials for the "Help Me Write" feature to function.

---

## 🏗️ Project Structure

```
src/
├── components/           # UI components
│   ├── fields/          # TextField, SelectField, DateField, AITextAreaField
│   ├── ui/              # Button, Card
│   ├── AIAssistModal    # GPT response modal
│   └── Stepper          # Progress indicator
├── config/
│   ├── formSchema.ts    # 📐 Form definition (schema-driven)
│   └── theme.ts         # 🎨 Design tokens
├── hooks/               # useFormState, useLocalization
├── i18n/                # en.json, ar.json translations
├── screens/             # FormWizard, Review, Confirmation
├── services/            # OpenAI, Storage, Submission (mock)
└── types/               # TypeScript definitions
```

---

## 🧩 Architecture

### Schema-Driven Forms

All form fields are defined in `formSchema.ts`:

```typescript
interface FieldSchema {
  key: string;
  label: { en: string; ar: string };
  type: 'text' | 'email' | 'phone' | 'date' | 'select' | 'ai-textarea';
  required: boolean;
  validationRules?: ValidationRule[];
  aiPromptContext?: string;  // For AI-assisted fields
}
```

**Benefits:**
- ✅ Add/remove fields without code changes
- ✅ Swap to server-fetched schema for A/B testing
- ✅ Localization built into the schema

### Auto-Save

Forms auto-save to AsyncStorage with **500ms debounce**:

- 💾 **Offline-first** — works without connectivity
- 🔄 **Recovery** — users resume where they left off
- 🔒 **Privacy** — data stays local until submission

### Mock Services (Production-Ready)

| Service | Current | Swap To |
|---------|---------|---------|
| `remoteConfigService` | Local schema | Backend API |
| `submissionService` | Mock delay + ID | Real API |
| `analyticsService` | Console logs | Firebase / Mixpanel |

---

## 🔄 Switching to Production

### 1. Remote Form Schema

```typescript
// services/remoteConfigService.ts
async fetchFormSchema(): Promise<RemoteConfigResponse> {
  const response = await fetch('https://api.example.com/form-schema');
  return response.json();
}
```

### 2. Real Submission API

```typescript
// services/submissionService.ts
async submitApplication(formData: FormData): Promise<SubmissionResponse> {
  const response = await fetch('https://api.example.com/submit', {
    method: 'POST',
    body: JSON.stringify(formData),
  });
  return response.json();
}
```

### 3. Analytics Provider

```typescript
// services/analyticsService.ts
trackEvent(name: EventName, properties: EventProperties): void {
  analytics().logEvent(name, properties);  // Firebase example
}
```

---

## 🎨 UX Design Principles

| Principle | Implementation |
|-----------|----------------|
| **Intelligent Navigation** | Auto-scroll to first validation error on submit |
| **Premium Inputs** | 12px corners, 2px focus border, high contrast |
| **Layout Stability** | Padding compensation prevents text shift on focus |
| **Readable Typography** | 16pt/18pt Medium weight for clarity |

---

## 🤝 Tech Stack

| Technology | Purpose |
|------------|---------|
| **React Native + Expo** | Cross-platform mobile |
| **TypeScript** | Type safety & DX |
| **i18next** | Internationalization |
| **AsyncStorage** | Local persistence |
| **OpenAI GPT** | AI writing assistance |

---

## 📄 License

This project is proprietary software for the **Abu Dhabi Department of Government Enablement**.

---

<p align="center">
  Made with ❤️ for Abu Dhabi citizens
</p>
