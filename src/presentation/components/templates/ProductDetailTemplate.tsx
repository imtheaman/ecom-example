import React from 'react';
import { SafeAreaView, StyleSheet, ScrollView } from 'react-native';
import Product from '@domain/entities/product/Product';
import ProductDetails from '../organisms/ProductDetails';
import RelatedProducts from '../organisms/RelatedProducts';
import Spinner from '../atoms/Spinner';
import ErrorView from '../molecules/ErrorView';
import { theme } from '@shared/constants';

interface ProductDetailTemplateProps {
  product: Product | null;
  relatedProducts: Product[];
  isLoading: boolean;
  relatedLoading: boolean;
  error: Error | null;
  relatedError: Error | null;
  onProductPress: (product: Product) => void;
  onRetry?: () => void;
  onSeeAllRelated?: () => void;
  testID?: string;
  accessibilityLabel?: string;
}

const ProductDetailTemplate: React.FC<ProductDetailTemplateProps> = ({
  product,
  relatedProducts,
  isLoading,
  relatedLoading,
  error,
  relatedError,
  onProductPress,
  onRetry,
  onSeeAllRelated,
  testID,
  accessibilityLabel,
}) => {
  if (isLoading) {
    return (
      <SafeAreaView 
        style={styles.container} 
        testID={testID}
        accessible={true}
        accessibilityLabel="Loading product details"
        accessibilityRole="progressbar"
      >
        <Spinner 
          fullScreen 
          text="Loading product details..."
          testID={`${testID}-loader`}
        />
      </SafeAreaView>
    );
  }

  if (error || !product) {
    return (
      <SafeAreaView 
        style={styles.container} 
        testID={testID}
        accessible={true}
        accessibilityLabel="Error loading product"
        accessibilityRole="alert"
      >
        <ErrorView
          title="Error Loading Product"
          message={error?.message || "Product not found"}
          onRetry={onRetry}
          testID={`${testID}-error`}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView 
      style={styles.container} 
      testID={testID}
      accessible={false}
    >
      <ScrollView
        accessibilityLabel={accessibilityLabel || `Product details for ${product.title}`}
        accessibilityRole="scrollbar"
      >
        <ProductDetails 
          product={product}
          testID={`${testID}-details`}
        />
        
        <RelatedProducts
          title="Related Products"
          products={relatedProducts}
          isLoading={relatedLoading}
          error={relatedError}
          onProductPress={onProductPress}
          onSeeAll={onSeeAllRelated}
          testID={`${testID}-related`}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.default,
  },
});

export default ProductDetailTemplate;
