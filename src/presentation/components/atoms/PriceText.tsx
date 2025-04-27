import React from 'react';
import { StyleSheet, StyleProp, TextStyle, TextProps } from 'react-native';
import Typography from './Typography';
import { theme } from '@shared/constants';

interface PriceTextProps extends TextProps {
  price: number;
  currency?: string;
  locale?: string;
  size?: 'small' | 'medium' | 'large';
}

const PriceText: React.FC<PriceTextProps> = ({
  price,
  currency = 'USD',
  locale = 'en-US',
  style,
  size = 'medium',
  testID,
	...props
}) => {
  const formattedPrice = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);

  const getSizeStyle = () => {
    switch (size) {
      case 'small':
        return styles.small;
      case 'large':
        return styles.large;
      case 'medium':
      default:
        return styles.medium;
    }
  };

  return (
    <Typography 
      style={[styles.price, getSizeStyle(), style]}
      testID={testID}
			{...props}
    >
      {formattedPrice}
    </Typography>
  );
};

const styles = StyleSheet.create({
  price: {
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.secondary.main,
  },
  small: {
    fontSize: theme.typography.fontSize.small,
  },
  medium: {
    fontSize: theme.typography.fontSize.medium,
  },
  large: {
    fontSize: theme.typography.fontSize.large,
  },
});

export default PriceText;
