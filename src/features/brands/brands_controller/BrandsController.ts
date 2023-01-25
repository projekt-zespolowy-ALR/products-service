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
import BrandsService from "../brands_service/BrandsService.js";
import BrandsServiceBrandWithGivenIdNotFoundError from "../brands_service/errors/BrandsServiceBrandWithGivenIdNotFoundError.js";
import BrandsServiceBrandWithGivenSlugNotFoundError from "../brands_service/errors/BrandsServiceBrandWithGivenSlugNotFoundError.js";
import type Brand from "../types/Brand.d.js";
import AddBrandRequestBody from "./AddBrandRequestBody.js";
import UpdateBrandRequestBody from "./UpdateBrandRequestBody.js";

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

	@Get("/brand-by-slug")
	public async getBrandBySlug(
		@Query("slug")
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

	@Post("/brands")
	public async addBrand(@Body() brand: AddBrandRequestBody): Promise<Brand> {
		return await this.brandsService.addBrand(brand);
	}

	@Delete("/brands/:brandId")
	@HttpCode(204)
	public async deleteBrand(
		@Param("brandId", ParseUUIDPipe)
		brandId: string
	): Promise<void> {
		try {
			await this.brandsService.deleteBrand(brandId);
		} catch (error) {
			if (error instanceof BrandsServiceBrandWithGivenIdNotFoundError) {
				throw new NotFoundException(`Brand with id ${brandId} not found.`, {
					cause: error,
				});
			}
			throw error;
		}
	}

	@Put("/brands/:brandId")
	public async updateBrand(
		@Param("brandId", ParseUUIDPipe)
		brandId: string,
		@Body()
		brand: UpdateBrandRequestBody
	): Promise<Brand> {
		try {
			return await this.brandsService.updateBrand(brandId, brand);
		} catch (error) {
			if (error instanceof BrandsServiceBrandWithGivenIdNotFoundError) {
				throw new NotFoundException(`Brand with id ${brandId} not found.`, {
					cause: error,
				});
			}
			throw error;
		}
	}
}

export default BrandsController;
