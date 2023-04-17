import {Module} from "@nestjs/common";
import AppConfigModule from "./app_config/AppConfigModule.js";
import FeaturesModule from "./features_module/FeaturesModule.js";
import AppOrmModule from "./orm/AppOrmModule.js";

@Module({
	imports: [AppOrmModule, AppConfigModule, FeaturesModule],
	controllers: [],
	providers: [],
})
class AppModule {
	constructor() {}
}

export default AppModule;
