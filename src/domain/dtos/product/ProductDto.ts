import Product from "@domain/entities/product/Product"

export default interface ProductDto {
	id: id,
	title: string,
	slug: slug,
	price: number,
	description: string,
	category: {
		id: id,
		name: string,
		image: link,
		slug: slug,
		creationAt: timestamp,
		updatedAt: timestamp
	},
	images: Array<link>,
	creationAt: timestamp,
	updatedAt: timestamp
}

export function dtoToProduct(param: ProductDto): Product {
	return {
		id: param.id,
		price: param.price,
		slug: param.slug,
		title: param.title,
		description: param.description,
		category: {
			name: param.category.name,
			image: param.category.image,
		},
		images: param.images,
	}
}
