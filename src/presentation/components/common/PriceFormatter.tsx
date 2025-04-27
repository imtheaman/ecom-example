import React from 'react';
import { Text, StyleSheet, TextProps } from 'react-native';

interface PriceFormatterProps extends TextProps {
	price: number;
	currency?: string;
	locale?: string;
}

const PriceFormatter: React.FC<PriceFormatterProps> = ({
	price,
	currency = 'USD',
	locale = 'en-US',
	style,
	testID,
	...props
}) => {
	const formattedPrice = new Intl.NumberFormat(locale, {
		style: 'currency',
		currency,
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	}).format(price);

	return <Text
		style={[styles.price, style]}
		testID={testID}
		{...props}
	>{formattedPrice}</Text>;
};

const styles = StyleSheet.create({
	price: {
		fontWeight: 'bold',
		fontSize: 16,
		color: '#e91e63',
	},
});

export default PriceFormatter;
