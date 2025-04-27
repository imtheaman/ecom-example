import React, { useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import SocialLoginButton from '@molecules/SocialLoginButton';
import Typography from '@atoms/Typography';
import { theme } from '@shared/constants';

interface LoginFormProps {
  onGoogleLogin: () => Promise<void>;
  isLoading?: boolean;
  testID?: string;
  accessibilityHint?: string;
}

const LoginForm: React.FC<LoginFormProps> = ({
  onGoogleLogin,
  isLoading = false,
  testID,
  accessibilityHint,
}) => {
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    try {
      setLoginError(null);
      await onGoogleLogin();
    } catch (error) {
      setLoginError('Failed to sign in with Google. Please try again.');
    }
  };

  return (
    <View 
      style={styles.container} 
      testID={testID}
      accessible={true}
      accessibilityLabel="Login form"
      accessibilityHint={accessibilityHint || "Sign in to access your account"}
      accessibilityRole="none"
    >
      <View style={styles.logoContainer}>
        <Image
          source={{ uri: 'https://t3.ftcdn.net/jpg/02/98/18/60/360_F_298186090_Rimyxol4jsYvYbQg1i6sttQ5N3oebXgt.jpg' }}
          style={styles.logo}
          accessible={true}
          accessibilityLabel="ECom Example app logo"
          accessibilityRole="image"
        />
        <Typography variant="h1" style={styles.appName} accessibilityRole="header">
          ECom Example
        </Typography>
      </View>

      <View style={styles.welcomeContainer}>
        <Typography variant="h2" style={styles.welcomeTitle} accessibilityRole="header">
          Welcome!
        </Typography>
        <Typography variant="body1" style={styles.welcomeSubtitle}>
          Sign in to continue to our app
        </Typography>
      </View>

      {loginError && (
        <Typography 
          variant="body2" 
          style={styles.errorText}
          accessibilityLabel={`Error: ${loginError}`}
          accessibilityRole="alert"
        >
          {loginError}
        </Typography>
      )}

      <View style={styles.socialButtonsContainer}>
        <SocialLoginButton
          provider="google"
          onPress={handleGoogleLogin}
          loading={isLoading}
          testID={`${testID}-google-button`}
          accessibilityLabel="Sign in with Google"
          accessibilityHint="Continues to Google authentication"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 20,
  },
  appName: {
    marginTop: 10,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  welcomeTitle: {
    marginBottom: 10,
  },
  welcomeSubtitle: {
    textAlign: 'center',
    color: '#666',
  },
  errorText: {
    color: theme.colors.error.main,
    textAlign: 'center',
    marginBottom: 20,
  },
  socialButtonsContainer: {
    marginTop: 10,
  },
});

export default LoginForm;
