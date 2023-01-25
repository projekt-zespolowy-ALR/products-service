import {Module} from "@nestjs/common";
import BrandsModule from "../features/brands/brands_module/BrandsModule.js";
import CategoriesModule from "../features/categories/categories_module/CategoriesModule.js";
import DataSourcesModule from "../features/data_sources/data_sources_module/DataSourcesModule.js";
import IngredientsModule from "../features/ingredients/ingredients_module/IngredientsModule.js";
import ProductsModule from "../features/products/products_module/ProductsModule.js";

@Module({
	imports: [BrandsModule, CategoriesModule, DataSourcesModule, ProductsModule, IngredientsModule],
	controllers: [],
	providers: [],
})
class FeaturesModule {
	constructor() {}
}

export default FeaturesModule;
