import { FormData } from '../types/form.types';

const MOCK_DELAY_MIN = 2000;
const MOCK_DELAY_MAX = 3500;

function generateReferenceId(): string {
  const now = new Date();
  const datePart = now.toISOString().slice(0, 10).replace(/-/g, '');
  const randomPart = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `DGE-${datePart}-${randomPart}`;
}

function getRandomDelay(): number {
  return Math.floor(Math.random() * (MOCK_DELAY_MAX - MOCK_DELAY_MIN + 1)) + MOCK_DELAY_MIN;
}

export interface SubmissionResponse {
  success: boolean;
  referenceId?: string;
  submittedAt?: string;
  error?: string;
}

export const submissionService = {
  async submitApplication(formData: FormData): Promise<SubmissionResponse> {
    const delay = getRandomDelay();

    await new Promise((resolve) => setTimeout(resolve, delay));

    const shouldSucceed = Math.random() > 0.05;

    if (shouldSucceed) {
      const referenceId = generateReferenceId();
      const submittedAt = new Date().toISOString();

      console.log('[Submission] Application submitted successfully:', {
        referenceId,
        submittedAt,
        formData,
      });

      return {
        success: true,
        referenceId,
        submittedAt,
      };
    }

    return {
      success: false,
      error: 'SUBMISSION_FAILED',
    };
  },

  async checkStatus(referenceId: string): Promise<{ status: string; updatedAt: string }> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    return {
      status: 'pending_review',
      updatedAt: new Date().toISOString(),
    };
  },
};
