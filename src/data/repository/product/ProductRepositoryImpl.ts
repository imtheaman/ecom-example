import ProductDto, { dtoToProduct } from "@domain/dtos/product/ProductDto";
import ProductFiltersDto from "@domain/dtos/product/ProductFiltersDto";
import Product from "@domain/entities/product/Product";
import ProductRepository from "@domain/repository/product/ProductRepository";
import { ApiClient } from "@infrastructure/apiClient";
import ENDPOINTS from "@shared/constants/endpoints";

export default class ProductRepositoryImpl implements ProductRepository {
	apiClient: ApiClient;

	constructor(apiClient: ApiClient) {
		this.apiClient = apiClient;
	}

	async getAllProducts(filters: ProductFiltersDto): Promise<Product[]> {
		try {
			const response = await this.apiClient.get<ProductDto[]>(ENDPOINTS.product.getAllProducts(filters))
			const productDtos = response.data;

			if (!Array.isArray(productDtos)) {
				throw new Error("Invalid response format: expected an array");
			}

			const products = productDtos.map((it: ProductDto) => dtoToProduct(it));
			return products;
		} catch (error: unknown) {
			throw error;
		}
	}

	async getRelatedProductsById(id: number): Promise<Product[]> {
		try {
			const response = await this.apiClient.get<ProductDto[]>(ENDPOINTS.product.getRelatedProductsById(id));
			const productDtos = response.data;

			if (!Array.isArray(productDtos)) {
				throw new Error("Invalid response format: expected an array");
			}

			const products = productDtos.map((it: ProductDto) => dtoToProduct(it));
			return products;
		} catch (error: unknown) {
			throw error;
		}
	}

	async getProductById(id: number): Promise<Product> {
		try {
			console.log("getProductById", ENDPOINTS.product.getProductById(id))
			const response = await this.apiClient.get<ProductDto>(ENDPOINTS.product.getProductById(id));
			console.log("RESPONE", response)
			return dtoToProduct(response.data);
		} catch (error: unknown) {
			throw error;
		}
	}

	async getRelatedProductsBySlug(slug: string): Promise<Product[]> {
		try {
			const response = await this.apiClient.get<ProductDto[]>(ENDPOINTS.product.getRelatedProductsBySlug(slug));
			const productDtos = response.data;

			if (!Array.isArray(productDtos)) {
				throw new Error("Invalid response format: expected an array");
			}

			const products = productDtos.map((it: ProductDto) => dtoToProduct(it));
			return products;
		} catch (error: unknown) {
			throw error;
		}
	}

	async getProductBySlug(slug: string): Promise<Product> {
		try {
			const response = await this.apiClient.get<ProductDto>(ENDPOINTS.product.getProductBySlug(slug));
			return dtoToProduct(response.data);
		} catch (error: unknown) {
			throw error;
		}
	}

	async createProduct(product: Product): Promise<Product> {
		try {
			const response = await this.apiClient.post<ProductDto>(ENDPOINTS.product.createProduct, product);
			return dtoToProduct(response.data);
		} catch (error: unknown) {
			throw error;
		}
	}

	async updateProduct(id: number, product: Product): Promise<Product> {
		try {
			const response = await this.apiClient.put<ProductDto>(ENDPOINTS.product.updateProduct(id), product);
			return dtoToProduct(response.data);
		} catch (error: unknown) {
			throw error;
		}
	}

	async deleteProduct(id: number): Promise<boolean> {
		try {
			const response = await this.apiClient.delete<boolean>(ENDPOINTS.product.deleteProduct(id));
			return response.data;
		} catch (error: unknown) {
			throw error;
		}
	}
}
