import {
	Body,
	Controller,
	Get,
	Delete,
	NotFoundException,
	Param,
	ParseUUIDPipe,
	Post,
	Query,
	ValidationPipe,
} from "@nestjs/common";
import DataSourcesService from "../data_sources_service/DataSourcesService.js";
import PagingOptions from "../../../paging/PagingOptions.js";
import type Page from "../../../paging/Page.js";
import type DataSource from "./DataSource.js";
import DataSourcesServiceDataSourceWithGivenIdNotFoundError from "../data_sources_service/DataSourcesServiceDataSourceWithGivenIdNotFoundError.js";
import CreateDataSourceRequestBody from "./CreateDataSourceRequestBody.js";
import payloadifyCreateDataSourceRequestBody from "./payloadifyCreateDataSourceRequestBody.js";

@Controller("/")
export default class DataSourcesController {
	private readonly dataSourcesService: DataSourcesService;
	public constructor(dataSourcesService: DataSourcesService) {
		this.dataSourcesService = dataSourcesService;
	}
	@Get("/data-sources")
	public async getDataSources(
		@Query(
			new ValidationPipe({
				transform: true, // Transform to instance of PagingOptions
				whitelist: true, // Do not put other query parameters into the object
			})
		)
		pagingOptions: PagingOptions
	): Promise<Page<DataSource>> {
		return await this.dataSourcesService.getDataSources(pagingOptions);
	}

	@Get("/data-sources/:dataSourceId")
	public async getDataSourceById(
		@Param(
			"dataSourceId",
			new ParseUUIDPipe({
				version: "4",
			})
		)
		dataSourceId: string
	): Promise<DataSource> {
		try {
			const targetDataSource = await this.dataSourcesService.getDataSourceById(dataSourceId);
			return targetDataSource;
		} catch (error) {
			if (error instanceof DataSourcesServiceDataSourceWithGivenIdNotFoundError) {
				throw new NotFoundException(`DataSource with id "${dataSourceId}" not found`);
			}
			throw error;
		}
	}

	@Post("/data-sources")
	public async createDataSource(
		@Body(
			new ValidationPipe({
				transform: true, // Transform to instance of CreateCatRequestBody
				whitelist: true, // Do not allow other properties than those defined in CreateCatRequestBody
				forbidNonWhitelisted: true, // Throw an error if other properties than those defined in CreateCatRequestBody are present
			})
		)
		createDataSourceRequestBody: CreateDataSourceRequestBody
	): Promise<DataSource> {
		return await this.dataSourcesService.createDataSource(
			payloadifyCreateDataSourceRequestBody(createDataSourceRequestBody)
		);
	}

	@Delete("/data-sources/:dataSourceId")
	public async deleteDataSourceById(
		@Param(
			"dataSourceId",
			new ParseUUIDPipe({
				version: "4",
			})
		)
		dataSourceId: string
	): Promise<boolean> {
		try {
			const targetDataSource = await this.dataSourcesService.deleteDataSourceById(dataSourceId);
			return targetDataSource;
		} catch (error) {
			if (error instanceof DataSourcesServiceDataSourceWithGivenIdNotFoundError) {
				throw new NotFoundException(`DataSource with id "${dataSourceId}" not found`);
			}
			throw error;
		}
	}
}
