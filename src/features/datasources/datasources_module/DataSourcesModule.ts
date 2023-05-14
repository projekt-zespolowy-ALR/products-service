import {Module} from "@nestjs/common";
import DataSourcesController from "../datasources_controller/DataSourcesController.js";
import DataSourcesService from "../datasources_service/DataSourcesService.js";
import {TypeOrmModule} from "@nestjs/typeorm";
import DataSourceEntity from "../datasources_service/DataSourceEntity.js";

@Module({
	imports: [TypeOrmModule.forFeature([DataSourceEntity])],
	controllers: [DataSourcesController],
	providers: [DataSourcesService],
})
export default class DataSourcesModule {}
