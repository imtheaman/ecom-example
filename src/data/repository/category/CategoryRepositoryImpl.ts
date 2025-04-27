import CategoryDto, { dtoToCategory } from "@domain/dtos/category/CategoryDto";
import ProductDto, { dtoToProduct } from "@domain/dtos/product/ProductDto";
import Category from "@domain/entities/category/Category";
import Product from "@domain/entities/product/Product";
import CategoryRepository from "@domain/repository/category/CategoryRepository";
import ENDPOINTS from "@shared/constants/endpoints";
import { ApiClient } from "@infrastructure/apiClient";
import PaginationFilter from "@shared/domain/entities/PaginationFilter";

export default class CategoryRepositoryImpl implements CategoryRepository {
	apiClient: ApiClient;

	constructor(apiClient: ApiClient) {
		this.apiClient = apiClient;
	}

	async getAllCategories(filters: PaginationFilter): Promise<Category[]> {
		try {
			const response = await this.apiClient.get<CategoryDto[]>(ENDPOINTS.category.getAllCategories(filters));
			const categoryDtos = response.data;

			if (!Array.isArray(categoryDtos)) {
				throw new Error("Invalid response format: expected an array");
			}

			const categories = categoryDtos.map(it => dtoToCategory(it));
			return categories;
		} catch (error: unknown) {
			throw error;
		}
	}

	async getCategoryById(id: number): Promise<Category> {
		try {
			const response = await this.apiClient.get<CategoryDto>(ENDPOINTS.category.getCategoryById(id));
			return dtoToCategory(response.data);
		} catch (error: unknown) {
			throw error;
		}
	}

	async getCategoryBySlug(slug: string): Promise<Category> {
		try {
			const response = await this.apiClient.get<CategoryDto>(ENDPOINTS.category.getCategoryBySlug(slug));
			return dtoToCategory(response.data);
		} catch (error: unknown) {
			throw error;
		}
	}

	async getAllProductsByCategory(id: id, filters: PaginationFilter): Promise<Product[]> {
		try {
			const response = await this.apiClient.get<ProductDto[]>(ENDPOINTS.category.getAllProductsByCategory(id, filters));
			const productDtos = response.data;

			if (!Array.isArray(productDtos)) {
				throw new Error("Invalid response format: expected an array");
			}

			const products = productDtos.map(it => dtoToProduct(it));
			return products;
		} catch (error: unknown) {
			throw error;
		}
	}

	async createCategory(category: Category): Promise<Category> {
		try {
			const response = await this.apiClient.post<CategoryDto>(ENDPOINTS.category.createCategory, category);
			return dtoToCategory(response.data);
		} catch (error: unknown) {
			throw error;
		}
	}

	async updateCategory(id: number, category: Category): Promise<Category> {
		try {
			const response = await this.apiClient.put<CategoryDto>(ENDPOINTS.category.updateCategory(id), category);
			return dtoToCategory(response.data);
		} catch (error: unknown) {
			throw error;
		}
	}

	async deleteCategory(id: number): Promise<boolean> {
		try {
			const response = await this.apiClient.delete<boolean>(ENDPOINTS.category.deleteCategory(id));
			return response.data;
		} catch (error: unknown) {
			throw error;
		}
	}
}
