import ProductFiltersDto from "@domain/dtos/product/ProductFiltersDto";
import Product from "@domain/entities/product/Product";

export default interface ProductRepository {
	getAllProducts(filters: ProductFiltersDto): Promise<Product[]>,
	getRelatedProductsById(id: id): Promise<Product[]>,
	getRelatedProductsBySlug(slug: slug): Promise<Product[]>,
	getProductById(id: id): Promise<Product>,
	getProductBySlug(slug: slug): Promise<Product>,
	createProduct(product: Product): Promise<Product>,
	updateProduct(id: id, product: Product): Promise<Product>,
	deleteProduct(id: id): Promise<boolean>,
}
