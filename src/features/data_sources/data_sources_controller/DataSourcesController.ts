import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	NotFoundException,
	Param,
	ParseUUIDPipe,
	Post,
	Put,
	Query,
} from "@nestjs/common";
import Page from "../../../paging/Page.js";
import PagingOptions from "../../../paging/PagingOptions.js";
import DataSourcesService from "../data_sources_service/DataSourcesService.js";
import DataSourcesServiceDataSourceWithGivenIdNotFoundError from "../data_sources_service/errors/DataSourcesServiceDataSourceWithGivenIdNotFoundError.js";
import DataSourcesServiceDataSourceWithGivenSlugNotFoundError from "../data_sources_service/errors/DataSourcesServiceDataSourceWithGivenSlugNotFoundError.js";
import type DataSource from "../types/DataSource.js";
import AddDataSourceRequestBody from "./AddDataSourceRequestBody.js";
import UpdateDataSourceRequestBody from "./UpdateDataSourceRequestBody.js";

@Controller("/")
class DataSourcesController {
	private readonly dataSourcesService: DataSourcesService;
	constructor(dataSourcesService: DataSourcesService) {
		this.dataSourcesService = dataSourcesService;
	}

	@Get("/data-sources")
	public async getAllDataSources(
		@Query()
		pagingOptions: PagingOptions
	): Promise<Page<DataSource>> {
		return await this.dataSourcesService.getDataSources(pagingOptions);
	}

	@Get("/data-sources/:dataSourceId")
	public async getDataSourceById(
		@Param("dataSourceId", ParseUUIDPipe)
		dataSourceId: string
	): Promise<DataSource> {
		try {
			return await this.dataSourcesService.getDataSourceById(dataSourceId);
		} catch (error) {
			if (error instanceof DataSourcesServiceDataSourceWithGivenIdNotFoundError) {
				throw new NotFoundException(`DataSource with id ${dataSourceId} not found.`, {
					cause: error,
				});
			}
			throw error;
		}
	}

	@Get("/data-sources-by-slug/:dataSourceSlug")
	public async getDataSourceBySlug(
		@Param("dataSourceSlug")
		dataSourceSlug: string
	): Promise<DataSource> {
		try {
			return await this.dataSourcesService.getDataSourceBySlug(dataSourceSlug);
		} catch (error) {
			if (error instanceof DataSourcesServiceDataSourceWithGivenSlugNotFoundError) {
				throw new NotFoundException(`DataSource with slug ${dataSourceSlug} not found.`, {
					cause: error,
				});
			}
			throw error;
		}
	}

	@Post("/data-sources")
	public async addDataSource(@Body() dataSource: AddDataSourceRequestBody): Promise<DataSource> {
		return await this.dataSourcesService.addDataSource(dataSource);
	}

	@Delete("/data-sources/:dataSourceId")
	@HttpCode(204)
	public async deleteDataSource(
		@Param("dataSourceId", ParseUUIDPipe)
		dataSourceId: string
	): Promise<void> {
		try {
			await this.dataSourcesService.deleteDataSource(dataSourceId);
		} catch (error) {
			if (error instanceof DataSourcesServiceDataSourceWithGivenIdNotFoundError) {
				throw new NotFoundException(`DataSource with id ${dataSourceId} not found.`, {
					cause: error,
				});
			}
			throw error;
		}
	}

	@Put("/data-sources/:dataSourceId")
	public async updateDataSource(
		@Param("dataSourceId", ParseUUIDPipe)
		dataSourceId: string,
		@Body()
		dataSource: UpdateDataSourceRequestBody
	): Promise<DataSource> {
		try {
			return await this.dataSourcesService.updateDataSource(dataSourceId, dataSource);
		} catch (error) {
			if (error instanceof DataSourcesServiceDataSourceWithGivenIdNotFoundError) {
				throw new NotFoundException(`DataSource with id ${dataSourceId} not found.`, {
					cause: error,
				});
			}
			throw error;
		}
	}
}

export default DataSourcesController;
