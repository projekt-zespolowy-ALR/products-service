import {Module} from "@nestjs/common";
import {AppConfigModule} from "./config/index.js";
import {AppOrmModule} from "./orm/index.js";

import FeaturesModule from "./features_module/FeaturesModule.js";

@Module({
	imports: [AppOrmModule, AppConfigModule, FeaturesModule],
	controllers: [],
	providers: [],
})
class AppModule {
	constructor() {}
}

export default AppModule;
