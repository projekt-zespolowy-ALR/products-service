import type ProductEntity from "./ProductEntity.js";
import type Product from "../types/Product.d.js";

function deentitifyProduct(productEntity: ProductEntity): Product {
	return {
		id: productEntity.id,
		name: productEntity.name,
		slug: productEntity.slug,
		mass: productEntity.mass,
		volume: productEntity.volume,
		brandId: productEntity.brandId,

		categoriesIds: productEntity.inCategories.map(
			(productInCategoryEntity) => productInCategoryEntity.categoryId
		),
		inDataSourcesIds: productEntity.inDataSources.map(
			(productInDataSource) => productInDataSource.dataSourceId
		),

		ingredientsIds:
			productEntity.ingredientsListId === null
				? null
				: productEntity.ingredientsList.inIngredients.map(
						(productInIngredientsListEntity) => productInIngredientsListEntity.ingredientId
				  ),
	};
}

export default deentitifyProduct;
