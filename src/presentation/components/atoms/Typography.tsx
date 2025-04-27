import React from 'react';
import { Text, StyleSheet, TextProps } from 'react-native';
import { theme } from '@shared/constants';
import { useAccessibility } from '@shared/hooks/useAccessibility';

export type TypographyVariant = 
  | 'h1' 
  | 'h2' 
  | 'h3' 
  | 'body1' 
  | 'body2' 
  | 'caption' 
  | 'label';

interface TypographyProps extends TextProps {
  variant?: TypographyVariant;
  color?: string;
  onPress?: () => void;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

const Typography: React.FC<TypographyProps> = ({
  children,
  variant = 'body1',
  style,
  color,
  numberOfLines,
  onPress,
	testID,
	accessibilityLabel,
	accessibilityHint,
	...props
}) => {
  const { getFontSize } = useAccessibility();
  const getVariantStyle = () => {
    const variantStyle = (() => {
      switch (variant) {
        case 'h1':
          return styles.h1;
        case 'h2':
          return styles.h2;
        case 'h3':
          return styles.h3;
        case 'body2':
          return styles.body2;
        case 'caption':
          return styles.caption;
        case 'label':
          return styles.label;
        case 'body1':
        default:
          return styles.body1;
      }
    })();

    return {
      ...variantStyle,
      fontSize: getFontSize(variantStyle.fontSize),
    };
  };

  return (
    <Text
      style={[
        getVariantStyle(),
        color && { color },
        style,
      ]}
      numberOfLines={numberOfLines}
      onPress={onPress}
			testID={testID}
			accessible={true}
			accessibilityRole="text"
			accessibilityLabel={accessibilityLabel}
			accessibilityHint={accessibilityHint}
			{...props}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  h1: {
    fontSize: theme.typography.fontSize.h1,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
    lineHeight: theme.typography.lineHeight.h1,
  },
  h2: {
    fontSize: theme.typography.fontSize.h2,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
    lineHeight: theme.typography.lineHeight.h2,
  },
  h3: {
    fontSize: theme.typography.fontSize.h3,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
    lineHeight: theme.typography.lineHeight.h3,
  },
  body1: {
    fontSize: theme.typography.fontSize.body1,
    color: theme.colors.text.primary,
    lineHeight: theme.typography.lineHeight.body1,
  },
  body2: {
    fontSize: theme.typography.fontSize.body2,
    color: theme.colors.text.secondary,
    lineHeight: theme.typography.lineHeight.body2,
  },
  caption: {
    fontSize: theme.typography.fontSize.caption,
    color: theme.colors.text.tertiary,
    lineHeight: theme.typography.lineHeight.caption,
  },
  label: {
    fontSize: theme.typography.fontSize.label,
    color: theme.colors.text.tertiary,
    fontWeight: theme.typography.fontWeight.medium,
    lineHeight: theme.typography.lineHeight.label,
  },
});

export default Typography;
