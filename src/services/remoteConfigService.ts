import { FormSchema } from '../types/form.types';
import { formSchema } from '../config/formSchema';

const MOCK_DELAY = 100;

interface RemoteConfigResponse {
  success: boolean;
  data?: FormSchema;
  error?: string;
}

export const remoteConfigService = {
  async fetchFormSchema(): Promise<RemoteConfigResponse> {
    await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY));
    return {
      success: true,
      data: formSchema,
    };
  },

  async fetchFeatureFlags(): Promise<Record<string, boolean>> {
    await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY));
    return {
      aiAssistanceEnabled: true,
      autosaveEnabled: true,
      analyticsEnabled: true,
    };
  },
};
