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
	ValidationPipe,
} from "@nestjs/common";
import Page from "../../../paging/Page.js";
import PagingOptions from "../../../paging/PagingOptions.js";
import BrandsService from "../brands_service/BrandsService.js";
import BrandsServiceBrandWithGivenIdNotFoundError from "../brands_service/errors/BrandsServiceBrandWithGivenIdNotFoundError.js";
import BrandsServiceBrandWithGivenSlugNotFoundError from "../brands_service/errors/BrandsServiceBrandWithGivenSlugNotFoundError.js";
import AddBrandRequestBody from "./AddBrandRequestBody.js";
import UpdateBrandRequestBody from "./UpdateBrandRequestBody.js";
import Brand from "../types/Brand.js";

@Controller("/")
class BrandsController {
	private readonly brandsService: BrandsService;
	constructor(brandsService: BrandsService) {
		this.brandsService = brandsService;
	}

	@Get("/brands")
	public async getAllBrands(
		@Query(
			new ValidationPipe({
				transform: true, // Transform to instance of PagingOptions
				whitelist: true, // Do not put other query parameters into the object
			})
		)
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
			return await this.brandsService.getBrand(brandId);
		} catch (error) {
			if (error instanceof BrandsServiceBrandWithGivenIdNotFoundError) {
				throw new NotFoundException(`Brand with id ${brandId} not found.`, {
					cause: error,
				});
			}
			throw error;
		}
	}

	@Get("/brands-by-slug/:brandSlug")
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

	@Post("/brands")
	public async addBrand(
		@Body(
			new ValidationPipe({
				transform: true,
				whitelist: true,
				forbidNonWhitelisted: true,
			})
		)
		brand: AddBrandRequestBody
	): Promise<Brand> {
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
		@Body(
			new ValidationPipe({
				transform: true, // Transform to instance of CatInPostRequest
				whitelist: true, // Do not allow other properties than those defined in CatInPostRequest
				forbidNonWhitelisted: true, // Throw an error if other properties than those defined in CatInPostRequest are present
			})
		)
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
