import {Module} from "@nestjs/common";

import {TypeOrmModule} from "@nestjs/typeorm";
import BrandEntity from "../../brands/brands_service/BrandEntity.js";
import CategoryEntity from "../../categories/categories_service/CategoryEntity.js";
import DataSourceEntity from "../../data_sources/data_sources_service/DataSourceEntity.js";
import IngredientEntity from "../../ingredients/ingredients_service/IngredientEntity.js";
import ProductsController from "../products_controller/ProductsController.js";
import IngredientInIngredientsListEntity from "../products_service/IngredientInIngredientsListEntity.js";
import IngredientsListEntity from "../products_service/IngredientsListEntity.js";
import ProductEntity from "../products_service/ProductEntity.js";
import ProductInCategoryEntity from "../products_service/ProductInCategoryEntity.js";
import ProductInDataSourceEntity from "../products_service/ProductInDataSourceEntity.js";
import ProductsService from "../products_service/ProductsService.js";

@Module({
	imports: [
		TypeOrmModule.forFeature([
			ProductEntity,
			CategoryEntity,
			ProductInDataSourceEntity,
			DataSourceEntity,
			BrandEntity,
			IngredientsListEntity,
			IngredientEntity,
			ProductInCategoryEntity,
			IngredientInIngredientsListEntity,
		]),
	],
	controllers: [ProductsController],
	providers: [ProductsService],
})
class ProductsModule {
	constructor() {}
}

export default ProductsModule;
