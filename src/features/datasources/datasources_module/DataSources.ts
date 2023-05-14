import {Module} from "@nestjs/common";
import DataSourcesController from "../brands_controller/DataSourcesController.js";
import DataSourcesService from "../brands_service/DataSourcesService.js";
import {TypeOrmModule} from "@nestjs/typeorm";
import BrandEntity from "../brands_service/BrandEntity.js";

@Module({
	imports: [TypeOrmModule.forFeature([BrandEntity])],
	controllers: [DataSourcesController],
	providers: [DataSourcesService],
})
export default class DataSourcesModule {}
