import useCustomQuery from "@infrastructure/hooks/useCustomQuery";
import useCustomMutation from "@infrastructure/hooks/useCustomMutation";
import useCustomInfiniteQuery from "@infrastructure/hooks/useCustomInfiniteQuery";
import { UseQueryResult, UseMutationResult, UseInfiniteQueryResult, InvalidateQueryFilters, QueryKey, QueryClient } from "@tanstack/react-query";
import ProductRepository from "@domain/repository/product/ProductRepository";
import ProductFiltersDto from "@domain/dtos/product/ProductFiltersDto";
import Product from "@domain/entities/product/Product";
import CONSTANTS from "@shared/constants";
import useProductStore from "@infrastructure/store/product/productStore";

export const PRODUCT_KEYS = {
	getAllProducts: (filters?: ProductFiltersDto) => {
		const key: any[] = ['getAllProducts'];
		if (filters) key.push(filters);
		return key;
	},
	getRelatedProductsById: (id?: number) => {
		const key: any[] = ['getRelatedProductsById'];
		if (id) key.push(id);
		return key;
	},
	getProductById: (id?: number) => {
		const key: any[] = ['getProductById'];
		if (id) key.push(id);
		return key;
	},
	getRelatedProductsBySlug: (slug?: string) => {
		const key: any[] = ['getRelatedProductsBySlug'];
		if (slug) key.push(slug);
		return key;
	},
	getProductBySlug: (slug?: string) => {
		const key: any[] = ['getProductBySlug'];
		if (slug) key.push(slug);
		return key;
	},
};

export function useGetAllProducts(repository: ProductRepository, filters: ProductFiltersDto = {}): UseInfiniteQueryResult<Product[], Error> {
	const setProducts = useProductStore(state => state.setProducts);

	return useCustomInfiniteQuery({
		queryKey: PRODUCT_KEYS.getAllProducts(filters),
		queryFn: (pageParam) => {
			const limit = filters.limit || CONSTANTS.PAGE_LIMIT;
			const paginatedFilters = {
				...filters,
				offset: (pageParam as number) * limit,
				limit
			};
			return repository.getAllProducts(paginatedFilters);
		},
		getNextPageParam: (lastPage: Product[], allPages: Product[][]) => {
			const limit = filters.limit || CONSTANTS.PAGE_LIMIT;
			if (!lastPage.length || lastPage.length < limit) {
				return undefined;
			}
			return allPages.length + 1;
		},
		syncStore: (data: Product[]) => setProducts(data),
	});
}

export function useGetRelatedProductsById(repository: ProductRepository, id: number): UseQueryResult<Product[], Error> {
	const setRelatedProducts = useProductStore(state => state.setRelatedProducts);

	return useCustomQuery({
		queryKey: PRODUCT_KEYS.getRelatedProductsById(id),
		queryFn: () => repository.getRelatedProductsById(id),
		syncStore: (data: Product[]) => setRelatedProducts(id, data),
	});
}

export function useGetProductById(repository: ProductRepository, id: number): UseQueryResult<Product, Error> {
	const setProductByIdOrSlug = useProductStore(state => state.setProductByIdOrSlug);

	return useCustomQuery({
		queryKey: PRODUCT_KEYS.getProductById(id),
		queryFn: () => repository.getProductById(id),
		syncStore: (data: Product) => setProductByIdOrSlug(id, data),
	});
}

export function useGetRelatedProductsBySlug(repository: ProductRepository, slug: string): UseQueryResult<Product[], Error> {
	const setRelatedProducts = useProductStore(state => state.setRelatedProducts);

	return useCustomQuery({
		queryKey: PRODUCT_KEYS.getRelatedProductsBySlug(slug),
		queryFn: () => repository.getRelatedProductsBySlug(slug),
		syncStore: (data: Product[]) => setRelatedProducts(slug, data),
	});
}

export function useGetProductBySlug(repository: ProductRepository, slug: string): UseQueryResult<Product, Error> {
	const setProductByIdOrSlug = useProductStore(state => state.setProductByIdOrSlug);

	return useCustomQuery({
		queryKey: PRODUCT_KEYS.getProductBySlug(slug),
		queryFn: () => repository.getProductBySlug(slug),
		syncStore: (data: Product) => setProductByIdOrSlug(slug, data),
	});
}

export function useCreateProduct(repository: ProductRepository, queryClient: QueryClient): UseMutationResult<Product, Error, Product, unknown> {
	const createProduct = useProductStore(state => state.createProduct);

	return useCustomMutation({
		mutationFn: (product: Product) => repository.createProduct(product),
		syncStore: (data: Product, variables: Product) => createProduct(data),
		onSuccess: (data: Product, variables: Product) => {
			queryClient.invalidateQueries(PRODUCT_KEYS.getAllProducts() as InvalidateQueryFilters<QueryKey>);
			queryClient.invalidateQueries(PRODUCT_KEYS.getRelatedProductsBySlug() as InvalidateQueryFilters<QueryKey>);
		}
	});
}

export function useUpdateProduct(repository: ProductRepository, queryClient: QueryClient): UseMutationResult<Product, Error, { id: number, product: Product }, unknown> {
	const updateProduct = useProductStore(state => state.updateProduct);

	return useCustomMutation({
		mutationFn: ({ id, product }: { id: number, product: Product }) =>
			repository.updateProduct(id, product),
		syncStore: (data: Product, variables: { id: number, product: Product }) => updateProduct(data),
		onSuccess: (data: Product, variables: { id: number, product: Product }) => {
			queryClient.invalidateQueries(PRODUCT_KEYS.getAllProducts() as InvalidateQueryFilters<QueryKey>);
			queryClient.invalidateQueries(PRODUCT_KEYS.getRelatedProductsBySlug() as InvalidateQueryFilters<QueryKey>);
			queryClient.invalidateQueries(PRODUCT_KEYS.getProductById(variables.id) as InvalidateQueryFilters<QueryKey>);
			queryClient.invalidateQueries(PRODUCT_KEYS.getRelatedProductsById(variables.id) as InvalidateQueryFilters<QueryKey>);
		}
	});
}

export function useDeleteProduct(repository: ProductRepository, queryClient: QueryClient): UseMutationResult<boolean, Error, number, unknown> {
	const deleteProduct = useProductStore(state => state.deleteProduct);

	return useCustomMutation({
		mutationFn: (id: number) => repository.deleteProduct(id),
		syncStore: (data: boolean, variables: number) => deleteProduct(variables),
		onSuccess: (data: boolean, variables: number) => {
			queryClient.invalidateQueries(PRODUCT_KEYS.getAllProducts() as InvalidateQueryFilters<QueryKey>);
			queryClient.invalidateQueries(PRODUCT_KEYS.getRelatedProductsBySlug() as InvalidateQueryFilters<QueryKey>);
			queryClient.invalidateQueries(PRODUCT_KEYS.getProductById(variables) as InvalidateQueryFilters<QueryKey>);
			queryClient.invalidateQueries(PRODUCT_KEYS.getRelatedProductsById(variables) as InvalidateQueryFilters<QueryKey>);
		}
	});
}
