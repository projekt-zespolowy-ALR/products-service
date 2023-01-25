import CategoryEntity from "../../categories/categories_service/CategoryEntity.js";
import deentitifyCategory from "../../categories/categories_service/deentitifyCategory.js";
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
		ingredients: [],
		brand: null,
	};
}

export default deentitifyDetailedProduct;
