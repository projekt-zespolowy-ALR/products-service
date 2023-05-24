import {Module} from "@nestjs/common";
import BrandsModule from "./brands/brands_module/BrandsModule.js";
import CategoriesModule from "./categories/categories_module/CategoriesModule.js";
import IngredientsModule from "./ingredients/ingredients_module/IngredientsModule.js";
import ProductsModule from "./products/products_module/ProductsModule.js";
import DataSourcesModule from "./data_sources/data_sources_module/DataSourcesModule.js";
import UserFavoriteProductsModule from "./user_favorite_products/user_favorite_products_module/UserFavoriteProductsModule.js";

@Module({
	imports: [
		BrandsModule,
		CategoriesModule,
		IngredientsModule,
		ProductsModule,
		DataSourcesModule,
		UserFavoriteProductsModule,
	],
	controllers: [],
	providers: [],
})
class FeaturesModule {
	public constructor() {}
}

export default FeaturesModule;
