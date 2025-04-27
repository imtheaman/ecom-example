import useCustomQuery from "@infrastructure/hooks/useCustomQuery";
import useCustomMutation from "@infrastructure/hooks/useCustomMutation";
import useCustomInfiniteQuery from "@infrastructure/hooks/useCustomInfiniteQuery";
import { UseQueryResult, UseMutationResult, UseInfiniteQueryResult, InvalidateQueryFilters, QueryKey, QueryClient } from "@tanstack/react-query";
import CategoryRepository from "@domain/repository/category/CategoryRepository";
import PaginationFilter from "@shared/domain/entities/PaginationFilter";
import Category from "@domain/entities/category/Category";
import Product from "@domain/entities/product/Product";
import CONSTANTS from "@shared/constants";
import useCategoryStore from "@infrastructure/store/category/categoryStore";

export const CATEGORY_KEYS = {
	getAllCategories: (filters?: PaginationFilter) => {
		const key: any[] = ['getAllCategories'];
		if (filters) key.push(filters);
		return key;
	},
	getCategoryById: (id?: number) => {
		const key: any[] = ['getCategoryById'];
		if (id) key.push(id);
		return key;
	},
	getCategoryBySlug: (slug?: string) => {
		const key: any[] = ['getCategoryBySlug'];
		if (slug) key.push(slug);
		return key;
	},
	getAllProductsByCategory: (id?: number, filters?: PaginationFilter) => {
		const key: any[] = ['getAllProductsByCategory'];
		if (id) key.push(id);
		if (filters) key.push(filters);
		return key;
	},
};

export function useGetAllCategories(repository: CategoryRepository, filters: PaginationFilter = {}): UseInfiniteQueryResult<Category[], Error> {
	const setCategories = useCategoryStore(state => state.setCategories);

	return useCustomInfiniteQuery({
		queryKey: CATEGORY_KEYS.getAllCategories(filters),
		queryFn: (pageParam) => {
			const limit = filters.limit || CONSTANTS.PAGE_LIMIT;
			const paginatedFilters = {
				...filters,
				offset: (pageParam as number) * limit,
				limit
			};
			return repository.getAllCategories(paginatedFilters);
		},
		getNextPageParam: (lastPage: Category[], allPages: Category[][]) => {
			const limit = filters.limit || CONSTANTS.PAGE_LIMIT;
			if (!lastPage.length || lastPage.length < limit) {
				return undefined;
			}
			return allPages.length + 1;
		},
		syncStore: (data: Category[]) => setCategories(data),
	});
}

export function useGetCategoryById(repository: CategoryRepository, id: number): UseQueryResult<Category, Error> {
	const setCategoryByIdOrSlug = useCategoryStore(state => state.setCategoryByIdOrSlug);

	return useCustomQuery({
		queryKey: CATEGORY_KEYS.getCategoryById(id),
		queryFn: () => repository.getCategoryById(id),
		syncStore: (data: Category) => setCategoryByIdOrSlug(id, data),
	});
}

export function useGetCategoryBySlug(repository: CategoryRepository, slug: string): UseQueryResult<Category, Error> {
	const setCategoryByIdOrSlug = useCategoryStore(state => state.setCategoryByIdOrSlug);

	return useCustomQuery({
		queryKey: CATEGORY_KEYS.getCategoryBySlug(slug),
		queryFn: () => repository.getCategoryBySlug(slug),
		syncStore: (data: Category) => setCategoryByIdOrSlug(slug, data),
	});
}

export function useGetAllProductsByCategory(repository: CategoryRepository, id: number, filters: PaginationFilter = {}): UseInfiniteQueryResult<Product[], Error> {
	const setProductsByCategory = useCategoryStore(state => state.setProductsByCategory);

	return useCustomInfiniteQuery({
		queryKey: CATEGORY_KEYS.getAllProductsByCategory(id, filters),
		queryFn: (pageParam) => {
			const limit = filters.limit || CONSTANTS.PAGE_LIMIT;
			const paginatedFilters = {
				...filters,
				offset: (pageParam as number) * limit,
				limit
			};
			return repository.getAllProductsByCategory(id, paginatedFilters);
		},
		getNextPageParam: (lastPage: Product[], allPages: Product[][]) => {
			const limit = filters.limit || CONSTANTS.PAGE_LIMIT;
			if (!lastPage.length || lastPage.length < limit) {
				return undefined;
			}
			return allPages.length + 1;
		},
		syncStore: (data: Product[]) => setProductsByCategory(id, data),
	});
}

export function useCreateCategory(repository: CategoryRepository, queryClient: QueryClient): UseMutationResult<Category, Error, Category, unknown> {
	const createCategory = useCategoryStore(state => state.createCategory);

	return useCustomMutation({
		mutationFn: (category: Category) => repository.createCategory(category),
		syncStore: (data: Category, variables: Category) => createCategory(data),
		onSuccess: (data: Category, variables: Category) => {
			queryClient.invalidateQueries(CATEGORY_KEYS.getAllCategories() as InvalidateQueryFilters<QueryKey>);
			queryClient.invalidateQueries(CATEGORY_KEYS.getAllProductsByCategory(data.id) as InvalidateQueryFilters<QueryKey>);
		}
	});
}

export function useUpdateCategory(repository: CategoryRepository, queryClient: QueryClient): UseMutationResult<Category, Error, { id: number, category: Category }, unknown> {
	const updateCategory = useCategoryStore(state => state.updateCategory);

	return useCustomMutation({
		mutationFn: ({ id, category }: { id: number, category: Category }) =>
			repository.updateCategory(id, category),
		syncStore: (data: Category, variables: { id: number, category: Category }) => updateCategory(data),
		onSuccess: (data: Category, variables: { id: number, category: Category }) => {
			queryClient.invalidateQueries(CATEGORY_KEYS.getAllCategories() as InvalidateQueryFilters<QueryKey>);
			queryClient.invalidateQueries(CATEGORY_KEYS.getAllProductsByCategory(data.id) as InvalidateQueryFilters<QueryKey>);
		}
	});
}

export function useDeleteCategory(repository: CategoryRepository, queryClient: QueryClient): UseMutationResult<boolean, Error, number, unknown> {
	const deleteCategory = useCategoryStore(state => state.deleteCategory);

	return useCustomMutation({
		mutationFn: (id: number) => repository.deleteCategory(id),
		syncStore: (data: boolean, variables: number) => deleteCategory(variables),
		onSuccess: (data: boolean, variables: number) => {
			queryClient.invalidateQueries(CATEGORY_KEYS.getAllCategories() as InvalidateQueryFilters<QueryKey>);
			queryClient.invalidateQueries(CATEGORY_KEYS.getAllProductsByCategory(variables) as InvalidateQueryFilters<QueryKey>);
		}
	});
}
