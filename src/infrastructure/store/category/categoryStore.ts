import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import Category from '@domain/entities/category/Category';
import Product from '@domain/entities/product/Product';
import AppModule from '@/di/AppModule';

interface CategoryStateValues {
	categories: Category[];
	productsByCategory: Record<string, Product[]>;
	categoryByIdOrSlug: Record<string, Category>;
	lastUpdated: number | null;
}

interface CategoryStateMethods {
	setCategories: (categories: Category[]) => void;
	setCategoryByIdOrSlug: (idOrSlug: id | slug, category: Category) => void;
	setProductsByCategory: (idOrSlug: id | slug, products: Product[]) => void;
	createCategory: (category: Category) => void;
	updateCategory: (category: Category) => void;
	deleteCategory: (id: number) => void;
	updateLastUpdated: () => void;
}

interface CategoryState extends CategoryStateValues, CategoryStateMethods { }

const categoryStorageAdapter = AppModule.storageService.createJSONStorageAdapter('category-store');

const initialValues: CategoryStateValues = {
	categories: [],
	productsByCategory: {},
	categoryByIdOrSlug: {},
	lastUpdated: null
};

const useCategoryStore = create<CategoryState>()(
	persist(
		immer(
			(set) => ({
				...initialValues,

				setCategories: (categories: Category[]) =>
					set(state => {
						state.categories = categories;
						state.lastUpdated = Date.now();
					}),
				setProductsByCategory: (idOrSlug: id | slug, products: Product[]) =>
					set(state => {
						state.productsByCategory[idOrSlug.toString()] = products;
						state.lastUpdated = Date.now();
					}),
				setCategoryByIdOrSlug: (idOrSlug: id | slug, category: Category) => {
					set(state => {
						state.categoryByIdOrSlug[idOrSlug.toString()] = category;
						state.lastUpdated = Date.now();
					})
				},
				createCategory: (category: Category) =>
					set(state => {
						const existingIndex = state.categories.findIndex(c => c.id === category.id);
						if (existingIndex >= 0) {
							state.categories[existingIndex] = category;
						} else {
							state.categories.push(category);
						}
						state.lastUpdated = Date.now();
					}),
				updateCategory: (category: Category) =>
					set(state => {
						const existingIndex = state.categories.findIndex(c => c.id === category.id);
						if (existingIndex >= 0) {
							state.categories[existingIndex] = category;
							state.lastUpdated = Date.now();
						}
					}),
				deleteCategory: (id: number) =>
					set(state => {
						state.categories = state.categories.filter(c => c.id !== id);
						delete state.productsByCategory[id.toString()];
						state.lastUpdated = Date.now();
					}),
				updateLastUpdated: () =>
					set(state => {
						state.lastUpdated = Date.now();
					}),
			})
		),
		{
			name: 'category-store',
			storage: createJSONStorage(() => categoryStorageAdapter),
			partialize: (state) => ({
				categories: state.categories,
				productsByCategory: state.productsByCategory,
				lastUpdated: state.lastUpdated,
			}),
		}
	)
);

export default useCategoryStore;
