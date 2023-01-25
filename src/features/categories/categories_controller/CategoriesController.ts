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
import CategoriesService from "../categories_service/CategoriesService.js";
import CategoriesServiceCategoryWithGivenIdNotFoundError from "../categories_service/errors/CategoriesServiceCategoryWithGivenIdNotFoundError.js";
import CategoriesServiceCategoryWithGivenSlugNotFoundError from "../categories_service/errors/CategoriesServiceCategoryWithGivenSlugNotFoundError.js";
import type Category from "../types/Category.d.js";
import AddCategoryRequestBody from "./AddCategoryRequestBody.js";
import UpdateCategoryRequestBody from "./UpdateCategoryRequestBody.js";

@Controller("/")
class CategoriesController {
	private readonly categoriesService: CategoriesService;
	constructor(categoriesService: CategoriesService) {
		this.categoriesService = categoriesService;
	}

	@Get("/categories")
	public async getAllCategories(
		@Query()
		pagingOptions: PagingOptions
	): Promise<Page<Category>> {
		return await this.categoriesService.getCategories(pagingOptions);
	}

	@Get("/categories/:categoryId")
	public async getCategoryById(
		@Param("categoryId", ParseUUIDPipe)
		categoryId: string
	): Promise<Category> {
		try {
			return await this.categoriesService.getCategoryById(categoryId);
		} catch (error) {
			if (error instanceof CategoriesServiceCategoryWithGivenIdNotFoundError) {
				throw new NotFoundException(`Category with id ${categoryId} not found.`, {
					cause: error,
				});
			}
			throw error;
		}
	}

	@Get("/category-by-slug")
	public async getCategoryBySlug(
		@Query("slug")
		categorieslug: string
	): Promise<Category> {
		try {
			return await this.categoriesService.getCategoryBySlug(categorieslug);
		} catch (error) {
			if (error instanceof CategoriesServiceCategoryWithGivenSlugNotFoundError) {
				throw new NotFoundException(`Category with slug ${categorieslug} not found.`, {
					cause: error,
				});
			}
			throw error;
		}
	}

	@Post("/categories")
	public async addCategory(@Body() category: AddCategoryRequestBody): Promise<Category> {
		return await this.categoriesService.addCategory(category);
	}

	@Delete("/categories/:categoryId")
	@HttpCode(204)
	public async deleteCategory(
		@Param("categoryId", ParseUUIDPipe)
		categoryId: string
	): Promise<void> {
		try {
			await this.categoriesService.deleteCategory(categoryId);
		} catch (error) {
			if (error instanceof CategoriesServiceCategoryWithGivenIdNotFoundError) {
				throw new NotFoundException(`Category with id ${categoryId} not found.`, {
					cause: error,
				});
			}
			throw error;
		}
	}

	@Put("/categories/:categoryId")
	public async updateCategory(
		@Param("categoryId", ParseUUIDPipe)
		categoryId: string,
		@Body()
		category: UpdateCategoryRequestBody
	): Promise<Category> {
		try {
			return await this.categoriesService.updateCategory(categoryId, category);
		} catch (error) {
			if (error instanceof CategoriesServiceCategoryWithGivenIdNotFoundError) {
				throw new NotFoundException(`Category with id ${categoryId} not found.`, {
					cause: error,
				});
			}
			throw error;
		}
	}
}

export default CategoriesController;
