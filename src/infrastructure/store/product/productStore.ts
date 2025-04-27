import { create } from 'zustand';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import Product from '@domain/entities/product/Product';
import { StorageService } from '@infrastructure/storage/StorageService';
import AppModule from '@/di/AppModule';

interface ProductStateValues {
	products: Product[];
	relatedProducts: Record<string, Product[]>;
	productByIdOrSlug: Record<string, Product>;
	lastUpdated: number | null;
}

interface ProductStateMethods {
	setProducts: (products: Product[]) => void;
	setRelatedProducts: (idOrSlug: id | slug, products: Product[]) => void;
	setProductByIdOrSlug: (idOrSlug: id | slug, product: Product) => void;
	createProduct: (product: Product) => void;
	updateProduct: (product: Product) => void;
	deleteProduct: (id: id) => void;
	updateLastUpdated: () => void;
}

interface ProductState extends ProductStateValues, ProductStateMethods { }

const productStorageAdapter = AppModule.storageService.createJSONStorageAdapter('product-store');

const initialState: ProductStateValues = {
	products: [],
	relatedProducts: {},
	productByIdOrSlug: {},
	lastUpdated: null
};

const useProductStore = create<ProductState>()(
	persist(
		immer(
			(set) => ({
				...initialState,
				setProducts: (products: Product[]) =>
					set(state => {
						state.products = products;
						state.lastUpdated = Date.now();
					}),
				createProduct: (product: Product) =>
					set(state => {
						const existingIndex = state.products.findIndex(p => p.id === product.id);
						if (existingIndex >= 0) {
							throw new Error('Product already exists.')
						} else {
							state.products.push(product);
						}
						state.lastUpdated = Date.now();
					}),
				updateProduct: (product: Product) =>
					set(state => {
						const existingIndex = state.products.findIndex(p => p.id === product.id);
						if (existingIndex >= 0) {
							state.products[existingIndex] = product;
							state.lastUpdated = Date.now();
						}
					}),
				deleteProduct: (id: number) =>
					set(state => {
						state.products = state.products.filter(p => p.id !== id);
						state.lastUpdated = Date.now();
					}),
				setRelatedProducts: (idOrSlug, products: Product[]) =>
					set(state => {
						state.relatedProducts[idOrSlug.toString()] = products;
						state.lastUpdated = Date.now();
					}),
				setProductByIdOrSlug: (idOrSlug, product: Product) => {
					set(state => {
						state.productByIdOrSlug[idOrSlug.toString()] = product;
						state.lastUpdated = Date.now();
					})
				},
				updateLastUpdated: () =>
					set(state => {
						state.lastUpdated = Date.now();
					}),
			})
		),
		{
			name: 'product-store',
			storage: createJSONStorage(() => productStorageAdapter),
			partialize: (state) => ({
				products: state.products,
				relatedProducts: state.relatedProducts,
				lastUpdated: state.lastUpdated,
			}),
		}
	)
);

export default useProductStore;
