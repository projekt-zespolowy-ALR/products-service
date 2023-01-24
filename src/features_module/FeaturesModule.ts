import {Module} from "@nestjs/common";

import {
	BrandsModule,
	DataSourcesModule,
	ProductsModule,
	CategoriesModule,
} from "../features/index.js";

@Module({
	imports: [ProductsModule, BrandsModule, CategoriesModule, DataSourcesModule],
	controllers: [],
	providers: [],
})
class FeaturesModule {
	constructor() {}
}

export default FeaturesModule;
