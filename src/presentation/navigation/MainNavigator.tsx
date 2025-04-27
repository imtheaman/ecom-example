import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { MainStackParamList } from './types';
import AuthNavigator from './AuthNavigator';
import ProductNavigator from './ProductNavigator';
import useAuthStore from '@infrastructure/store/auth/authStore';

const Stack = createStackNavigator<MainStackParamList>();

const MainNavigator = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        ) : (
          <Stack.Screen name="ProductStack" component={ProductNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MainNavigator;
