import React from 'react';
import { View, StyleSheet } from 'react-native';
import Typography from '../atoms/Typography';
import Button from '../atoms/Button';
import { AlertIcon } from '../atoms/icons';
import { theme } from '@shared/constants';

interface ErrorViewProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryButtonText?: string;
  testID?: string;
}

const ErrorView: React.FC<ErrorViewProps> = ({
  title = 'Something went wrong',
  message = 'An error occurred while loading data',
  onRetry,
  retryButtonText = 'Try Again',
  testID,
}) => {
  return (
    <View style={styles.container} testID={testID}>
      <AlertIcon width={60} height={60} color={theme.colors.error.main} />
      <Typography variant="h2" style={styles.title}>
        {title}
      </Typography>
      <Typography variant="body1" style={styles.message}>
        {message}
      </Typography>
      {onRetry && (
        <Button
          title={retryButtonText}
          onPress={onRetry}
          variant="primary"
          style={styles.button}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: theme.colors.error.main,
    marginTop: theme.spacing.base,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  message: {
    color: theme.colors.text.tertiary,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  button: {
    minWidth: 150,
  },
});

export default ErrorView;