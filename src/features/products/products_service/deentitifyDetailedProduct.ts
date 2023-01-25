import deentitifyBrand from "../../brands/brands_service/deentitifyBrand.js";
import deentitifyCategory from "../../categories/categories_service/deentitifyCategory.js";
import deentitifyIngredient from "../../ingredients/ingredients_service/deentitifyIngredient.js";
import type DetailedProduct from "../types/DetailedProduct.js";
import deentitifyDetailedProductInDataSource from "./deentitifyDetailedProductInDataSource.js";
import ProductEntity from "./ProductEntity.js";

function deentitifyDetailedProduct(productEntity: ProductEntity): DetailedProduct {
	return {
		id: productEntity.id,
		name: productEntity.name,
		slug: productEntity.slug,
		mass: productEntity.mass,
		volume: productEntity.volume,
		brand: productEntity.brandId === null ? null : deentitifyBrand(productEntity.brand),

		categories: productEntity.inCategories
			.map((productInCategoryEntity) => productInCategoryEntity.category)
			.map(deentitifyCategory),
		inDataSources: productEntity.inDataSources.map(deentitifyDetailedProductInDataSource),

		ingredients:
			productEntity.ingredientsListId === null
				? null
				: productEntity.ingredientsList.inIngredients
						.map((productInIngredientsListEntity) => productInIngredientsListEntity.ingredient)
						.map(deentitifyIngredient),
	};
}

export default deentitifyDetailedProduct;
