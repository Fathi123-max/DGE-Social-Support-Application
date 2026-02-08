import AsyncStorage from '@react-native-async-storage/async-storage';
import { FormData } from '../types/form.types';

const STORAGE_KEYS = {
  FORM_DATA: '@dge_social_support_form_data',
  LAST_SAVED: '@dge_social_support_last_saved',
  CURRENT_STEP: '@dge_social_support_current_step',
  LOCALE: '@dge_social_support_locale',
};

export interface StoredFormState {
  data: FormData;
  currentStep: number;
  lastSavedAt: string;
}

export const localStorageService = {
  async saveFormData(data: FormData, currentStep: number): Promise<boolean> {
    try {
      const now = new Date().toISOString();
      const state: StoredFormState = {
        data,
        currentStep,
        lastSavedAt: now,
      };
      await AsyncStorage.setItem(STORAGE_KEYS.FORM_DATA, JSON.stringify(state));
      return true;
    } catch (error) {
      console.error('Error saving form data:', error);
      return false;
    }
  },

  async loadFormData(): Promise<StoredFormState | null> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.FORM_DATA);
      if (stored) {
        return JSON.parse(stored) as StoredFormState;
      }
      return null;
    } catch (error) {
      console.error('Error loading form data:', error);
      return null;
    }
  },

  async clearFormData(): Promise<boolean> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.FORM_DATA);
      return true;
    } catch (error) {
      console.error('Error clearing form data:', error);
      return false;
    }
  },

  async getLastSavedTime(): Promise<Date | null> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.FORM_DATA);
      if (stored) {
        const state = JSON.parse(stored) as StoredFormState;
        return new Date(state.lastSavedAt);
      }
      return null;
    } catch (error) {
      console.error('Error getting last saved time:', error);
      return null;
    }
  },

  async saveLocale(locale: string): Promise<boolean> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.LOCALE, locale);
      return true;
    } catch (error) {
      console.error('Error saving locale:', error);
      return false;
    }
  },

  async loadLocale(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.LOCALE);
    } catch (error) {
      console.error('Error loading locale:', error);
      return null;
    }
  },
};
