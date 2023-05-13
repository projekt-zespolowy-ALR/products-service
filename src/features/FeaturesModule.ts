import {Module} from "@nestjs/common";
import BrandsModule from "./brands/brands_module/BrandsModule.js";

@Module({
	imports: [BrandsModule],
	controllers: [],
	providers: [],
})
class FeaturesModule {
	constructor() {}
}

export default FeaturesModule;
