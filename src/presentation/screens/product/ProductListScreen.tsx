import React, { useState, useMemo } from 'react';
import { useGetAllProducts } from '@infrastructure/data-manager/product/ProductManager';
import AppModule from '@/di/AppModule';
import useAuthStore from '@infrastructure/store/auth/authStore';
import ProductListTemplate from '../../components/templates/ProductListTemplate';
import { ProductStackScreenProps } from '../../navigation/types';
import Product from '@domain/entities/product/Product';

function filterProducts(products: Product[], query: string): Product[] {
	if (!query) return products;
	const q = query.trim().toLowerCase();
	return products.filter(p => p.title.toLowerCase().includes(q));
}

const ProductListScreen: React.FC<ProductStackScreenProps<'ProductList'>> = ({
	navigation,
}) => {
	const productRepository = AppModule.productRepository;
	const { clearAuth } = useAuthStore();

	const [searchQuery, setSearchQuery] = useState('');

	const {
		data: allProducts = [],
		isLoading,
		isFetching,
		isFetchingNextPage,
		error,
		refetch,
		fetchNextPage,
		hasNextPage,
	} = useGetAllProducts(productRepository);

	const handleSearchChange = (text: string) => {
		setSearchQuery(text);
	};

	const handleClearSearch = () => {
		setSearchQuery('');
	};

	const filtered = useMemo(
		() => filterProducts(allProducts, searchQuery),
		[allProducts, searchQuery]
	);

	const handleEndReached = () => {
		if (searchQuery) {
			return;
		}
		if (hasNextPage && !isLoading) {
			fetchNextPage();
		}
	};

	const handleSignOut = async () => {
		try {
			await AppModule.authRepository.signOutWithGoogle();
			clearAuth();
		} catch (error: unknown) {
			throw error;
		}
	};

	const handleProductPress = (product: Product) =>
		navigation.navigate('ProductDetail', { productId: product.id });

	return (
		<ProductListTemplate
			products={filtered}
			searchQuery={searchQuery}
			isLoading={isLoading}
			isRefreshing={isFetching && !isLoading}
			isFetchingNextPage={isFetchingNextPage}
			error={error}
			onSearchChange={handleSearchChange}
			onClearSearch={handleClearSearch}
			onProductPress={handleProductPress}
			onEndReached={handleEndReached}
			onRefresh={refetch}
			onSignOut={handleSignOut}
			testID="product-list-screen"
		/>
	);
};

export default ProductListScreen;
