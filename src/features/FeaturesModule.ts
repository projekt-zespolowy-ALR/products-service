import {Module} from "@nestjs/common";
import BrandsModule from "./brands/brands_module/BrandsModule.js";
import CategoriesModule from "./categories/categories_module/CategoriesModule.js";
import IngredientsModule from "./ingredients/ingredients_module/IngredientsModule.js";

@Module({
	imports: [BrandsModule, CategoriesModule, IngredientsModule],
	controllers: [],
	providers: [],
})
class FeaturesModule {
	constructor() {}
}

export default FeaturesModule;
