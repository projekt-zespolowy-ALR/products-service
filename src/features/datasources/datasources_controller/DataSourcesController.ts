import {
	Body,
	Controller,
	Get,
	NotFoundException,
	Param,
	ParseUUIDPipe,
	Post,
	Query,
	ValidationPipe,
} from "@nestjs/common";
import DataSourcesService from "../datasources_service/DataSourcesService.js";
import PagingOptions from "../../../paging/PagingOptions.js";
import type Page from "../../../paging/Page.js";
import type DataSource from "./DataSource.js";
import DataSourcesServiceDataSourceWithGivenIdNotFoundError from "../datasources_service/DataSourcesServiceDataSourceWithGivenIdNotFoundError.js";
import CreateDataSourceRequestBody from "./CreateDataSourceRequestBody.js";
import payloadifyCreateDataSourceRequestBody from "./payloadifyCreateDataSourceRequestBody.js";

@Controller("/")
export default class DataSourcesController {
	private readonly dataSourcesService: DataSourcesService;
	public constructor(dataSourcesService: DataSourcesService) {
		this.dataSourcesService = dataSourcesService;
	}
	@Get("/datasources")
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

	@Get("/datasources/:dataSourceId")
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

	@Post("/datasources")
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
}
