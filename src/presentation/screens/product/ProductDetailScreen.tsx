import React from 'react';
import { useGetProductById, useGetRelatedProductsById } from '@infrastructure/data-manager/product/ProductManager';
import AppModule from '@/di/AppModule';
import { ProductStackScreenProps } from '../../navigation/types';
import ProductDetailTemplate from '../../components/templates/ProductDetailTemplate';
import Product from '@domain/entities/product/Product';

const ProductDetailScreen: React.FC<ProductStackScreenProps<'ProductDetail'>> = ({
	route,
	navigation,
}) => {
	const { productId } = route.params;
	const productRepository = AppModule.productRepository;

	const {
		data = {} as Product,
		isLoading,
		error,
		refetch
	} = useGetProductById(
		productRepository,
		Number(productId)
	);

	const {
		data: relatedProducts = [] as Product[],
		isLoading: isLoadingRelated,
		error: relatedError,
	} = useGetRelatedProductsById(productRepository, Number(productId));

	const handleProductPress = (selectedProduct: Product) => {
		navigation.push('ProductDetail', {
			productId: selectedProduct.id
		});
	};

	return (
		<ProductDetailTemplate
			product={data}
			relatedProducts={relatedProducts}
			isLoading={isLoading}
			relatedLoading={isLoadingRelated}
			error={error}
			relatedError={relatedError}
			onProductPress={handleProductPress}
			onRetry={refetch}
			testID="product-detail-screen"
		/>
	);
};

export default ProductDetailScreen;
