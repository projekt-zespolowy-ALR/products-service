import {Body, Controller, Get, Param, Post, Query, Version} from "@nestjs/common";
import Page from "../../../paging/Page.js";
import PagingOptions from "../../../paging/PagingOptions.js";
import DataSourcesService from "../data_sources_service/DataSourcesService.js";

import {type DataSource} from "../types.js";
import AddDataSourceRequestBody from "./AddDataSourceRequestBody.js";

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
