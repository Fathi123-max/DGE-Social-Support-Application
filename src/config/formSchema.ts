import { FormSchema } from '../types/form.types';

export const formSchema: FormSchema = {
  id: 'social-support-application',
  version: '1.0.0',
  steps: [
    {
      id: 1,
      key: 'personal',
      title: {
        en: 'Personal Information',
        ar: 'المعلومات الشخصية',
      },
      description: {
        en: 'Please provide your personal details',
        ar: 'يرجى تقديم بياناتك الشخصية',
      },
      fields: [
        {
          key: 'name',
          label: { en: 'Full Name', ar: 'الاسم الكامل' },
          placeholder: { en: 'Enter your full name', ar: 'أدخل اسمك الكامل' },
          type: 'text',
          required: true,
          minLength: 3,
          maxLength: 100,
          validationRules: [
            {
              type: 'required',
              message: { en: 'Name is required', ar: 'الاسم مطلوب' },
            },
            {
              type: 'minLength',
              value: 3,
              message: { en: 'Name must be at least 3 characters', ar: 'يجب أن يكون الاسم 3 أحرف على الأقل' },
            },
          ],
        },
        {
          key: 'nationalId',
          label: { en: 'National ID', ar: 'الهوية الوطنية' },
          placeholder: { en: 'Enter your National ID', ar: 'أدخل رقم الهوية الوطنية' },
          type: 'text',
          required: true,
          keyboardType: 'numeric',
          validationRules: [
            {
              type: 'required',
              message: { en: 'National ID is required', ar: 'رقم الهوية الوطنية مطلوب' },
            },
            {
              type: 'pattern',
              value: '^[0-9]{15}$',
              message: { en: 'National ID must be 15 digits', ar: 'يجب أن تكون الهوية الوطنية 15 رقماً' },
            },
          ],
        },
        {
          key: 'dateOfBirth',
          label: { en: 'Date of Birth', ar: 'تاريخ الميلاد' },
          placeholder: { en: 'Select date of birth', ar: 'اختر تاريخ الميلاد' },
          type: 'date',
          required: true,
          validationRules: [
            {
              type: 'required',
              message: { en: 'Date of birth is required', ar: 'تاريخ الميلاد مطلوب' },
            },
          ],
        },
        {
          key: 'gender',
          label: { en: 'Gender', ar: 'الجنس' },
          placeholder: { en: 'Select gender', ar: 'اختر الجنس' },
          type: 'select',
          required: true,
          options: [
            { value: 'male', label: { en: 'Male', ar: 'ذكر' } },
            { value: 'female', label: { en: 'Female', ar: 'أنثى' } },
          ],
          validationRules: [
            {
              type: 'required',
              message: { en: 'Please select your gender', ar: 'يرجى اختيار الجنس' },
            },
          ],
        },
        {
          key: 'address',
          label: { en: 'Address', ar: 'العنوان' },
          placeholder: { en: 'Enter your street address', ar: 'أدخل عنوان الشارع' },
          type: 'text',
          required: true,
          maxLength: 200,
          validationRules: [
            {
              type: 'required',
              message: { en: 'Address is required', ar: 'العنوان مطلوب' },
            },
          ],
        },
        {
          key: 'city',
          label: { en: 'City', ar: 'المدينة' },
          placeholder: { en: 'Enter your city', ar: 'أدخل مدينتك' },
          type: 'text',
          required: true,
          validationRules: [
            {
              type: 'required',
              message: { en: 'City is required', ar: 'المدينة مطلوبة' },
            },
          ],
        },
        {
          key: 'state',
          label: { en: 'State/Emirate', ar: 'الإمارة/المنطقة' },
          placeholder: { en: 'Select emirate', ar: 'اختر الإمارة' },
          type: 'select',
          required: true,
          options: [
            { value: 'abu-dhabi', label: { en: 'Abu Dhabi', ar: 'أبوظبي' } },
            { value: 'dubai', label: { en: 'Dubai', ar: 'دبي' } },
            { value: 'sharjah', label: { en: 'Sharjah', ar: 'الشارقة' } },
            { value: 'ajman', label: { en: 'Ajman', ar: 'عجمان' } },
            { value: 'umm-al-quwain', label: { en: 'Umm Al Quwain', ar: 'أم القيوين' } },
            { value: 'ras-al-khaimah', label: { en: 'Ras Al Khaimah', ar: 'رأس الخيمة' } },
            { value: 'fujairah', label: { en: 'Fujairah', ar: 'الفجيرة' } },
          ],
          validationRules: [
            {
              type: 'required',
              message: { en: 'Please select your emirate', ar: 'يرجى اختيار الإمارة' },
            },
          ],
        },
        {
          key: 'country',
          label: { en: 'Country', ar: 'الدولة' },
          placeholder: { en: 'Select country', ar: 'اختر الدولة' },
          type: 'select',
          required: true,
          options: [
            { value: 'uae', label: { en: 'United Arab Emirates', ar: 'الإمارات العربية المتحدة' } },
          ],
          validationRules: [
            {
              type: 'required',
              message: { en: 'Country is required', ar: 'الدولة مطلوبة' },
            },
          ],
        },
        {
          key: 'phone',
          label: { en: 'Phone Number', ar: 'رقم الهاتف' },
          placeholder: { en: '+971 XX XXX XXXX', ar: '+971 XX XXX XXXX' },
          type: 'phone',
          required: true,
          keyboardType: 'phone-pad',
          validationRules: [
            {
              type: 'required',
              message: { en: 'Phone number is required', ar: 'رقم الهاتف مطلوب' },
            },
            {
              type: 'phone',
              message: { en: 'Please enter a valid phone number', ar: 'يرجى إدخال رقم هاتف صالح' },
            },
          ],
        },
        {
          key: 'email',
          label: { en: 'Email Address', ar: 'البريد الإلكتروني' },
          placeholder: { en: 'Enter your email', ar: 'أدخل بريدك الإلكتروني' },
          type: 'email',
          required: true,
          keyboardType: 'email-address',
          validationRules: [
            {
              type: 'required',
              message: { en: 'Email is required', ar: 'البريد الإلكتروني مطلوب' },
            },
            {
              type: 'email',
              message: { en: 'Please enter a valid email address', ar: 'يرجى إدخال بريد إلكتروني صالح' },
            },
          ],
        },
      ],
    },
    {
      id: 2,
      key: 'financial',
      title: {
        en: 'Family & Financial Information',
        ar: 'المعلومات العائلية والمالية',
      },
      description: {
        en: 'Please provide your family and financial details',
        ar: 'يرجى تقديم بياناتك العائلية والمالية',
      },
      fields: [
        {
          key: 'maritalStatus',
          label: { en: 'Marital Status', ar: 'الحالة الاجتماعية' },
          placeholder: { en: 'Select marital status', ar: 'اختر الحالة الاجتماعية' },
          type: 'select',
          required: true,
          options: [
            { value: 'single', label: { en: 'Single', ar: 'أعزب/عزباء' } },
            { value: 'married', label: { en: 'Married', ar: 'متزوج/متزوجة' } },
            { value: 'divorced', label: { en: 'Divorced', ar: 'مطلق/مطلقة' } },
            { value: 'widowed', label: { en: 'Widowed', ar: 'أرمل/أرملة' } },
          ],
          validationRules: [
            {
              type: 'required',
              message: { en: 'Please select your marital status', ar: 'يرجى اختيار الحالة الاجتماعية' },
            },
          ],
        },
        {
          key: 'dependents',
          label: { en: 'Number of Dependents', ar: 'عدد المعالين' },
          placeholder: { en: 'Enter number of dependents', ar: 'أدخل عدد المعالين' },
          type: 'number',
          required: true,
          keyboardType: 'numeric',
          min: 0,
          max: 20,
          validationRules: [
            {
              type: 'required',
              message: { en: 'Number of dependents is required', ar: 'عدد المعالين مطلوب' },
            },
            {
              type: 'min',
              value: 0,
              message: { en: 'Dependents cannot be negative', ar: 'لا يمكن أن يكون عدد المعالين سالباً' },
            },
            {
              type: 'max',
              value: 20,
              message: { en: 'Please enter a valid number of dependents', ar: 'يرجى إدخال عدد معالين صالح' },
            },
          ],
        },
        {
          key: 'employmentStatus',
          label: { en: 'Employment Status', ar: 'الحالة الوظيفية' },
          placeholder: { en: 'Select employment status', ar: 'اختر الحالة الوظيفية' },
          type: 'select',
          required: true,
          options: [
            { value: 'employed', label: { en: 'Employed', ar: 'موظف' } },
            { value: 'unemployed', label: { en: 'Unemployed', ar: 'عاطل عن العمل' } },
            { value: 'self-employed', label: { en: 'Self-Employed', ar: 'عمل حر' } },
            { value: 'retired', label: { en: 'Retired', ar: 'متقاعد' } },
            { value: 'student', label: { en: 'Student', ar: 'طالب' } },
          ],
          validationRules: [
            {
              type: 'required',
              message: { en: 'Please select your employment status', ar: 'يرجى اختيار الحالة الوظيفية' },
            },
          ],
        },
        {
          key: 'monthlyIncome',
          label: { en: 'Monthly Income (AED)', ar: 'الدخل الشهري (درهم)' },
          placeholder: { en: 'Enter monthly income', ar: 'أدخل الدخل الشهري' },
          type: 'number',
          required: true,
          keyboardType: 'numeric',
          min: 0,
          max: 999999,
          helpText: {
            en: 'Enter your total monthly household income in AED',
            ar: 'أدخل إجمالي دخل الأسرة الشهري بالدرهم',
          },
          validationRules: [
            {
              type: 'required',
              message: { en: 'Monthly income is required', ar: 'الدخل الشهري مطلوب' },
            },
            {
              type: 'min',
              value: 0,
              message: { en: 'Income cannot be negative', ar: 'لا يمكن أن يكون الدخل سالباً' },
            },
            {
              type: 'max',
              value: 999999,
              message: { en: 'Please enter a valid income amount', ar: 'يرجى إدخال مبلغ دخل صالح' },
            },
          ],
        },
        {
          key: 'housingStatus',
          label: { en: 'Housing Status', ar: 'حالة السكن' },
          placeholder: { en: 'Select housing status', ar: 'اختر حالة السكن' },
          type: 'select',
          required: true,
          options: [
            { value: 'owner', label: { en: 'Owner', ar: 'مالك' } },
            { value: 'renter', label: { en: 'Renter', ar: 'مستأجر' } },
            { value: 'family', label: { en: 'Living with Family', ar: 'يعيش مع العائلة' } },
            { value: 'other', label: { en: 'Other', ar: 'أخرى' } },
          ],
          validationRules: [
            {
              type: 'required',
              message: { en: 'Please select your housing status', ar: 'يرجى اختيار حالة السكن' },
            },
          ],
        },
      ],
    },
    {
      id: 3,
      key: 'situation',
      title: {
        en: 'Situation Description',
        ar: 'وصف الوضع',
      },
      description: {
        en: 'Please describe your current situation. You can use AI assistance to help you write.',
        ar: 'يرجى وصف وضعك الحالي. يمكنك استخدام المساعدة الذكية للمساعدة في الكتابة.',
      },
      fields: [
        {
          key: 'financialSituation',
          label: { en: 'Current Financial Situation', ar: 'الوضع المالي الحالي' },
          placeholder: {
            en: 'Describe your current financial situation...',
            ar: 'صف وضعك المالي الحالي...',
          },
          type: 'ai-textarea',
          required: true,
          minLength: 50,
          maxLength: 1000,
          aiPromptContext: 'financial_situation',
          helpText: {
            en: 'Explain your current financial challenges and circumstances',
            ar: 'اشرح تحدياتك وظروفك المالية الحالية',
          },
          validationRules: [
            {
              type: 'required',
              message: { en: 'Please describe your financial situation', ar: 'يرجى وصف وضعك المالي' },
            },
            {
              type: 'minLength',
              value: 50,
              message: { en: 'Please provide at least 50 characters', ar: 'يرجى تقديم 50 حرفاً على الأقل' },
            },
          ],
        },
        {
          key: 'employmentCircumstances',
          label: { en: 'Employment Circumstances', ar: 'ظروف العمل' },
          placeholder: {
            en: 'Describe your employment circumstances...',
            ar: 'صف ظروف عملك...',
          },
          type: 'ai-textarea',
          required: true,
          minLength: 50,
          maxLength: 1000,
          aiPromptContext: 'employment_circumstances',
          helpText: {
            en: 'Explain your current employment situation and any challenges',
            ar: 'اشرح وضعك الوظيفي الحالي وأي تحديات',
          },
          validationRules: [
            {
              type: 'required',
              message: { en: 'Please describe your employment circumstances', ar: 'يرجى وصف ظروف عملك' },
            },
            {
              type: 'minLength',
              value: 50,
              message: { en: 'Please provide at least 50 characters', ar: 'يرجى تقديم 50 حرفاً على الأقل' },
            },
          ],
        },
        {
          key: 'reasonForApplying',
          label: { en: 'Reason for Applying', ar: 'سبب التقديم' },
          placeholder: {
            en: 'Explain why you are applying for social support...',
            ar: 'اشرح سبب تقديمك لطلب الدعم الاجتماعي...',
          },
          type: 'ai-textarea',
          required: true,
          minLength: 50,
          maxLength: 1000,
          aiPromptContext: 'reason_for_applying',
          helpText: {
            en: 'Explain why you need social support and how it would help',
            ar: 'اشرح لماذا تحتاج إلى الدعم الاجتماعي وكيف سيساعدك',
          },
          validationRules: [
            {
              type: 'required',
              message: { en: 'Please explain your reason for applying', ar: 'يرجى شرح سبب تقديمك' },
            },
            {
              type: 'minLength',
              value: 50,
              message: { en: 'Please provide at least 50 characters', ar: 'يرجى تقديم 50 حرفاً على الأقل' },
            },
          ],
        },
      ],
    },
    {
      id: 4,
      key: 'review',
      title: {
        en: 'Review & Confirm',
        ar: 'المراجعة والتأكيد',
      },
      description: {
        en: 'Please review your application before submitting',
        ar: 'يرجى مراجعة طلبك قبل الإرسال',
      },
      fields: [],
    },
  ],
};

export const aiTones = [
  { id: 'short', label: { en: 'Short & Concise', ar: 'قصير ومختصر' } },
  { id: 'detailed', label: { en: 'Detailed', ar: 'مفصل' } },
  { id: 'formal', label: { en: 'Formal', ar: 'رسمي' } },
];
