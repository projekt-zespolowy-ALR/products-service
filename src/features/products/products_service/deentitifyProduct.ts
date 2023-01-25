import type ProductEntity from "./ProductEntity.js";
import type Product from "../types/Product.d.js";

function deentitifyProduct(product: ProductEntity): Product {
	return {
		id: product.id,
		name: product.name,
		slug: product.slug,
		mass: product.mass,
		volume: product.volume,
		brandId: null,

		categoriesIds: product.categories.map((category) => category.id),
		inDataSourcesIds: [],
		ingredientsIds: [],
	};
}

export default deentitifyProduct;
