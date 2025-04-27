import React from 'react';
import { RefreshControl, StyleSheet, StyleProp, View, ViewStyle } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import Product from '@domain/entities/product/Product';
import ProductCard from '@molecules/ProductCard';
import Spinner from '@atoms/Spinner';
import EmptyView from '@molecules/EmptyView';
import ErrorView from '@molecules/ErrorView';
import { theme } from '@shared/constants';

interface ProductListProps {
	products: Product[];
	isLoading: boolean;
	isRefreshing?: boolean;
	isFetchingNextPage?: boolean;
	error: Error | null;
	onProductPress: (product: Product) => void;
	onEndReached?: () => void;
	onRefresh?: () => void;
	ListHeaderComponent?: React.ReactElement;
	style?: StyleProp<ViewStyle>;
	contentContainerStyle?: StyleProp<ViewStyle>;
	testID?: string;
	accessibilityLabel?: string;
}

const ESTIMATED_ITEM_HEIGHT = 260;

const ProductList: React.FC<ProductListProps> = ({
	products,
	isLoading,
	isRefreshing = false,
	isFetchingNextPage = false,
	error,
	onProductPress,
	onEndReached,
	onRefresh,
	ListHeaderComponent,
	style,
	contentContainerStyle,
	testID,
	accessibilityLabel,
}) => {
	if (error) {
		return (
			<ErrorView
				title="Error Loading Products"
				message={error.message}
				onRetry={onRefresh}
				testID={`${testID}-error`}
			/>
		);
	}

	const mergedContentContainerStyle = StyleSheet.flatten([
		styles.contentContainer,
		contentContainerStyle,
	]);

	return (
		<FlashList
			data={products}
			renderItem={({ item }) => (
				<View style={styles.itemWrapper} accessible={false}>
					<ProductCard
						product={item}
						onPress={onProductPress}
						testID={`${testID}-item-${item.id}`}
						accessible={true}
					/>
				</View>
			)}
			keyExtractor={item => item.id.toString()}
			numColumns={2}
			estimatedItemSize={ESTIMATED_ITEM_HEIGHT}
			contentContainerStyle={mergedContentContainerStyle}
			style={style}
			onEndReached={onEndReached}
			onEndReachedThreshold={0.5}
			ListHeaderComponent={ListHeaderComponent}
			ListFooterComponent={
				isFetchingNextPage ? (
					<Spinner
						text="Loading more products..."
						size="small"
						style={styles.footerLoader}
						testID={`${testID}-footer-loader`}
					/>
				) : null
			}
			ListEmptyComponent={
				!isLoading ? (
					<EmptyView
						title="No Products Found"
						message="Try adjusting your search or filters"
						testID={`${testID}-empty`}
						accessibilityLabel="No products found. Try adjusting your search or filters."
					/>
				) : (
					<Spinner
						text="Loading products..."
						style={styles.emptyLoader}
						testID={`${testID}-empty-loader`}
					/>
				)
			}
			refreshControl={
				onRefresh ? (
					<RefreshControl
						refreshing={isRefreshing}
						onRefresh={onRefresh}
						colors={[theme.colors.primary.main]}
						tintColor={theme.colors.primary.main}
						accessibilityLabel="Pull to refresh products"
						accessibilityHint="Swipe down to refresh the product list"
					/>
				) : undefined
			}
			testID={testID}
			accessible={false}
			accessibilityLabel={accessibilityLabel || 'Product list'}
		/>
	);
};

const styles = StyleSheet.create({
	contentContainer: {
		padding: 5,
		flex: 1,
	},
	itemWrapper: {
		flex: 1,
		margin: 5,
	},
	footerLoader: {
		paddingVertical: 20,
	},
	emptyLoader: {
		paddingVertical: 50,
	},
});

export default ProductList;
