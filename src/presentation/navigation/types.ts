import { NavigatorScreenParams } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';

export type AuthStackParamList = {
  Login: undefined;
};

export type ProductStackParamList = {
  ProductList: undefined;
  ProductDetail: { productId: number | string };
};

export type MainStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  ProductStack: NavigatorScreenParams<ProductStackParamList>;
};

export type AuthStackScreenProps<T extends keyof AuthStackParamList> = StackScreenProps<
  AuthStackParamList,
  T
>;

export type ProductStackScreenProps<T extends keyof ProductStackParamList> = StackScreenProps<
  ProductStackParamList,
  T
>;

export type MainStackScreenProps<T extends keyof MainStackParamList> = StackScreenProps<
  MainStackParamList,
  T
>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends MainStackParamList {}
  }
}
