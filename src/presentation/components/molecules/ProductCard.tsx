import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Card from '../atoms/Card';
import Image from '../atoms/Image';
import Typography from '../atoms/Typography';
import PriceText from '../atoms/PriceText';
import Product from '@domain/entities/product/Product';
import { theme } from '@shared/constants';

interface ProductCardProps {
	product: Product;
	onPress: (product: Product) => void;
	testID?: string;
	accessible?: boolean;
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 30) / 2;

const ProductCard: React.FC<ProductCardProps> = ({
	product,
	onPress,
	testID,
	accessible = true,
}) => {
	return (
		<Card
			style={styles.card}
			onPress={() => onPress(product)}
			testID={testID}
			accessible={accessible}
			accessibilityLabel={`${product.title}, ${product.price.toFixed(2)}`}
			accessibilityHint="Double-tap to view product details"
			accessibilityRole="button"
		>
			<Image
				source={{ uri: product.images[0] }}
				style={styles.image}
				resizeMode="cover"
			/>
			<View style={styles.contentContainer}>
				<Typography variant="caption" style={styles.category}>
					{product.category.name}
				</Typography>
				<Typography
					variant="body2"
					style={styles.title}
					numberOfLines={2}
				>
					{product.title}
				</Typography>
				<PriceText price={product.price} size="medium" />
			</View>
		</Card>
	);
};

const styles = StyleSheet.create({
	card: {
		width: CARD_WIDTH,
		margin: theme.spacing.xs,
	},
	image: {
		width: '100%',
		height: 140,
	},
	contentContainer: {
		padding: theme.spacing.md,
	},
	category: {
		marginBottom: theme.spacing.xs,
	},
	title: {
		fontWeight: theme.typography.fontWeight.bold,
		marginBottom: theme.spacing.xs,
		height: 40,
	},
});

export default ProductCard;
