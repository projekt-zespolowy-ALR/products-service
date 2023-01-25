import type ProductEntity from "./ProductEntity.js";
import type Product from "../types/Product.d.js";

function deentitifyProduct(product: ProductEntity): Product {
	console.log("deentitifyProduct", product);
	return {
		id: product.id,
		name: product.name,
		slug: product.slug,
		mass: product.mass,
		volume: product.volume,
		brandId: product.brandId,

		categoriesIds: product.inCategories.map((productInCategory) => productInCategory.categoryId),
		inDataSourcesIds: product.inDataSources.map(
			(productInDataSource) => productInDataSource.dataSourceId
		),

		ingredientsIds:
			product.ingredientsList === null
				? null
				: product.ingredientsList.inIngredients.map((inIngredient) => inIngredient.ingredientId),
	};
}

export default deentitifyProduct;
