import { useCallback, useEffect } from 'react';
import { I18nManager, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import { localStorageService } from '../services/localStorageService';
import { analyticsService } from '../services/analyticsService';

interface UseLocalizationReturn {
  locale: 'en' | 'ar';
  isRTL: boolean;
  toggleLocale: () => Promise<void>;
  setLocale: (newLocale: 'en' | 'ar') => Promise<void>;
  t: (key: string, options?: Record<string, unknown>) => string;
}

export function useLocalization(): UseLocalizationReturn {
  const { t, i18n } = useTranslation();

  const locale = (i18n.language === 'ar' ? 'ar' : 'en') as 'en' | 'ar';
  const isRTL = locale === 'ar';

  useEffect(() => {
    const loadSavedLocale = async () => {
      const savedLocale = await localStorageService.loadLocale();
      if (savedLocale && (savedLocale === 'en' || savedLocale === 'ar')) {
        if (savedLocale !== i18n.language) {
          await i18n.changeLanguage(savedLocale);
        }
      }
    };

    loadSavedLocale();
  }, [i18n]);

  const setLocale = useCallback(
    async (newLocale: 'en' | 'ar') => {
      const previousLocale = i18n.language;

      await i18n.changeLanguage(newLocale);

      await localStorageService.saveLocale(newLocale);
      analyticsService.trackLanguageChange(previousLocale, newLocale);

      if (Platform.OS !== 'web') {
        const shouldForceRTL = newLocale === 'ar';
        if (I18nManager.isRTL !== shouldForceRTL) {
          I18nManager.allowRTL(shouldForceRTL);
          I18nManager.forceRTL(shouldForceRTL);
        }
      }
    },
    [i18n]
  );

  const toggleLocale = useCallback(async () => {
    const newLocale = i18n.language === 'en' ? 'ar' : 'en';
    await setLocale(newLocale);
  }, [i18n.language, setLocale]);

  return {
    locale,
    isRTL,
    toggleLocale,
    setLocale,
    t,
  };
}
