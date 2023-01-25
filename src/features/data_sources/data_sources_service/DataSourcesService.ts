import DataSourceEntity from "./DataSourceEntity.js";

import {Injectable} from "@nestjs/common";
import {EntityNotFoundError, Repository} from "typeorm";

import {InjectRepository} from "@nestjs/typeorm";

import DataSourcesServiceDataSourceWithGivenIdNotFoundError from "./errors/DataSourcesServiceDataSourceWithGivenIdNotFoundError.js";
import DataSourcesServiceDataSourceWithGivenSlugNotFoundError from "./errors/DataSourcesServiceDataSourceWithGivenSlugNotFoundError.js";
import type Page from "../../../paging/Page.js";
import type PagingOptions from "../../../paging/PagingOptions.js";
import paginatedFindAndCount from "../../../paging/paginatedFindAndCount.js";
import type AddDataSourcePayload from "../types/AddDataSourcePayload.js";
import type DataSource from "../types/DataSource.d.js";
import type UpdateDataSourcePayload from "../types/UpdateDataSourcePayload.d.js";

@Injectable()
class DataSourcesService {
	private readonly dataSourcesRepository: Repository<DataSourceEntity>;
	constructor(
		@InjectRepository(DataSourceEntity) dataSourcesRepository: Repository<DataSourceEntity>
	) {
		this.dataSourcesRepository = dataSourcesRepository;
	}

	public async getDataSources(pagingOptions: PagingOptions): Promise<Page<DataSource>> {
		return await paginatedFindAndCount(this.dataSourcesRepository, pagingOptions);
	}
	public async getDataSourceById(dataSourceId: string): Promise<DataSource> {
		try {
			return await this.dataSourcesRepository.findOneByOrFail({id: dataSourceId});
		} catch (error) {
			if (error instanceof EntityNotFoundError) {
				throw new DataSourcesServiceDataSourceWithGivenIdNotFoundError(dataSourceId);
			}
			throw error;
		}
	}
	public async getDataSourceBySlug(dataSourceslug: string): Promise<DataSource> {
		try {
			return await this.dataSourcesRepository.findOneByOrFail({slug: dataSourceslug});
		} catch (error) {
			if (error instanceof EntityNotFoundError) {
				throw new DataSourcesServiceDataSourceWithGivenSlugNotFoundError(dataSourceslug);
			}
			throw error;
		}
	}
	public async addDataSource(addDataSourcePayload: AddDataSourcePayload): Promise<DataSource> {
		const dataSourceEntity = this.dataSourcesRepository.create(addDataSourcePayload);
		const savedDataSourceEntity = await this.dataSourcesRepository.save(dataSourceEntity);
		return savedDataSourceEntity;
	}
	public async updateDataSource(
		dataSourceId: string,
		updateDataSourcePayload: UpdateDataSourcePayload
	): Promise<DataSource> {
		const updatedDataSourceEntity = await this.dataSourcesRepository.preload({
			id: dataSourceId,
			...updateDataSourcePayload,
		});
		if (!updatedDataSourceEntity) {
			throw new DataSourcesServiceDataSourceWithGivenIdNotFoundError(dataSourceId);
		}
		const savedDataSourceEntity = await this.dataSourcesRepository.save(updatedDataSourceEntity);
		return savedDataSourceEntity;
	}

	public async deleteDataSource(dataSourceId: string): Promise<void> {
		try {
			const dataSourceEntity = await this.dataSourcesRepository.findOneByOrFail({id: dataSourceId});
			await this.dataSourcesRepository.remove(dataSourceEntity);
		} catch (error) {
			if (error instanceof EntityNotFoundError) {
				throw new DataSourcesServiceDataSourceWithGivenIdNotFoundError(dataSourceId);
			}
			throw error;
		}
	}
}

export default DataSourcesService;
