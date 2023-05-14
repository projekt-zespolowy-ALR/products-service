import {Module} from "@nestjs/common";
import DataSourcesController from "../data_sources_controller/DataSourcesController.js";
import DataSourcesService from "../data_sources_service/DataSourcesService.js";
import {TypeOrmModule} from "@nestjs/typeorm";
import DataSourceEntity from "../data_sources_service/DataSourceEntity.js";

@Module({
	imports: [TypeOrmModule.forFeature([DataSourceEntity])],
	controllers: [DataSourcesController],
	providers: [DataSourcesService],
})
export default class DataSourcesModule {}
