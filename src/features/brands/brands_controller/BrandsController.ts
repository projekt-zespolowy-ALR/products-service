import {Controller, Get, NotFoundException, Param, ParseUUIDPipe, Query} from "@nestjs/common";

import {type Page, PagingOptions} from "../../../paging/index.js";
import {
	BrandsServiceBrandWithGivenIdNotFoundError,
	BrandsServiceBrandWithGivenSlugNotFoundError,
	BrandsService,
} from "../brands_service/index.js";
import {type Brand} from "../types/index.d.js";

@Controller("/")
class BrandsController {
	private readonly brandsService: BrandsService;
	constructor(brandsService: BrandsService) {
		this.brandsService = brandsService;
	}

	@Get("/brands")
	public async getAllBrands(
		@Query()
		pagingOptions: PagingOptions
	): Promise<Page<Brand>> {
		return await this.brandsService.getBrands(pagingOptions);
	}

	@Get("/brands/:brandId")
	public async getBrandById(
		@Param("brandId", ParseUUIDPipe)
		brandId: string
	): Promise<Brand> {
		try {
			return await this.brandsService.getBrandById(brandId);
		} catch (error) {
			if (error instanceof BrandsServiceBrandWithGivenIdNotFoundError) {
				throw new NotFoundException(`Brand with id ${brandId} not found.`, {
					cause: error,
				});
			}
			throw error;
		}
	}

	@Get("/brand-by-slug/:brandSlug")
	public async getBrandBySlug(
		@Param("brandSlug")
		brandSlug: string
	): Promise<Brand> {
		try {
			return await this.brandsService.getBrandBySlug(brandSlug);
		} catch (error) {
			if (error instanceof BrandsServiceBrandWithGivenSlugNotFoundError) {
				throw new NotFoundException(`Brand with slug ${brandSlug} not found.`, {
					cause: error,
				});
			}
			throw error;
		}
	}
}

export default BrandsController;
