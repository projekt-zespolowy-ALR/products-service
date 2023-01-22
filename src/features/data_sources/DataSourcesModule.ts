import {Module} from "@nestjs/common";
import {DataSourcesController} from "./data_sources_controller/index.js";
import {TypeOrmModule} from "@nestjs/typeorm";
import {DataSourcesService} from "./data_sources_service/index.js";
import {DataSourceEntity} from "./data_sources_service/index.js";

@Module({
	imports: [TypeOrmModule.forFeature([DataSourceEntity])],
	controllers: [DataSourcesController],
	providers: [DataSourcesService],
})
class DataSourcesModule {
	constructor() {}
}

export default DataSourcesModule;
