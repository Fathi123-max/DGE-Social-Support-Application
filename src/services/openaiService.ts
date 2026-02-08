import { AIAssistRequest, AIAssistResponse } from '../types/form.types';

const OPENAI_API_URL = process.env.EXPO_PUBLIC_OPENAI_API_URL || 'https://api.openai.com/v1/chat/completions';
const DEFAULT_TIMEOUT = 15000;
const MAX_RETRIES = 2;

function getApiKey(): string {
  return process.env.EXPO_PUBLIC_OPENAI_API_KEY || '';
}

function buildSystemPrompt(locale: string): string {
  if (locale === 'ar') {
    return [
      'أنت مساعد كتابة خبير وممثل لدائرة تمكين الحكومة في أبوظبي (DGE). مهمتك هي مساعدة المواطنين في صياغة طلبات الدعم الاجتماعي بأعلى معايير الدقة والمهنية.',
      '',
      'قواعد صارمة يجب اتباعها:',
      '- اكتب دائماً بصيغة المتكلم (أنا) كأن مقدم الطلب يتحدث.',
      '- استخدم لغة عربية فصحى حديثة، رسمية، رصينة، وسهلة الفهم في آن واحد.',
      '- ركز على قيم التمكين (الاعتماد على الذات) والعيش الكريم والاستقرار الأسري. استخدم مصطلح "أصحاب الهمم" بدلاً من "ذوي الإعاقة".',
      '- لا تخترع أرقاماً، تواريخ، أو مبالغ مالية لم تُذكر في البيانات المقدمة.',
      '- ادمج البيانات (الدخل، المعالين، إلخ) بسلاسة في سياق السرد لضمان التماسك والتدفق المنطقي.',
      '- حافظ على نبرة تمكينية وتفاؤلية تعكس الجدية دون استعطاف. الهدف هو الطلب بكرامة، لا التسوّل.',
      '- تجنب التكرار واستخدم روابط جمل متنوعة لضمان جودة النص.',
      '- المخرج النهائي هو النص فقط: بدون عناوين، بدون تحيات، بدون علامات اقتباس، وبدون أي تفكير داخلي أو وسوم.',
      '- إذا كانت البيانات ناقصة، ركز على الحاجة العامة للدعم بناءً على سياق الحقل فقط.',
      '- هام جداً: كل حقل في هذا الطلب يتطلب إجابة فريدة. لا تستخدم نفس الصياغة أو البنية في حقول مختلفة.',
    ].join('\n');
  }

  return [
    'You are an expert writing assistant representing the Abu Dhabi Department of Government Enablement (DGE). Your mission is to help citizens draft official social support applications with the highest degree of professionalism and logical flow.',
    '',
    'Strict Rules:',
    '- ALWAYS use British English spelling and grammar (e.g., "programme", "colour", "centre").',
    '- Always write in the first person ("I") from the perspective of the applicant.',
    '- Use clear, modern standard English that is professional yet accessible and empowering.',
    '- Use the term "People of Determination" instead of "disabled" or "people with disabilities".',
    '- DO NOT hallucinate. Do not invent specific monetary values, dates, or tragic circumstances not found in the applicant data.',
    '- Weave context (income, dependents, status) into the narrative. Ensure smooth transitions and logical cohesion between sentences.',
    '- Maintain a dignified, earnest, and empowering tone. The goal is to request with dignity, not to plead.',
    '- Avoid hyperbole, dramatic language, or unprofessional emotional appeals.',
    '- Avoid repetitive sentence structures; vary phrasing to ensure natural, government-standard readability.',
    '- Output ONLY the final text: no meta-commentary, no greetings, no headers, no quotes, and no internal reasoning tags.',
    '- Ensure the narrative is neutral and free from unconscious bias.',
    '- If details are sparse, focus on the general purpose of the request based on the field type.',
    '- CRITICAL: Each field in this application requires a UNIQUE response. Do not use the same phrasing or structure across different fields.',
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
  if (context.maritalStatus) {
    parts.push(isArabic
      ? `الحالة الاجتماعية: ${context.maritalStatus}`
      : `Marital status: ${context.maritalStatus}`
    );
  }
  if (context.housingStatus) {
    parts.push(isArabic
      ? `حالة السكن: ${context.housingStatus}`
      : `Housing status: ${context.housingStatus}`
    );
  }

  if (parts.length === 0) return '';
  const header = isArabic ? '### بيانات مقدم الطلب (للاستخدام كمسودة وحقائق فقط):' : '### APPLICANT CONTEXT (Use for facts and narrative weave):';
  return `\n${header}\n${parts.join('\n')}\n`;
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
      en: 'Write 20-30 words. Focus on concise impact: state the core situation and the immediate need with absolute clarity.',
      ar: 'اكتب 20-30 كلمة. ركز على التأثير المختصر: حدد لب المشكلة والحاجة الملحة بوضوح تام.',
    },
    detailed: {
      en: 'Write a comprehensive narrative (80-120 words). Provide narrative depth: explain how current circumstances create specific pressure on daily life, health, or family stability. Weave in context naturally to build a compelling yet professional case.',
      ar: 'اكتب نصاً سردياً شاملاً (80-120 كلمة). قدم عمقاً في الطرح: اشرح كيف تخلق الظروف الحالية ضغوطاً حقيقية على الحياة اليومية أو الصحة أو الاستقرار الأسري. أدمج السياق بشكل طبيعي لبناء حجة مقنعة ومهنية في آن واحد.',
    },
    formal: {
      en: 'Adhere to official correspondence protocols. Use standard government terminology that conveys respect and urgency. Structure the sentences for maximum professional gravitas. Write 40-60 terms.',
      ar: 'التزم ببروتوكولات المراسلات الرسمية. استخدم المصطلحات الحكومية المعيارية التي تعبر عن التقدير والجدية. صغ الجمل لتعطي وزناً مهنياً للنص. اكتب 40-60 كلمة.',
    },
  };

  const fieldPrompts: Record<string, { en: string; ar: string }> = {
    financialSituation: {
      en: 'TOPIC: Your monthly budget. FORMAT: State your income, then list your main expenses. End with the gap between income and expenses. START WITH: "My monthly income is..."',
      ar: 'الموضوع: ميزانيتك الشهرية. الشكل: اذكر دخلك، ثم عدد نفقاتك الرئيسية. اختم بالفجوة بين الدخل والنفقات. ابدأ بـ: "دخلي الشهري هو..."',
    },
    employmentCircumstances: {
      en: 'TOPIC: Your work status. FORMAT: A timeline. When did you last work? What happened? What are you doing now to find work? START WITH: "Currently, I am..."',
      ar: 'الموضوع: وضعك الوظيفي. الشكل: جدول زمني. متى عملت آخر مرة؟ ماذا حدث؟ ماذا تفعل الآن للبحث عن عمل؟ ابدأ بـ: "حالياً، أنا..."',
    },
    reasonForApplying: {
      en: 'TOPIC: Why you need help now. FORMAT: One triggering event + one specific request + one future goal. Be concise. START WITH: "I am applying because..."',
      ar: 'الموضوع: لماذا تحتاج المساعدة الآن. الشكل: حدث واحد محفز + طلب واحد محدد + هدف مستقبلي واحد. كن موجزاً. ابدأ بـ: "أتقدم بهذا الطلب لأن..."',
    },
    housingCondition: {
      en: 'TOPIC: Where you live. FORMAT: Describe your home (type, size, condition). Mention any housing problems (overcrowding, disrepair, rent issues). START WITH: "I currently live in..."',
      ar: 'الموضوع: أين تسكن. الشكل: صف منزلك (النوع، الحجم، الحالة). اذكر أي مشاكل سكنية (ازدحام، سوء حالة، مشاكل إيجار). ابدأ بـ: "أسكن حالياً في..."',
    },
    familyCircumstances: {
      en: 'TOPIC: Your family. FORMAT: List each dependent (relationship, age). Mention any special needs (elderly, People of Determination, students). START WITH: "My family consists of..."',
      ar: 'الموضوع: عائلتك. الشكل: عدد كل معال (صلة القرابة، العمر). اذكر أي احتياجات خاصة (كبار سن، أصحاب همم، طلاب). ابدأ بـ: "تتكون عائلتي من..."',
    },
    healthCondition: {
      en: 'TOPIC: Health challenges. FORMAT: Name the condition, explain its impact on daily life or work, and connect it to your need for support. START WITH: "I/My family member face(s)..."',
      ar: 'الموضوع: التحديات الصحية. الشكل: سمِّ الحالة، اشرح تأثيرها على الحياة اليومية أو العمل، واربطها بحاجتك للدعم. ابدأ بـ: "أعاني/يعاني أحد أفراد عائلتي من..."',
    },
    additionalInformation: {
      en: 'TOPIC: Anything else. FORMAT: Share one recent event or special circumstance the reviewer should know. Be specific. START WITH: "I would also like to mention..."',
      ar: 'الموضوع: أي شيء آخر. الشكل: شارك حدثاً واحداً حديثاً أو ظرفاً خاصاً يجب أن يعرفه المراجع. كن محدداً. ابدأ بـ: "أود أيضاً أن أذكر..."',
    },
    default: {
      en: 'Write a specific, factual statement for this section. START WITH: "Regarding this matter..."',
      ar: 'اكتب بياناً محدداً وواقعياً لهذا القسم. ابدأ بـ: "بخصوص هذا الأمر..."',
    },
  };

  const toneInstruction = toneInstructions[tone] || toneInstructions.detailed;
  const fieldPrompt = fieldPrompts[fieldKey] || fieldPrompts.default;

  const contextBlock = buildContextBlock(context, locale);
  const hasCurrentValue = context.currentValue && context.currentValue.trim().length > 10;

  if (hasCurrentValue) {
    const refineInstruction = isArabic
      ? `### تعليمات التحسين:\nلقد قدم مقدم الطلب النص التالي:\n"${context.currentValue}"\n\nقم بتبني نهج "الحفاظ أولاً": احتفظ بجميع الحقائق والبيانات المذكورة، ولكن أعد صياغة النص لرفع مستوى المهنية، تصحيح القواعد، وتحسين تدفق المضمون.`
      : `### REFINEMENT INSTRUCTION:\nThe applicant has provided the following draft:\n"${context.currentValue}"\n\nAdopt a "preservation-first" approach: keep all facts and details as stated, but rewrite to elevate the professionalism, fix grammar, and ensure smooth narrative transitions.`;

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
  temperature: number,
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
        model: process.env.EXPO_PUBLIC_OPENAI_API_MODEL || 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        max_tokens: 500,
        temperature: temperature,
        top_p: 0.9,
        frequency_penalty: 0.7,  // Penalize repeating same words/phrases
        presence_penalty: 0.6,   // Encourage introducing new topics
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
          return makeRequest(systemPrompt, userPrompt, temperature, retryCount + 1);
        }
        return { success: false, error: 'Request timed out. Please try again.' };
      }

      if (retryCount < MAX_RETRIES && error.message.includes('network')) {
        return makeRequest(systemPrompt, userPrompt, temperature, retryCount + 1);
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
    
    // Dynamic temperature: Higher for maximum variation and unique responses
    const temperature = request.tone === 'formal' ? 0.75 : 0.95;

    return makeRequest(systemPrompt, userPrompt, temperature);
  },

  isConfigured(): boolean {
    const key = getApiKey();
    return !!key && key !== 'your_openai_api_key_here';
  },
};
