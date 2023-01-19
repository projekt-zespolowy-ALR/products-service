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
import CategoryEntity from "./CategoryEntity.js";
import CategoriesService from "./CategoriesService.js";
import {Page, PagingOptionsInRequest, ApiPaginatedOkResponse} from "../../paging/index.js";

@ApiTags("categories")
@ApiProduces("application/json")
@Controller("/categories")
class CategoriesController {
	private readonly categoriesService: CategoriesService;
	constructor(categoriesService: CategoriesService) {
		this.categoriesService = categoriesService;
	}

	@ApiPaginatedOkResponse({
		description: "All categories",
		type: CategoryEntity,
	})
	@Version(["1"])
	@Get("/")
	public async getAllCategories(
		@Query(
			new ValidationPipe({
				transform: true,
				whitelist: true,
				errorHttpStatusCode: HttpStatus.BAD_REQUEST,
			})
		)
		pagingOptionsInRequest: PagingOptionsInRequest
	): Promise<Page<CategoryEntity>> {
		const pagingOptions = pagingOptionsInRequest.toPagingOptions();
		return this.categoriesService.getCategories(pagingOptions);
	}

	@ApiOkResponse({
		description: "Category with given id",
		type: CategoryEntity,
	})
	@ApiNotFoundResponse({
		description: "Category with given id not found",
	})
	@Version(["1"])
	@Get("/:id")
	public async getCategoryById(
		@Param(
			"id",
			new ParseUUIDPipe({
				errorHttpStatusCode: HttpStatus.NOT_FOUND,
				version: "4",
			})
		)
		id: string
	): Promise<CategoryEntity> {
		try {
			return this.categoriesService.getCategoryById(id);
		} catch (error) {
			if (error instanceof EntityNotFoundError) {
				throw new NotFoundException();
			}
			throw error;
		}
	}
}

export default CategoriesController;
