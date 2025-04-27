import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ProductStackParamList } from './types';
import ProductListScreen from '../screens/product/ProductListScreen';
import ProductDetailScreen from '../screens/product/ProductDetailScreen';

const Stack = createStackNavigator<ProductStackParamList>();

const ProductNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="ProductList"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#1a73e8',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="ProductList" 
        component={ProductListScreen} 
        options={{ title: 'Products' }}
      />
      <Stack.Screen 
        name="ProductDetail" 
        component={ProductDetailScreen} 
        options={{ 
          title: 'Product Details'
        }}
      />
    </Stack.Navigator>
  );
};

export default ProductNavigator;
