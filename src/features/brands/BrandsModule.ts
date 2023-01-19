import {Module} from "@nestjs/common";
import BrandsController from "./BrandsController.js";
import BrandsService from "./BrandsService.js";
import {TypeOrmModule} from "@nestjs/typeorm";
import BrandEntity from "./BrandEntity.js";

@Module({
	imports: [TypeOrmModule.forFeature([BrandEntity])],
	controllers: [BrandsController],
	providers: [BrandsService],
})
class BrandsModule {
	constructor() {}
}

export default BrandsModule;
