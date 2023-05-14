import {Module} from "@nestjs/common";
import BrandsModule from "./brands/brands_module/BrandsModule.js";
import CategoriesModule from "./categories/categories_module/CategoriesModule.js";

@Module({
	imports: [BrandsModule, CategoriesModule],
	controllers: [],
	providers: [],
})
class FeaturesModule {
	constructor() {}
}

export default FeaturesModule;
