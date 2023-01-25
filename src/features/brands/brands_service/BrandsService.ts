import BrandEntity from "./BrandEntity.js";

import {Injectable} from "@nestjs/common";
import {EntityNotFoundError, Repository} from "typeorm";

import {InjectRepository} from "@nestjs/typeorm";

import BrandsServiceBrandWithGivenIdNotFoundError from "./errors/BrandsServiceBrandWithGivenIdNotFoundError.js";
import BrandsServiceBrandWithGivenSlugNotFoundError from "./errors/BrandsServiceBrandWithGivenSlugNotFoundError.js";
import Page from "../../../paging/Page.js";
import PagingOptions from "../../../paging/PagingOptions.js";
import paginatedFindAndCount from "../../../paging/paginatedFindAndCount.js";
import type AddBrandPayload from "../types/AddBrandPayload.d.js";
import type Brand from "../types/Brand.d.js";
import type UpdateBrandPayload from "../types/UpdateBrandPayload.d.js";

@Injectable()
class BrandsService {
	private readonly brandsRepository: Repository<BrandEntity>;
	constructor(@InjectRepository(BrandEntity) brandsRepository: Repository<BrandEntity>) {
		this.brandsRepository = brandsRepository;
	}

	public async getBrands(pagingOptions: PagingOptions): Promise<Page<Brand>> {
		return await paginatedFindAndCount(this.brandsRepository, pagingOptions);
	}
	public async getBrandById(id: string): Promise<Brand> {
		try {
			return await this.brandsRepository.findOneByOrFail({id});
		} catch (error) {
			if (error instanceof EntityNotFoundError) {
				throw new BrandsServiceBrandWithGivenIdNotFoundError(id);
			}
			throw error;
		}
	}
	public async getBrandBySlug(brandSlug: string): Promise<Brand> {
		try {
			return await this.brandsRepository.findOneByOrFail({slug: brandSlug});
		} catch (error) {
			if (error instanceof EntityNotFoundError) {
				throw new BrandsServiceBrandWithGivenSlugNotFoundError(brandSlug);
			}
			throw error;
		}
	}
	public async addBrand(addBrandPayload: AddBrandPayload): Promise<Brand> {
		const brandEntity = this.brandsRepository.create(addBrandPayload);
		const savedBrandEntity = await this.brandsRepository.save(brandEntity);
		return savedBrandEntity;
	}
	public async updateBrand(
		brandId: string,
		updateBrandPayload: UpdateBrandPayload
	): Promise<Brand> {
		const brandEntity = await this.getBrandById(brandId);
		const updatedBrandEntity = this.brandsRepository.merge(brandEntity, updateBrandPayload);
		const savedBrandEntity = await this.brandsRepository.save(updatedBrandEntity);
		return savedBrandEntity;
	}

	public async deleteBrand(brandId: string): Promise<void> {
		const brandEntity = await this.getBrandById(brandId);
		await this.brandsRepository.remove(brandEntity);
	}
}

export default BrandsService;
