import {
	Body,
	Controller,
	Get,
	NotFoundException,
	Param,
	Post,
	Query,
	Version,
} from "@nestjs/common";
import {ApiProduces} from "@nestjs/swagger";
import {EntityNotFoundError} from "typeorm";
import CategoriesService from "../categories_service/CategoriesService.js";
import {Page, PagingOptionsInRequest} from "../../../paging/index.js";
import * as Utils from "../../../utils/index.js";
import {Category} from "../types.js";
import AddCategoryRequestBody from "./AddCategoryRequestBody.js";
import * as Uuid from "uuid";
@Controller()
class CategoriesController {
	private readonly categoriesService: CategoriesService;
	constructor(categoriesService: CategoriesService) {
		this.categoriesService = categoriesService;
	}

	@ApiProduces("application/json")
	@Version(["1"])
	@Get("/categories")
	public async getAllCategories(
		@Query()
		pagingOptionsInRequest: PagingOptionsInRequest
	): Promise<Page<Category>> {
		return this.categoriesService.getCategories(
			Utils.convertPagingOptionsInRequestToPagingOptions(pagingOptionsInRequest)
		);
	}
	@ApiProduces("application/json")
	@Version(["1"])
	@Get("/categories/:idOrSlug")
	public async getCategoryByIdOrSlug(
		@Param("idOrSlug")
		idOrSlug: string
	): Promise<Readonly<Category>> {
		console.log("idOrSlug", idOrSlug);
		try {
			// return this.categoriesService.getCategoryByIdOrSlug(idOrSlug);
			if (Uuid.validate(idOrSlug)) {
				return this.categoriesService.getCategoryById(idOrSlug);
			}
			return this.categoriesService.getCategoryBySlug(idOrSlug);
		} catch (error) {
			if (error instanceof EntityNotFoundError) {
				throw new NotFoundException();
			}
			throw error;
		}
	}

	@ApiProduces("application/json")
	@Version(["1"])
	@Post("/categories")
	public async addCategory(
		@Body()
		addCategoryRequestBody: AddCategoryRequestBody
	): Promise<Category> {
		return this.categoriesService.addCategory(addCategoryRequestBody);
	}
}

export default CategoriesController;
