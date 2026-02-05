import { useState, useCallback, useEffect } from 'react';
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
  const [locale, setLocaleState] = useState<'en' | 'ar'>(i18n.language as 'en' | 'ar');
  const [isRTL, setIsRTL] = useState(i18n.language === 'ar');

  useEffect(() => {
    const loadSavedLocale = async () => {
      const savedLocale = await localStorageService.loadLocale();
      if (savedLocale && (savedLocale === 'en' || savedLocale === 'ar')) {
        if (savedLocale !== i18n.language) {
          i18n.changeLanguage(savedLocale);
          setLocaleState(savedLocale);
          setIsRTL(savedLocale === 'ar');
        }
      }
    };

    loadSavedLocale();
  }, [i18n]);

  const setLocale = useCallback(
    async (newLocale: 'en' | 'ar') => {
      const previousLocale = locale;
      const newIsRTL = newLocale === 'ar';

      await i18n.changeLanguage(newLocale);
      setLocaleState(newLocale);
      setIsRTL(newIsRTL);

      await localStorageService.saveLocale(newLocale);
      analyticsService.trackLanguageChange(previousLocale, newLocale);

      if (Platform.OS !== 'web') {
        const shouldForceRTL = newIsRTL;
        if (I18nManager.isRTL !== shouldForceRTL) {
          I18nManager.allowRTL(shouldForceRTL);
          I18nManager.forceRTL(shouldForceRTL);
        }
      }
    },
    [i18n, locale]
  );

  const toggleLocale = useCallback(async () => {
    const newLocale = locale === 'en' ? 'ar' : 'en';
    await setLocale(newLocale);
  }, [locale, setLocale]);

  return {
    locale,
    isRTL,
    toggleLocale,
    setLocale,
    t,
  };
}
