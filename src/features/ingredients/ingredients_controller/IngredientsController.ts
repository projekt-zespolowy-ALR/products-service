import {
	Body,
	Controller,
	Get,
	Delete,
	NotFoundException,
	Param,
	ParseUUIDPipe,
	Post,
	Query,
	ValidationPipe,
} from "@nestjs/common";
import IngredientsService from "../ingredients_service/IngredientsService.js";
import PagingOptions from "../../../paging/PagingOptions.js";
import type Page from "../../../paging/Page.js";
import type Ingredient from "./Ingredient.js";
import IngredientsServiceIngredientWithGivenIdNotFoundError from "../ingredients_service/IngredientsServiceIngredientWithGivenIdNotFoundError.js";
import CreateIngredientRequestBody from "./CreateIngredientRequestBody.js";
import payloadifyCreateIngredientRequestBody from "./payloadifyCreateIngredientRequestBody.js";

@Controller("/")
export default class IngredientsController {
	private readonly ingredientsService: IngredientsService;
	public constructor(ingredientsService: IngredientsService) {
		this.ingredientsService = ingredientsService;
	}
	@Get("/ingredients")
	public async getIngredients(
		@Query(
			new ValidationPipe({
				transform: true, // Transform to instance of PagingOptions
				whitelist: true, // Do not put other query parameters into the object
			})
		)
		pagingOptions: PagingOptions
	): Promise<Page<Ingredient>> {
		return await this.ingredientsService.getIngredients(pagingOptions);
	}

	@Get("/ingredients/:ingredientId")
	public async getIngredientById(
		@Param(
			"ingredientId",
			new ParseUUIDPipe({
				version: "4",
			})
		)
		ingredientId: string
	): Promise<Ingredient> {
		try {
			const targetIngredient = await this.ingredientsService.getIngredientById(ingredientId);
			return targetIngredient;
		} catch (error) {
			if (error instanceof IngredientsServiceIngredientWithGivenIdNotFoundError) {
				throw new NotFoundException(`Ingredient with id "${ingredientId}" not found`);
			}
			throw error;
		}
	}

	@Post("/ingredients")
	public async createIngredient(
		@Body(
			new ValidationPipe({
				transform: true, // Transform to instance of CreateCatRequestBody
				whitelist: true, // Do not allow other properties than those defined in CreateCatRequestBody
				forbidNonWhitelisted: true, // Throw an error if other properties than those defined in CreateCatRequestBody are present
			})
		)
		createIngredientRequestBody: CreateIngredientRequestBody
	): Promise<Ingredient> {
		return await this.ingredientsService.createIngredient(
			payloadifyCreateIngredientRequestBody(createIngredientRequestBody)
		);
	}

	@Delete("/ingredients/:ingredientId")
	public async deleteIngredientById(
		@Param(
			"ingredientId",
			new ParseUUIDPipe({
				version: "4",
			})
		)
		ingredientId: string
	): Promise<boolean> {
		try {
			const targetIngredient = await this.ingredientsService.deleteIngredientById(ingredientId);
			return targetIngredient;
		} catch (error) {
			if (error instanceof IngredientsServiceIngredientWithGivenIdNotFoundError) {
				throw new NotFoundException(`Ingredient with id "${ingredientId}" not found`);
			}
			throw error;
		}
	}
}
