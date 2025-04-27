import React from 'react';
import { SafeAreaView, StyleSheet, KeyboardAvoidingView, Platform, StatusBar } from 'react-native';
import LoginForm from '../organisms/LoginForm';

interface LoginTemplateProps {
  onGoogleLogin: () => Promise<void>;
  isLoading?: boolean;
  testID?: string;
}

const LoginTemplate: React.FC<LoginTemplateProps> = ({
  onGoogleLogin,
  isLoading = false,
  testID,
}) => {
  return (
    <SafeAreaView style={styles.container} testID={testID}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <LoginForm 
          onGoogleLogin={onGoogleLogin}
          isLoading={isLoading}
          testID={`${testID}-form`}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardView: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default LoginTemplate;
