import {Body, Controller, Get, NotFoundException, Param, ParseUUIDPipe, Put} from "@nestjs/common";
import type Category from "../../../categories/categories_controller/Category.js";
import {CategoriesOfProductService} from "../categories_of_product_service/CategoriesOfProductService.js";
import {CategoriesOfProductServiceProductWithGivenIdNotFoundError} from "../categories_of_product_service/CategoriesOfProductServiceProductWithGivenIdNotFoundError.js";
import {UUIDArrayValidationPipe} from "../../../../utils/uuidArrayValidationPipe.js";

@Controller("/products/:productId/categories")
export class CategoriesOfProductController {
	private readonly categoriesOfProductService: CategoriesOfProductService;
	public constructor(categoriesOfProductService: CategoriesOfProductService) {
		this.categoriesOfProductService = categoriesOfProductService;
	}

	@Get("/")
	public async getCategoriesOfProduct(@Param("productId") productId: string): Promise<Category[]> {
		try {
			const categories = await this.categoriesOfProductService.getCategoriesOfProductById(
				productId
			);
			return categories;
		} catch (error) {
			if (error instanceof CategoriesOfProductServiceProductWithGivenIdNotFoundError) {
				throw new NotFoundException(`Product with ID ${productId} not found.`);
			}
			throw error;
		}
	}

	@Put("/")
	public async updateCategoriesOfProductById(
		@Param(
			"productId",
			new ParseUUIDPipe({
				version: "4",
			})
		)
		productId: string,
		@Body(new UUIDArrayValidationPipe())
		categoryIds: string[]
	): Promise<Category[]> {
		try {
			const categories = await this.categoriesOfProductService.saveCategoryListOfProductByid(
				productId,
				categoryIds
			);
			return categories;
		} catch (error) {
			if (error instanceof CategoriesOfProductServiceProductWithGivenIdNotFoundError) {
				throw new NotFoundException(`Product with id "${productId}" not found`);
			}
			throw error;
		}
	}
}
