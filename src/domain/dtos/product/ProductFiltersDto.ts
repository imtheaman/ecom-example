import PaginationFilter from "@shared/domain/entities/PaginationFilter";

export default interface ProductFiltersDto extends PaginationFilter {
	title?: string,
	price?: number,
	price_min?: number,
	price_max?: number,
	categoryId?: number,
	categorySlug?: string,
}
