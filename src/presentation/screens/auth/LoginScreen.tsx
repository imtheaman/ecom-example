import React, { useState } from 'react';
import { useSignInWithGoogle } from '@infrastructure/data-manager/auth/AuthManager';
import AppModule from '@/di/AppModule';
import { AuthStackScreenProps } from '../../navigation/types';
import LoginTemplate from '../../components/templates/LoginTemplate';

const LoginScreen: React.FC<AuthStackScreenProps<'Login'>> = () => {
  const [isLoading, setIsLoading] = useState(false);
  const authRepository = AppModule.authRepository;
  const signInWithGoogle = useSignInWithGoogle(authRepository);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      await signInWithGoogle();
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoginTemplate
      onGoogleLogin={handleGoogleSignIn}
      isLoading={isLoading}
      testID="login-screen"
    />
  );
};

export default LoginScreen;
