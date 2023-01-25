import {Module} from "@nestjs/common";

import {TypeOrmModule} from "@nestjs/typeorm";
import BrandsController from "../brands_controller/BrandsController.js";
import BrandEntity from "../brands_service/BrandEntity.js";
import BrandsService from "../brands_service/BrandsService.js";

@Module({
	imports: [TypeOrmModule.forFeature([BrandEntity])],
	controllers: [BrandsController],
	providers: [BrandsService],
})
class BrandsModule {
	constructor() {}
}

export default BrandsModule;
