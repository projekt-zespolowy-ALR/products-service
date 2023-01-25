import DataSourceEntity from "./DataSourceEntity.js";
import {Injectable} from "@nestjs/common";
import {Repository} from "typeorm";

import {InjectRepository} from "@nestjs/typeorm";

import {type AddDataSourcePayload, type DataSource} from "../types.js";

import * as Uuid from "uuid";
import PagingOptions from "../../../paging/PagingOptions.js";
import paginatedFindAndCount from "../../../paging/paginatedFindAndCount.js";
import Page from "../../../paging/Page.js";

@Injectable()
class DataSourcesService {
	private readonly dataSourcesRepository: Repository<DataSourceEntity>;
	constructor(
		@InjectRepository(DataSourceEntity) dataSourcesRepository: Repository<DataSourceEntity>
	) {
		this.dataSourcesRepository = dataSourcesRepository;
	}

	public async getDataSources(
		pagingOptions: PagingOptions
	): Promise<Page<Readonly<DataSourceEntity>>> {
		return await paginatedFindAndCount(this.dataSourcesRepository, pagingOptions);
	}

	public async getDataSourceByIdOrSlug(idOrSlug: string): Promise<DataSource> {
		return await (Uuid.validate(idOrSlug)
			? this.dataSourcesRepository.findOneByOrFail({id: idOrSlug})
			: this.dataSourcesRepository.findOneByOrFail({slug: idOrSlug}));
	}
	public async addDataSource(
		addDataSourcePayload: AddDataSourcePayload
	): Promise<Readonly<DataSource>> {
		const dataSourceEntity: DataSourceEntity =
			this.dataSourcesRepository.create(addDataSourcePayload);
		const savedDataSourceEntity: DataSourceEntity = await this.dataSourcesRepository.save(
			dataSourceEntity
		);
		return savedDataSourceEntity;
	}
}

export default DataSourcesService;
