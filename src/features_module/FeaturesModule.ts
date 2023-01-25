import {Module} from "@nestjs/common";
import BrandsModule from "../features/brands/brands_module/BrandsModule.js";
import CategoriesModule from "../features/categories/CategoriesModule.js";
import DataSourcesModule from "../features/data_sources/DataSourcesModule.js";
import ProductsModule from "../features/products/ProductsModule.js";

@Module({
	imports: [BrandsModule, CategoriesModule, DataSourcesModule, ProductsModule],
	controllers: [],
	providers: [],
})
class FeaturesModule {
	constructor() {}
}

export default FeaturesModule;
