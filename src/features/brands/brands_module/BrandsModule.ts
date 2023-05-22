import {Module} from "@nestjs/common";
import BrandsController from "../brands_controller/BrandsController.js";
import BrandsService from "../brands_service/BrandsService.js";
import {TypeOrmModule} from "@nestjs/typeorm";
import BrandEntity from "../brands_service/BrandEntity.js";

@Module({
	imports: [TypeOrmModule.forFeature([BrandEntity])],
	controllers: [BrandsController],
	providers: [BrandsService],
})
export default class BrandsModule {
	public constructor() {}
}
