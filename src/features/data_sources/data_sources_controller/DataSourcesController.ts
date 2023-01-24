import {Body, Controller, Get, Param, Post, Query, Version} from "@nestjs/common";
import {Page, PagingOptions} from "../../../paging/index.js";
import {DataSourcesService} from "../data_sources_service/index.js";
import {DataSource} from "../types.js";
import AddDataSourceRequestBody from "./AddDataSourceRequestBody.js";
import * as Paging from "../../../paging/index.js";
@Controller("/")
class DataSourcesRequestController {
	private readonly dataSourcesService: DataSourcesService;
	constructor(dataSourcesService: DataSourcesService) {
		this.dataSourcesService = dataSourcesService;
	}
	@Version(["1"])
	@Get("/data-sources")
	public async getAllDataSources(
		@Query()
		pagingOptions: PagingOptions
	): Promise<Page<DataSource>> {
		return this.dataSourcesService.getDataSources(pagingOptions);
	}
	@Version(["1"])
	@Get("/data-sources/:idOrSlug")
	public async getDataSourceByIdOrSlug(
		@Param("idOrSlug")
		idOrSlug: string
	): Promise<DataSource> {
		return await this.dataSourcesService.getDataSourceByIdOrSlug(idOrSlug);
	}

	@Version(["1"])
	@Post("/data-sources")
	public async addDataSource(
		@Body()
		addDateSourceRequestBody: AddDataSourceRequestBody
	): Promise<DataSource> {
		return await this.dataSourcesService.addDataSource(addDateSourceRequestBody);
	}
}

export default DataSourcesRequestController;
