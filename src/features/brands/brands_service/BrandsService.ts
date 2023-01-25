import BrandEntity from "./BrandEntity.js";

import {Injectable} from "@nestjs/common";
import {EntityNotFoundError, Repository} from "typeorm";

import {InjectRepository} from "@nestjs/typeorm";

import BrandsServiceBrandWithGivenIdNotFoundError from "./errors/BrandsServiceBrandWithGivenIdNotFoundError.js";
import BrandsServiceBrandWithGivenSlugNotFoundError from "./errors/BrandsServiceBrandWithGivenSlugNotFoundError.js";
import Page from "../../../paging/Page.js";
import PagingOptions from "../../../paging/PagingOptions.js";
import paginatedFindAndCount from "../../../paging/paginatedFindAndCount.js";

@Injectable()
class BrandsService {
	private readonly brandsRepository: Repository<BrandEntity>;
	constructor(@InjectRepository(BrandEntity) brandsRepository: Repository<BrandEntity>) {
		this.brandsRepository = brandsRepository;
	}

	public async getBrands(pagingOptions: PagingOptions): Promise<Page<BrandEntity>> {
		return await paginatedFindAndCount(this.brandsRepository, pagingOptions);
	}
	public async getBrandById(id: string): Promise<BrandEntity> {
		try {
			return await this.brandsRepository.findOneByOrFail({id});
		} catch (error) {
			if (error instanceof EntityNotFoundError) {
				throw new BrandsServiceBrandWithGivenIdNotFoundError(id);
			}
			throw error;
		}
	}
	public async getBrandBySlug(brandSlug: string): Promise<BrandEntity> {
		try {
			return await this.brandsRepository.findOneByOrFail({slug: brandSlug});
		} catch (error) {
			if (error instanceof EntityNotFoundError) {
				throw new BrandsServiceBrandWithGivenSlugNotFoundError(brandSlug);
			}
			throw error;
		}
	}
}

export default BrandsService;
