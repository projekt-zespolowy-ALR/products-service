import {Injectable} from "@nestjs/common";
import {EntityNotFoundError, Repository} from "typeorm";
import DataSourceEntity from "./DataSourceEntity.js";
import {InjectRepository} from "@nestjs/typeorm";
import type Page from "../../../paging/Page.js";
import type PagingOptions from "../../../paging/PagingOptions.js";
import paginatedFindAndCount from "../../../paging/paginatedFindAndCount.js";
import type DataSource from "../datasources_controller/DataSource.js";
import deentityifyDataSourceEntity from "./deentityifyDataSourceEntity.js";
import type CreateDataSourcePayload from "./CreateDataSourcePayload.js";
import DataSourcesServiceDataSourceWithGivenIdNotFoundError from "./DataSourcesServiceDataSourceWithGivenIdNotFoundError.js";
@Injectable()
export default class DataSourcesService {
	private readonly dataSourcesRepository: Repository<DataSourceEntity>;
	public constructor(@InjectRepository(DataSourceEntity) dataSourcesRepository: Repository<DataSourceEntity>) {
		this.dataSourcesRepository = dataSourcesRepository;
	}
	public async getDataSources(pagingOptions: PagingOptions): Promise<Page<DataSource>> {
		return (await paginatedFindAndCount(this.dataSourcesRepository, pagingOptions)).map(
			deentityifyDataSourceEntity
		);
	}
	public async getDataSourceById(id: string): Promise<DataSource> {
		try {
			return deentityifyDataSourceEntity(await this.dataSourcesRepository.findOneByOrFail({id}));
		} catch (error) {
			if (error instanceof EntityNotFoundError) {
				throw new DataSourcesServiceDataSourceWithGivenIdNotFoundError(id);
			}
			throw error;
		}
	}
	public async createDataSource(createDataSourcePayload: CreateDataSourcePayload): Promise<DataSource> {
		return deentityifyDataSourceEntity(await this.dataSourcesRepository.save(createDataSourcePayload));
	}
}
