import deentitifyBrand from "../../brands/brands_service/deentitifyBrand.js";
import deentitifyCategory from "../../categories/categories_service/deentitifyCategory.js";
import deentitifyIngredient from "../../ingredients/ingredients_service/deentitifyIngredient.js";
import type DetailedProduct from "../types/DetailedProduct.js";
import deentitifyProductInDataSource from "./deentitifyProductInDataSource.js";
import ProductEntity from "./ProductEntity.js";

function deentitifyDetailedProduct(productEntity: ProductEntity): DetailedProduct {
	return {
		id: productEntity.id,
		name: productEntity.name,
		slug: productEntity.slug,
		mass: productEntity.mass,
		volume: productEntity.volume,
		categories: productEntity.categories.map(deentitifyCategory),
		inDataSources: productEntity.inDataSources.map(deentitifyProductInDataSource),
		ingredients:
			productEntity.ingredientsList &&
			productEntity.ingredientsList.ingredients.map(deentitifyIngredient),
		brand: productEntity.brand && deentitifyBrand(productEntity.brand),
	};
}

export default deentitifyDetailedProduct;
