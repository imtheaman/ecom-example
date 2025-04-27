import React from 'react';
import { View, StyleSheet } from 'react-native';
import Product from '@domain/entities/product/Product';
import ImageCarousel from '@molecules/ImageCarousel';
import Typography from '@atoms/Typography';
import PriceText from '@atoms/PriceText';
import { TagIcon } from '@atoms/icons';
import { theme } from '@shared/constants';

interface ProductDetailsProps {
  product: Product;
  testID?: string;
  accessibilityLabel?: string;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({
  product,
  testID,
  accessibilityLabel,
}) => {
  return (
    <View 
      style={styles.container} 
      testID={testID}
      accessible={true}
      accessibilityLabel={accessibilityLabel || `Product details for ${product.title}`}
      accessibilityRole="summary"
    >
      {product.images && product.images.length > 0 && (
        <ImageCarousel 
          images={product.images} 
          height={300}
          testID={`${testID}-carousel`}
        />
      )}

      <View style={styles.contentContainer}>
        <Typography 
          variant="h1" 
          style={styles.title}
          testID={`${testID}-title`}
          accessibilityRole="header"
        >
          {product.title}
        </Typography>
        
        <View style={styles.categoryPriceContainer}>
          <View style={styles.categoryContainer}>
            <TagIcon color={theme.colors.text.tertiary} />
            <Typography 
              variant="caption" 
              style={styles.category}
              testID={`${testID}-category`}
              accessibilityLabel={`Category: ${product.category.name}`}
            >
              {product.category.name}
            </Typography>
          </View>
          <PriceText 
            price={product.price} 
            size="large"
            testID={`${testID}-price`}
          />
        </View>

        <View style={styles.descriptionContainer}>
          <Typography 
            variant="h3" 
            style={styles.descriptionTitle}
            testID={`${testID}-description-title`}
            accessibilityRole="header"
          >
            Description
          </Typography>
          <Typography 
            variant="body1" 
            style={styles.description}
            testID={`${testID}-description`}
            accessibilityLabel={`Description: ${product.description}`}
          >
            {product.description}
          </Typography>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    padding: 15,
  },
  title: {
    marginBottom: 10,
  },
  categoryPriceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  category: {
    marginLeft: 5,
  },
  descriptionContainer: {
    marginBottom: 20,
  },
  descriptionTitle: {
    marginBottom: 10,
  },
  description: {
    lineHeight: 24,
  },
});

export default ProductDetails;
