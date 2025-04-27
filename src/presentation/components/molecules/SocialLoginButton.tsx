import React from 'react';
import { StyleSheet, Image, StyleProp, ViewStyle, ButtonProps } from 'react-native';
import Button from '@atoms/Button';
import { theme } from '@shared/constants';

type SocialProvider = 'google';

interface SocialLoginButtonProps extends ButtonProps {
  provider: SocialProvider;
  onPress: () => void;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

const SocialLoginButton: React.FC<SocialLoginButtonProps> = ({
  provider,
  onPress,
  loading = false,
  style,
  testID,
  accessibilityLabel,
  accessibilityHint,
}) => {
  const getProviderText = () => {
    switch (provider) {
      case 'google':
        return 'Sign in with Google';
      default:
        return 'Sign in';
    }
  };

  const getProviderIcon = () => {
    switch (provider) {
      case 'google':
        return (
          <Image
            source={{
              uri: 'https://cdn.iconscout.com/icon/free/png-256/google-160-189824.png',
            }}
            style={styles.icon}
            accessible={false}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Button
      title={getProviderText()}
      onPress={onPress}
      variant="outline"
      loading={loading}
      leftIcon={getProviderIcon()}
      style={[styles.button, style]}
      textStyle={styles.buttonText}
      testID={testID}
      accessibilityLabel={accessibilityLabel || getProviderText()}
      accessibilityHint={accessibilityHint || `Authenticate using your ${provider} account`}
    />
  );
};

const styles = StyleSheet.create({
  button: {
    marginVertical: 10,
    width: '100%',
    backgroundColor: theme.colors.background.default,
    borderColor: theme.colors.grey[300],
  },
  buttonText: {
    color: theme.colors.text.primary,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
});

export default SocialLoginButton;
