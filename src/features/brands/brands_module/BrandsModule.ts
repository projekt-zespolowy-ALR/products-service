import {Module} from "@nestjs/common";
import {BrandsController} from "../brands_controller/index.js";
import {BrandsService, BrandEntity} from "../brands_service/index.js";
import {TypeOrmModule} from "@nestjs/typeorm";

@Module({
	imports: [TypeOrmModule.forFeature([BrandEntity])],
	controllers: [BrandsController],
	providers: [BrandsService],
})
class BrandsModule {
	constructor() {}
}

export default BrandsModule;
