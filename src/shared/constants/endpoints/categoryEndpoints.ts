import PaginationFilter from "@shared/domain/entities/PaginationFilter";
import { multipleQueryParams } from "@shared/utils/queryUtils";

const categoryEndpoints = {
	getAllCategories: ({ ...filters }: PaginationFilter) => `categories?${multipleQueryParams(filters)}`,
	getCategoryById: (id: id) => `categories/${id}`,
	getCategoryBySlug: (slug: slug) => `categories/slug/${slug}`,
	createCategory: `categories`,
	updateCategory: (id: id) => `categories/${id}`,
	deleteCategory: (id: id) => `categories/${id}`,
	getAllProductsByCategory: (id: id, { ...filters }: PaginationFilter) => `categories/${id}/products?${multipleQueryParams(filters)}`,
}

export default categoryEndpoints;
