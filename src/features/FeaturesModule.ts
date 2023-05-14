import {Module} from "@nestjs/common";
import BrandsModule from "./brands/brands_module/BrandsModule.js";
import CategoriesModule from "./categories/categories_module/CategoriesModule.js";
import IngredientsModule from "./ingredients/ingredients_module/IngredientsModule.js";
import DataSourcesModule from "./data_sources/data_sources_module/DataSourcesModule.js";

@Module({
	imports: [BrandsModule, CategoriesModule, DataSourcesModule, IngredientsModule],
	controllers: [],
	providers: [],
})
class FeaturesModule {
	constructor() {}
}

export default FeaturesModule;
