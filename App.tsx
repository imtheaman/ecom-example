import React, { useEffect } from 'react';
import AppModule from '@/di/AppModule';
import { QueryClientProvider } from '@tanstack/react-query';
import useAppStart from '@shared/hooks/useAppStart';
import MainNavigator from './src/presentation/navigation/MainNavigator';
import { AccessibilityProvider } from './src/shared/hooks/useAccessibility';

export default function App() {
  const queryClient = AppModule.queryClient;

  useEffect(() => {
    useAppStart();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AccessibilityProvider>
        <MainNavigator />
      </AccessibilityProvider>
    </QueryClientProvider>
  );
}
