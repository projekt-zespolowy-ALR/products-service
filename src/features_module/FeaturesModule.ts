import {Module} from "@nestjs/common";
import BrandsModule from "../features/brands/brands_module/BrandsModule.js";
import CategoriesModule from "../features/categories/categories_module/CategoriesModule.js";
import DataSourcesModule from "../features/data_sources/DataSourcesModule.js";
import ProductsModule from "../features/products/products_module/ProductsModule.js";

@Module({
	imports: [BrandsModule, CategoriesModule, DataSourcesModule, ProductsModule],
	controllers: [],
	providers: [],
})
class FeaturesModule {
	constructor() {}
}

export default FeaturesModule;
