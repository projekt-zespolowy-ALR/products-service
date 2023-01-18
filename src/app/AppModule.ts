import {Module} from "@nestjs/common";
import {AppConfigModule} from "../app_config/index.js";
import {AppOrmModule} from "../app_orm/index.js";
import {ProductsModule} from "../features/products/index.js";

@Module({
	imports: [AppOrmModule, AppConfigModule, ProductsModule],
	controllers: [],
	providers: [],
})
class AppModule {
	constructor() {}
}

export default AppModule;
