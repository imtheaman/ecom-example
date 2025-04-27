import Category from "@domain/entities/category/Category";
import Product from "@domain/entities/product/Product";
import PaginationFilter from "@shared/domain/entities/PaginationFilter";

export default interface CategoryRepository {
	getAllCategories(filters: PaginationFilter): Promise<Category[]>,
	getCategoryById(id: id): Promise<Category>,
	getCategoryBySlug(slug: slug): Promise<Category>,
	createCategory(category: Category): Promise<Category>,
	updateCategory(id: id, category: Category): Promise<Category>,
	deleteCategory(id: id): Promise<boolean>,
	getAllProductsByCategory(id: id, params: PaginationFilter): Promise<Product[]>,
}
