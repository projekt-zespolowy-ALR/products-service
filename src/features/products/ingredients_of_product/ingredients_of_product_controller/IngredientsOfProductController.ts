import {Body, Controller, Get, NotFoundException, Param, ParseUUIDPipe, Put} from "@nestjs/common";

import {IngredientsOfProductService} from "../ingredients_of_product_service/IngredientsOfProductService.js";
import type {IngredientOfProduct} from "./IngredientOfProduct.js";
import {IngredientsOfProductServiceProductWithGivenIdNotFoundError} from "../ingredients_of_product_service/IngredientsOfProductServiceProductWithGivenIdNotFoundError.js";
import {UUIDArrayValidationPipe} from "../../../../utils/uuidArrayValidationPipe.js";

@Controller("/products/:productId/ingredients")
export class IngredientsOfProductController {
	@Get("/")
	public async getIngredientsOfProductById(
		@Param(
			"productId",
			new ParseUUIDPipe({
				version: "4",
			})
		)
		productId: string
	): Promise<IngredientOfProduct[]> {
		try {
			const ingredients = await this.ingredientsOfProductService.getIngredientsOfProductById(
				productId
			);
			if (ingredients === null) {
				throw new NotFoundException(
					`The ingredients of the product with id "${productId}" is not available.`
				);
			}
			return ingredients;
		} catch (error) {
			if (error instanceof IngredientsOfProductServiceProductWithGivenIdNotFoundError) {
				throw new NotFoundException(`Product with id "${productId}" not found`);
			}
			throw error;
		}
	}
	@Put("/")
	public async updateIngredientsOfProductById(
		@Param(
			"productId",
			new ParseUUIDPipe({
				version: "4",
			})
		)
		productId: string,
		@Body(new UUIDArrayValidationPipe())
		ingredientIds: string[]
	): Promise<IngredientOfProduct[]> {
		try {
			const ingredients = await this.ingredientsOfProductService.saveIngredientListOfProductByid(
				productId,
				ingredientIds
			);
			return ingredients;
		} catch (error) {
			if (error instanceof IngredientsOfProductServiceProductWithGivenIdNotFoundError) {
				throw new NotFoundException(`Product with id "${productId}" not found`);
			}
			throw error;
		}
	}
	private readonly ingredientsOfProductService: IngredientsOfProductService;
	public constructor(ingredientsOfProductService: IngredientsOfProductService) {
		this.ingredientsOfProductService = ingredientsOfProductService;
	}
}
