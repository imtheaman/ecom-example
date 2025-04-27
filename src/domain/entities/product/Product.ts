export default interface Product {
	id: id,
	title: string,
	slug: slug,
	price: number,
	description: string,
	category: {
		name: string,
		image: link,
	},
	images: Array<link>
}
