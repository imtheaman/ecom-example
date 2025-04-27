import Category from "@domain/entities/category/Category";

export default interface CategoryDto {
	id: id,
	name: string,
	slug: slug,
	image: link,
	creationAt: timestamp,
	updatedAt: timestamp
}

export function dtoToCategory(param: CategoryDto): Category {
	return {
		id: param.id,
		name: param.name,
		slug: param.slug,
		image: param.image,
	}
}
