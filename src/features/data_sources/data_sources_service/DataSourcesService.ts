import {Injectable} from "@nestjs/common";
import {Repository} from "typeorm";
import DataSourceEntity from "./DataSourceEntity.js";
import {InjectRepository} from "@nestjs/typeorm";
import {Page, PagingOptions} from "../../../paging/index.js";

import {type AddDataSourcePayload, type DataSource} from "../types.js";
import * as Paging from "../../../paging/index.js";
import * as Uuid from "uuid";

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
		return await Paging.paginatedFindAndCount(this.dataSourcesRepository, pagingOptions);
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
