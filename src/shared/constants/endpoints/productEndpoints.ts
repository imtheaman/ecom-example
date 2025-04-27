import ProductFiltersDto from "@domain/dtos/product/ProductFiltersDto";
import { multipleQueryParams } from "@shared/utils/queryUtils";

export const productEndpoints = {
	getAllProducts: ({ ...filters }: ProductFiltersDto) => `products?${multipleQueryParams(filters)}`,
	getRelatedProductsById: (id: id) => `products/${id}/related`,
	getRelatedProductsBySlug: (slug: slug) => `products/slug/${slug}/related`,
	getProductById: (id: id) => `products/${id}`,
	getProductBySlug: (slug: slug) => `products/slug/${slug}`,
	createProduct: 'products',
	updateProduct: (id: id) => `products/${id}`,
	deleteProduct: (id: id) => `products/${id}`
}
