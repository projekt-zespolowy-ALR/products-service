import {Module} from "@nestjs/common";
import {AppConfigModule} from "./config/index.js";
import {AppOrmModule} from "./orm/index.js";
import {ProductsModule} from "./features/products/index.js";
import {BrandsModule} from "./features/brands/index.js";
import {CategoriesModule} from "./features/categories/index.js";
import {DataSourcesModule} from "./features/data_sources/index.js";

@Module({
	imports: [
		AppOrmModule,
		AppConfigModule,
		ProductsModule,
		BrandsModule,
		CategoriesModule,
		DataSourcesModule,
	],
	controllers: [],
	providers: [],
})
class AppModule {
	constructor() {}
}

export default AppModule;
