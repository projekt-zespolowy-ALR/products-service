import {
	Controller,
	Get,
	HttpStatus,
	NotFoundException,
	Param,
	ParseUUIDPipe,
	Query,
	ValidationPipe,
	Version,
} from "@nestjs/common";
import {ApiNotFoundResponse, ApiOkResponse, ApiProduces, ApiTags} from "@nestjs/swagger";
import {EntityNotFoundError} from "typeorm";
import BrandEntity from "./BrandEntity.js";
import BrandsService from "./BrandsService.js";
import {Page, PagingOptionsInRequest, ApiPaginatedOkResponse} from "../../paging/index.js";

@ApiTags("brands")
@ApiProduces("application/json")
@Controller("/brands")
class BrandsController {
	private readonly brandsService: BrandsService;
	constructor(brandsService: BrandsService) {
		this.brandsService = brandsService;
	}

	@ApiPaginatedOkResponse({
		description: "All brands",
		type: BrandEntity,
	})
	@Version(["1"])
	@Get("/")
	public async getAllBrands(
		@Query(
			new ValidationPipe({
				transform: true,
				whitelist: true,
				errorHttpStatusCode: HttpStatus.BAD_REQUEST,
			})
		)
		pagingOptionsInRequest: PagingOptionsInRequest
	): Promise<Page<BrandEntity>> {
		const pagingOptions = pagingOptionsInRequest.toPagingOptions();
		return this.brandsService.getBrands(pagingOptions);
	}

	@ApiOkResponse({
		description: "Brand with given id",
		type: BrandEntity,
	})
	@ApiNotFoundResponse({
		description: "Brand with given id not found",
	})
	@Version(["1"])
	@Get("/:id")
	public async getBrandById(
		@Param(
			"id",
			new ParseUUIDPipe({
				errorHttpStatusCode: HttpStatus.NOT_FOUND,
				version: "4",
			})
		)
		id: string
	): Promise<BrandEntity> {
		try {
			return this.brandsService.getBrandById(id);
		} catch (error) {
			if (error instanceof EntityNotFoundError) {
				throw new NotFoundException();
			}
			throw error;
		}
	}
}

export default BrandsController;
