import { AIAssistRequest, AIAssistResponse } from '../types/form.types';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const DEFAULT_TIMEOUT = 15000;
const MAX_RETRIES = 2;

function getApiKey(): string {
  return process.env.EXPO_PUBLIC_OPENAI_API_KEY || '';
}

function buildSystemPrompt(locale: string): string {
  if (locale === 'ar') {
    return [
      'أنت مساعد كتابة متعاطف ومحترف، تساعد المواطنين في كتابة طلبات الدعم الاجتماعي المقدمة لدائرة تمكين الحكومة في أبوظبي.',
      '',
      'القواعد التي يجب اتباعها:',
      '- اكتب دائماً بصيغة المتكلم (أنا) كما لو أن مقدم الطلب يصف وضعه بنفسه.',
      '- استخدم العربية الفصحى بأسلوب واضح وصادق ومحترم.',
      '- أدمج المعلومات المقدمة بشكل طبيعي في السياق بدلاً من سردها كقائمة.',
      '- حافظ على نبرة كريمة وجادة دون مبالغة عاطفية أو تضخيم.',
      '- أعطِ النص النهائي مباشرة: بدون عناوين، بدون نقاط تعداد، بدون تحيات، وبدون علامات XML أو وسوم تفكير.',
      '- إذا لم تتوفر بعض المعلومات، اكتب بشكل عام دون اختلاق تفاصيل.',
    ].join('\n');
  }

  return [
    'You are an empathetic, professional writing assistant helping citizens compose social support applications for the Abu Dhabi Department of Government Enablement (DGE).',
    '',
    'Rules you must follow:',
    '- Always write in first person ("I") as if the applicant is describing their own situation.',
    '- Use clear, honest, and respectful language.',
    '- Weave any provided details (income, dependents, employment) naturally into the narrative rather than listing them.',
    '- Maintain a dignified and earnest tone without emotional exaggeration or fabrication.',
    '- Output only the final paragraph text: no headings, no bullet points, no greetings, no XML tags, no thinking tags, no internal reasoning.',
    '- If certain details are not provided, write in general terms without inventing specifics.',
  ].join('\n');
}

function buildContextBlock(context: AIAssistRequest['context'], locale: string): string {
  const isArabic = locale === 'ar';
  const parts: string[] = [];

  if (context.employmentStatus) {
    parts.push(isArabic
      ? `الحالة الوظيفية: ${context.employmentStatus}`
      : `Employment status: ${context.employmentStatus}`
    );
  }
  if (context.monthlyIncome) {
    parts.push(isArabic
      ? `الدخل الشهري: ${context.monthlyIncome} درهم`
      : `Monthly income: ${context.monthlyIncome} AED`
    );
  }
  if (context.dependents) {
    parts.push(isArabic
      ? `عدد المعالين: ${context.dependents}`
      : `Number of dependents: ${context.dependents}`
    );
  }

  if (parts.length === 0) return '';

  const header = isArabic ? 'بيانات مقدم الطلب:' : 'Applicant details:';
  return `\n${header}\n${parts.join('\n')}`;
}

