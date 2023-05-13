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
import BrandsService from "../brands_service/BrandsService.js";
import PagingOptions from "../../../paging/PagingOptions.js";
import type Page from "../../../paging/Page.js";
import type Brand from "./Brand.js";
import BrandsServiceBrandWithGivenIdNotFoundError from "../brands_service/BrandsServiceBrandWithGivenIdNotFoundError.js";
import type CreateBrandRequestBody from "./CreateBrandRequestBody.js";
import payloadifyCreateBrandRequestBody from "./payloadifyCreateBrandRequestBody.js";

@Controller("/")
export default class BrandsController {
	private readonly brandsService: BrandsService;
	public constructor(brandsService: BrandsService) {
		this.brandsService = brandsService;
	}
	@Get("/brands")
	public async getBrands(
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
		@Param(
			"brandId",
			new ParseUUIDPipe({
				version: "4",
			})
		)
		brandId: string
	): Promise<Brand> {
		try {
			const targetBrand = await this.brandsService.getBrandById(brandId);
			return targetBrand;
		} catch (error) {
			if (error instanceof BrandsServiceBrandWithGivenIdNotFoundError) {
				throw new NotFoundException(`Brand with id "${brandId}" not found`);
			}
			throw error;
		}
	}

	@Post("/cats")
	public async createBrand(
		@Body(
			new ValidationPipe({
				transform: true, // Transform to instance of CreateCatRequestBody
				whitelist: true, // Do not allow other properties than those defined in CreateCatRequestBody
				forbidNonWhitelisted: true, // Throw an error if other properties than those defined in CreateCatRequestBody are present
			})
		)
		createBrandRequestBody: CreateBrandRequestBody
	): Promise<Brand> {
		return await this.brandsService.createBrand(
			payloadifyCreateBrandRequestBody(createBrandRequestBody)
		);
	}
}
