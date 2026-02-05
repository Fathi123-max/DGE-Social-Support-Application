import { AIAssistRequest, AIAssistResponse } from '../types/form.types';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const DEFAULT_TIMEOUT = 15000;
const MAX_RETRIES = 2;

function getApiKey(): string {
  return process.env.EXPO_PUBLIC_OPENAI_API_KEY || '';
}

function buildSystemPrompt(context: AIAssistRequest['context'], locale: string): string {
  const isArabic = locale === 'ar';
  const basePrompt = isArabic
    ? 'أنت مساعد كتابة محترف يساعد المتقدمين للدعم الاجتماعي الحكومي. اكتب بالعربية الفصحى بطريقة واضحة ومهنية.'
    : 'You are a professional writing assistant helping applicants for government social support. Write in clear, professional language.';

  const contextInfo = [];
  if (context.employmentStatus) {
    contextInfo.push(isArabic
      ? `الحالة الوظيفية: ${context.employmentStatus}`
      : `Employment status: ${context.employmentStatus}`
    );
  }
  if (context.monthlyIncome) {
    contextInfo.push(isArabic
      ? `الدخل الشهري: ${context.monthlyIncome} درهم`
      : `Monthly income: ${context.monthlyIncome} AED`
    );
  }
  if (context.dependents) {
    contextInfo.push(isArabic
      ? `عدد المعالين: ${context.dependents}`
      : `Number of dependents: ${context.dependents}`
    );
  }

  return `${basePrompt}\n\n${isArabic ? 'سياق المتقدم:' : 'Applicant context:'}\n${contextInfo.join('\n')}`;
}

function buildUserPrompt(fieldKey: string, tone: string, locale: string): string {
  const isArabic = locale === 'ar';
  const toneInstructions: Record<string, { en: string; ar: string }> = {
    short: {
      en: 'Keep it brief and to the point, around 2-3 sentences.',
      ar: 'اجعلها موجزة ومباشرة، حوالي 2-3 جمل.',
    },
    detailed: {
      en: 'Provide a comprehensive description with specific details, around 4-6 sentences.',
      ar: 'قدم وصفاً شاملاً مع تفاصيل محددة، حوالي 4-6 جمل.',
    },
    formal: {
      en: 'Use formal, official language appropriate for government applications.',
      ar: 'استخدم لغة رسمية مناسبة للطلبات الحكومية.',
    },
  };

  const fieldPrompts: Record<string, { en: string; ar: string }> = {
    financialSituation: {
      en: 'Write a description of the applicant\'s current financial situation for a social support application.',
      ar: 'اكتب وصفاً للوضع المالي الحالي للمتقدم لطلب الدعم الاجتماعي.',
    },
    employmentCircumstances: {
      en: 'Write a description of the applicant\'s employment circumstances for a social support application.',
      ar: 'اكتب وصفاً لظروف عمل المتقدم لطلب الدعم الاجتماعي.',
    },
    reasonForApplying: {
      en: 'Write an explanation of why the applicant needs social support assistance.',
      ar: 'اكتب شرحاً لسبب حاجة المتقدم للدعم الاجتماعي.',
    },
  };

  const toneInstruction = toneInstructions[tone] || toneInstructions.detailed;
  const fieldPrompt = fieldPrompts[fieldKey] || fieldPrompts.financialSituation;

  return `${isArabic ? fieldPrompt.ar : fieldPrompt.en}\n\n${isArabic ? toneInstruction.ar : toneInstruction.en}`;
}

async function makeRequest(
  systemPrompt: string,
  userPrompt: string,
  retryCount = 0
): Promise<AIAssistResponse> {
  const apiKey = getApiKey();

  if (!apiKey || apiKey === 'your_openai_api_key_here') {
    return {
      success: false,
      error: 'OpenAI API key not configured. Please add your API key to the .env file.',
    };
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT);

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `API error: ${response.status}`);
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content?.trim();

    if (!text) {
      throw new Error('No response generated');
    }

    return { success: true, text };
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        if (retryCount < MAX_RETRIES) {
          return makeRequest(systemPrompt, userPrompt, retryCount + 1);
        }
        return { success: false, error: 'Request timed out. Please try again.' };
      }

      if (retryCount < MAX_RETRIES && error.message.includes('network')) {
        return makeRequest(systemPrompt, userPrompt, retryCount + 1);
      }

      return { success: false, error: error.message };
    }

    return { success: false, error: 'An unexpected error occurred' };
  }
}

export const openaiService = {
  async generateText(request: AIAssistRequest, locale: string = 'en'): Promise<AIAssistResponse> {
    const systemPrompt = buildSystemPrompt(request.context, locale);
    const userPrompt = buildUserPrompt(request.fieldKey, request.tone, locale);
    return makeRequest(systemPrompt, userPrompt);
  },

  isConfigured(): boolean {
    const key = getApiKey();
    return !!key && key !== 'your_openai_api_key_here';
  },
};
