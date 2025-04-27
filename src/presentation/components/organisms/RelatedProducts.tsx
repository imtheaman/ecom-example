import React from 'react';
import { View, StyleSheet, TouchableOpacity, } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import Product from '@domain/entities/product/Product';
import ProductCard from '../molecules/ProductCard';
import Typography from '../atoms/Typography';
import Spinner from '../atoms/Spinner';
import ErrorView from '../molecules/ErrorView';
import { theme } from '@shared/constants';

interface RelatedProductsProps {
	title?: string;
	products: Product[];
	isLoading: boolean;
	error: Error | null;
	onProductPress: (product: Product) => void;
	onSeeAll?: () => void;
	testID?: string;
	accessibilityLabel?: string;
}

const ESTIMATED_ITEM_SIZE = 190;

const RelatedProducts: React.FC<RelatedProductsProps> = ({
	title = 'Related Products',
	products,
	isLoading,
	error,
	onProductPress,
	onSeeAll,
	testID,
	accessibilityLabel,
}) => {
	if (isLoading) {
		return (
			<View
				style={styles.container}
				testID={testID}
				accessible={true}
				accessibilityLabel="Loading related products"
				accessibilityRole="progressbar"
			>
				<View style={styles.header}>
					<Typography variant="h3" accessibilityRole="header">{title}</Typography>
				</View>
				<Spinner
					size="small"
					text="Loading related products..."
					testID={`${testID}-loader`}
				/>
			</View>
		);
	}

	if (error) {
		return (
			<View
				style={styles.container}
				testID={testID}
				accessible={true}
				accessibilityLabel="Error loading related products"
				accessibilityRole="alert"
			>
				<View style={styles.header}>
					<Typography variant="h3" accessibilityRole="header">{title}</Typography>
				</View>
				<ErrorView
					title="Could not load related products"
					message={error.message}
					testID={`${testID}-error`}
				/>
			</View>
		);
	}

	if (!products || products.length === 0) {
		return null;
	}

	return (
		<View
			style={styles.container}
			testID={testID}
			accessible={true}
			accessibilityLabel={accessibilityLabel || `${title} section with ${products.length} items`}
			accessibilityRole="summary"
		>
			<View style={styles.header}>
				<Typography variant="h3" accessibilityRole="header">{title}</Typography>
				{onSeeAll && (
					<TouchableOpacity
						onPress={onSeeAll}
						testID={`${testID}-see-all`}
						accessible={true}
						accessibilityRole="button"
						accessibilityLabel="See all related products"
						accessibilityHint="Shows the complete list of related products"
					>
						<Typography variant="body2" style={styles.seeAll}>
							See All
						</Typography>
					</TouchableOpacity>
				)}
			</View>

			<FlashList
				data={products}
				renderItem={({ item }) => (
					<View style={styles.cardWrapper} accessible={false}>
						<ProductCard
							product={item}
							onPress={onProductPress}
							testID={`${testID}-item-${item.id}`}
							accessible={true}
						/>
					</View>
				)}
				keyExtractor={item => item.id.toString()}
				horizontal
				showsHorizontalScrollIndicator={false}
				estimatedItemSize={ESTIMATED_ITEM_SIZE}
				contentContainerStyle={styles.listContent}
				testID={`${testID}-list`}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		marginTop: 20,
		marginBottom: 10,
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 15,
		marginBottom: 10,
	},
	seeAll: {
		color: theme.colors.primary.main,
	},
	listContent: {
		paddingHorizontal: 10,
		paddingBottom: 5,
	},
	cardWrapper: {
		width: 180,
		marginRight: 10,
	},
});

export default RelatedProducts;