function buildUserPrompt(
  fieldKey: string,
  tone: string,
  context: AIAssistRequest['context'],
  locale: string
): string {
  const isArabic = locale === 'ar';

  const toneInstructions: Record<string, { en: string; ar: string }> = {
    short: {
      en: 'Write 2-3 clear sentences that state the core situation and need directly, without filler words.',
      ar: 'اكتب 2-3 جمل واضحة تعبر عن صلب الموضوع والحاجة مباشرة، بدون حشو.',
    },
    detailed: {
      en: 'Write 4-6 sentences covering the full picture: the circumstances, how they affect daily life and family, and what difference the assistance would make. Weave in specific details naturally.',
      ar: 'اكتب 4-6 جمل تغطي الصورة الكاملة: الظروف، وتأثيرها على الحياة اليومية والأسرة، والفرق الذي سيحدثه الدعم. أدمج التفاصيل بشكل طبيعي.',
    },
    formal: {
      en: 'Use respectful, official language appropriate for government correspondence. Maintain a dignified and earnest tone. Write 3-5 well-structured sentences.',
      ar: 'استخدم لغة رسمية محترمة تليق بالمراسلات الحكومية. حافظ على نبرة وقورة وجادة. اكتب 3-5 جمل منظمة.',
    },
  };

  const fieldPrompts: Record<string, { en: string; ar: string }> = {
    financialSituation: {
      en: 'Write a first-person description of my current financial situation for a social support application. Cover my sources of income (or lack thereof), monthly obligations, and how I am struggling to meet basic needs for myself and my family.',
      ar: 'اكتب وصفاً بصيغة المتكلم عن وضعي المالي الحالي لطلب دعم اجتماعي. تناول مصادر دخلي (أو انعدامها)، والتزاماتي الشهرية، وكيف أواجه صعوبة في تلبية الاحتياجات الأساسية لي ولأسرتي.',
    },
    employmentCircumstances: {
      en: 'Write a first-person description of my employment circumstances for a social support application. Explain my current job status, any changes that led to this situation, and the challenges I face in finding or maintaining work.',
      ar: 'اكتب وصفاً بصيغة المتكلم عن ظروفي الوظيفية لطلب دعم اجتماعي. اشرح وضعي الوظيفي الحالي، والتغيرات التي أدت إلى هذا الوضع، والتحديات التي أواجهها في إيجاد عمل أو الاستمرار فيه.',
    },
    reasonForApplying: {
      en: 'Write a first-person explanation of why I am applying for social support. Describe the specific help I need, what I have already tried to do on my own, and how this assistance would help me and my family move forward.',
      ar: 'اكتب شرحاً بصيغة المتكلم لسبب تقدمي بطلب الدعم الاجتماعي. صف المساعدة المحددة التي أحتاجها، وما حاولت فعله بنفسي، وكيف سيساعدني هذا الدعم وأسرتي على المضي قدماً.',
    },
  };

  const toneInstruction = toneInstructions[tone] || toneInstructions.detailed;
  const fieldPrompt = fieldPrompts[fieldKey] || fieldPrompts.financialSituation;

  const contextBlock = buildContextBlock(context, locale);
  const hasCurrentValue = context.currentValue && context.currentValue.trim().length > 10;

  if (hasCurrentValue) {
    const refineInstruction = isArabic
      ? `لقد كتبت بالفعل ما يلي:\n"${context.currentValue}"\n\nقم بتحسين وصقل هذا النص مع الحفاظ على المعنى المقصود. اجعله أكثر وضوحاً واحترافية.`
      : `I have already written the following:\n"${context.currentValue}"\n\nRefine and improve this text while preserving my intended meaning. Make it clearer and more professional.`;

    return [
      isArabic ? fieldPrompt.ar : fieldPrompt.en,
      contextBlock,
      '',
      refineInstruction,
      '',
      isArabic ? toneInstruction.ar : toneInstruction.en,
    ].filter(Boolean).join('\n');
  }

  return [
    isArabic ? fieldPrompt.ar : fieldPrompt.en,
    contextBlock,
    '',
    isArabic ? toneInstruction.ar : toneInstruction.en,
  ].filter(Boolean).join('\n');
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
    const rawText = data.choices?.[0]?.message?.content?.trim();

    if (!rawText) {
      throw new Error('No response generated');
    }

    const text = rawText
      .replace(/<think>[\s\S]*?<\/think>/gi, '')
      .replace(/<think>[\s\S]*/gi, '')
      .trim();

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
    const systemPrompt = buildSystemPrompt(locale);
    const userPrompt = buildUserPrompt(request.fieldKey, request.tone, request.context, locale);
    return makeRequest(systemPrompt, userPrompt);
  },

  isConfigured(): boolean {
    const key = getApiKey();
    return !!key && key !== 'your_openai_api_key_here';
  },
};
