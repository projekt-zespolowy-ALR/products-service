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
import IngredientsService from "../ingredients_service/IngredientsService.js";
import IngredientsServiceIngredientWithGivenIdNotFoundError from "../ingredients_service/errors/IngredientsServiceIngredientWithGivenIdNotFoundError.js";
import IngredientsServiceIngredientWithGivenSlugNotFoundError from "../ingredients_service/errors/IngredientsServiceIngredientWithGivenSlugNotFoundError.js";
import type Ingredient from "../types/Ingredient.js";
import AddIngredientRequestBody from "./AddIngredientRequestBody.js";
import UpdateIngredientRequestBody from "./UpdateIngredientRequestBody.js";

@Controller("/")
class IngredientsController {
	private readonly ingredientsService: IngredientsService;
	constructor(ingredientsService: IngredientsService) {
		this.ingredientsService = ingredientsService;
	}

	@Get("/ingredients")
	public async getAllIngredients(
		@Query()
		pagingOptions: PagingOptions
	): Promise<Page<Ingredient>> {
		return await this.ingredientsService.getIngredients(pagingOptions);
	}

	@Get("/ingredients/:ingredientId")
	public async getIngredientById(
		@Param("ingredientId", ParseUUIDPipe)
		ingredientId: string
	): Promise<Ingredient> {
		try {
			return await this.ingredientsService.getIngredient(ingredientId);
		} catch (error) {
			if (error instanceof IngredientsServiceIngredientWithGivenIdNotFoundError) {
				throw new NotFoundException(`Ingredient with id ${ingredientId} not found.`, {
					cause: error,
				});
			}
			throw error;
		}
	}

	@Get("/ingredients-by-slug/:ingredientSlug")
	public async getIngredientBySlug(
		@Param("ingredientSlug")
		ingredientSlug: string
	): Promise<Ingredient> {
		try {
			return await this.ingredientsService.getIngredientBySlug(ingredientSlug);
		} catch (error) {
			if (error instanceof IngredientsServiceIngredientWithGivenSlugNotFoundError) {
				throw new NotFoundException(`Ingredient with slug ${ingredientSlug} not found.`, {
					cause: error,
				});
			}
			throw error;
		}
	}

	@Post("/ingredients")
	public async addIngredient(@Body() ingredient: AddIngredientRequestBody): Promise<Ingredient> {
		return await this.ingredientsService.addIngredient(ingredient);
	}

	@Delete("/ingredients/:ingredientId")
	@HttpCode(204)
	public async deleteIngredient(
		@Param("ingredientId", ParseUUIDPipe)
		ingredientId: string
	): Promise<void> {
		try {
			await this.ingredientsService.deleteIngredient(ingredientId);
		} catch (error) {
			if (error instanceof IngredientsServiceIngredientWithGivenIdNotFoundError) {
				throw new NotFoundException(`Ingredient with id ${ingredientId} not found.`, {
					cause: error,
				});
			}
			throw error;
		}
	}

	@Put("/ingredients/:ingredientId")
	public async updateIngredient(
		@Param("ingredientId", ParseUUIDPipe)
		ingredientId: string,
		@Body()
		ingredient: UpdateIngredientRequestBody
	): Promise<Ingredient> {
		try {
			return await this.ingredientsService.updateIngredient(ingredientId, ingredient);
		} catch (error) {
			if (error instanceof IngredientsServiceIngredientWithGivenIdNotFoundError) {
				throw new NotFoundException(`Ingredient with id ${ingredientId} not found.`, {
					cause: error,
				});
			}
			throw error;
		}
	}
}

export default IngredientsController;
