import {Module} from "@nestjs/common";
import AppConfigModule from "../app-config/AppConfigModule.js";
import {AppOrmModule} from "../app-orm/index.js";
import {CatsModule} from "../features/cats/index.js";
import HelloModule from "../features/hello/HelloModule.js";

@Module({
	imports: [CatsModule, AppOrmModule, AppConfigModule, HelloModule],
	controllers: [],
	providers: [],
})
class AppModule {
	constructor() {}
}

export default AppModule;
