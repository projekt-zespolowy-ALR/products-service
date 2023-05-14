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
import CategoriesService from "../categories_service/CategoriesService.js";
import PagingOptions from "../../../paging/PagingOptions.js";
import type Page from "../../../paging/Page.js";
import type Category from "./Category.js";
import CategoriesServiceCategoryWithGivenIdNotFoundError from "../categories_service/CategoriesServiceCategoryWithGivenIdNotFoundError.js";
import CreateCategoryRequestBody from "./CreateCategoryRequestBody.js";
import payloadifyCreateCategoryRequestBody from "./payloadifyCreateCategoryequestBody.js";

@Controller("/")
export default class CategoriesController {
	private readonly categoriesService: CategoriesService;
	public constructor(categoriesService: CategoriesService) {
		this.categoriesService = categoriesService;
	}
	@Get("/categories")
	public async getCategories(
		@Query(
			new ValidationPipe({
				transform: true, // Transform to instance of PagingOptions
				whitelist: true, // Do not put other query parameters into the object
			})
		)
		pagingOptions: PagingOptions
	): Promise<Page<Category>> {
		return await this.categoriesService.getCategories(pagingOptions);
	}

	@Get("/categories/:categoryId")
	public async getCategoryById(
		@Param(
			"categoryId",
			new ParseUUIDPipe({
				version: "4",
			})
		)
		categoryId: string
	): Promise<Category> {
		try {
			const targetCategory = await this.categoriesService.getCategoryById(categoryId);
			return targetCategory;
		} catch (error) {
			if (error instanceof CategoriesServiceCategoryWithGivenIdNotFoundError) {
				throw new NotFoundException(`Category with id "${categoryId}" not found`);
			}
			throw error;
		}
	}

	@Post("/categories")
	public async createCategory(
		@Body(
			new ValidationPipe({
				transform: true, // Transform to instance of CreateCatRequestBody
				whitelist: true, // Do not allow other properties than those defined in CreateCatRequestBody
				forbidNonWhitelisted: true, // Throw an error if other properties than those defined in CreateCatRequestBody are present
			})
		)
		createCategoryRequestBody: CreateCategoryRequestBody
	): Promise<Category> {
		return await this.categoriesService.createCategory(
			payloadifyCreateCategoryRequestBody(createCategoryRequestBody)
		);
	}
}
