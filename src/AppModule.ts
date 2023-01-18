import {Module} from "@nestjs/common";
import {AppConfigModule} from "./config/index.js";
import {AppOrmModule} from "./orm/index.js";
import {ProductsModule} from "./features/products/index.js";

@Module({
	imports: [AppOrmModule, AppConfigModule, ProductsModule],
	controllers: [],
	providers: [],
})
class AppModule {
	constructor() {}
}

export default AppModule;
