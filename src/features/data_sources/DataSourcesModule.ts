import {Module} from "@nestjs/common";

import {TypeOrmModule} from "@nestjs/typeorm";
import DataSourcesController from "./data_sources_controller/DataSourcesController.js";
import DataSourceEntity from "./data_sources_service/DataSourceEntity.js";
import DataSourcesService from "./data_sources_service/DataSourcesService.js";

@Module({
	imports: [TypeOrmModule.forFeature([DataSourceEntity])],
	controllers: [DataSourcesController],
	providers: [DataSourcesService],
})
class DataSourcesModule {
	constructor() {}
}

export default DataSourcesModule;
