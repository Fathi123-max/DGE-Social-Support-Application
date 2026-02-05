import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { I18nextProvider } from 'react-i18next';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import i18n from '@/src/i18n';
import { analyticsService } from '@/src/services/analyticsService';

export default function RootLayout() {
  useFrameworkReady();

  useEffect(() => {
    analyticsService.resetSession();
    analyticsService.trackEvent('app_opened', {});
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <I18nextProvider i18n={i18n}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="dark" />
        </I18nextProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
