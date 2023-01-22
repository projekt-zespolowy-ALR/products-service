import {
	Controller,
	Get,
	NotFoundException,
	Param,
	ParseUUIDPipe,
	Query,
	Version,
} from "@nestjs/common";
import {ApiNotFoundResponse, ApiProduces} from "@nestjs/swagger";

import BrandsService from "../brands_service/BrandsService.js";
import {type Page, PagingOptionsInRequest} from "../../../paging/index.js";
import * as Utils from "../../../utils/index.js";
import {BrandsServiceBrandWithGivenIdNotFoundError} from "../brands_service/index.js";
import {type Brand} from "../types.js";

@Controller("/brands")
class BrandsController {
	private readonly brandsService: BrandsService;
	constructor(brandsService: BrandsService) {
		this.brandsService = brandsService;
	}

	@Version(["1"])
	@ApiProduces("application/json")
	@Get("/")
	public async getAllBrands(
		@Query()
		pagingOptionsInRequest: PagingOptionsInRequest
	): Promise<Page<Brand>> {
		return this.brandsService.getBrands(
			Utils.convertPagingOptionsInRequestToPagingOptions(pagingOptionsInRequest)
		);
	}

	@ApiNotFoundResponse({
		description: "Brand with given id not found",
	})
	@ApiProduces("application/json")
	@Version(["1"])
	@Get("/:brand-id")
	public async getBrandById(
		@Param("brand-id", ParseUUIDPipe)
		brandId: string
	): Promise<Brand> {
		try {
			return await this.brandsService.getBrandById(brandId);
		} catch (error) {
			if (error instanceof BrandsServiceBrandWithGivenIdNotFoundError) {
				throw new NotFoundException();
			}
			throw error;
		}
	}
}

export default BrandsController;
