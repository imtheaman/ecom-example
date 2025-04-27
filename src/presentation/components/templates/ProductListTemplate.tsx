import React from 'react';
import { SafeAreaView, StyleSheet, View, TouchableOpacity } from 'react-native';
import Product from '@domain/entities/product/Product';
import SearchBar from '../molecules/SearchBar';
import ProductList from '../organisms/ProductList';
import { LogoutIcon } from '../atoms/icons';

interface ProductListTemplateProps {
	products: Product[];
	searchQuery: string;
	isLoading: boolean;
	isRefreshing?: boolean;
	isFetchingNextPage?: boolean;
	error: Error | null;
	onSearchChange: (query: string) => void;
	onClearSearch: () => void;
	onProductPress: (product: Product) => void;
	onEndReached?: () => void;
	onRefresh?: () => void;
	onSignOut?: () => void;
	testID?: string;
}

const ProductListTemplate: React.FC<ProductListTemplateProps> = ({
	products,
	searchQuery,
	isLoading,
	isRefreshing = false,
	isFetchingNextPage = false,
	error,
	onSearchChange,
	onClearSearch,
	onProductPress,
	onEndReached,
	onRefresh,
	onSignOut,
	testID,
}) => {
	return (
		<SafeAreaView style={styles.container} testID={testID}>
			<View style={styles.header}>
				<SearchBar
					value={searchQuery}
					onChangeText={onSearchChange}
					onClear={onClearSearch}
					placeholder="Search products by title..."
					testID={`${testID}-search`}
				/>

				{onSignOut && (
					<TouchableOpacity
						style={styles.signOutButton}
						onPress={onSignOut}
						testID={`${testID}-sign-out`}
					>
						<LogoutIcon color="#1a73e8" />
					</TouchableOpacity>
				)}
			</View>

			<ProductList
				products={products}
				isLoading={isLoading}
				isRefreshing={isRefreshing}
				isFetchingNextPage={isFetchingNextPage}
				error={error}
				onProductPress={onProductPress}
				onEndReached={onEndReached}
				onRefresh={onRefresh}
				testID={`${testID}-product-list`}
			/>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f8f8f8',
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingRight: 10,
	},
	signOutButton: {
		padding: 10,
	},
});

export default ProductListTemplate;
