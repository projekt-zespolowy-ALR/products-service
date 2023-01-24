import {Module} from "@nestjs/common";

import {
	BrandsModule,
	DataSourcesModule,
	ProductsModule,
	CategoriesModule,
} from "../features/index.js";

@Module({
	imports: [BrandsModule, CategoriesModule, DataSourcesModule, ProductsModule],
	controllers: [],
	providers: [],
})
class FeaturesModule {
	constructor() {}
}

export default FeaturesModule;
