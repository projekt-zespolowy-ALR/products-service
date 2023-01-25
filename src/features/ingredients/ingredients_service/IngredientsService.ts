import IngredientEntity from "./IngredientEntity.js";

import {Injectable} from "@nestjs/common";
import {EntityNotFoundError, Repository} from "typeorm";

import {InjectRepository} from "@nestjs/typeorm";

import IngredientsServiceIngredientWithGivenIdNotFoundError from "./errors/IngredientsServiceIngredientWithGivenIdNotFoundError.js";
import IngredientsServiceIngredientWithGivenSlugNotFoundError from "./errors/IngredientsServiceIngredientWithGivenSlugNotFoundError.js";
import type Page from "../../../paging/Page.js";
import type PagingOptions from "../../../paging/PagingOptions.js";
import paginatedFindAndCount from "../../../paging/paginatedFindAndCount.js";
import type AddIngredientPayload from "../types/AddIngredientPayload.d.js";
import type Ingredient from "../types/Ingredient.js";
import type UpdateIngredientPayload from "../types/UpdateIngredientPayload.d.js";
import deentitifyIngredient from "./deentitifyIngredient.js";

@Injectable()
class IngredientsService {
	private readonly ingredientsRepository: Repository<IngredientEntity>;
	constructor(
		@InjectRepository(IngredientEntity) ingredientsRepository: Repository<IngredientEntity>
	) {
		this.ingredientsRepository = ingredientsRepository;
	}

	public async getIngredients(pagingOptions: PagingOptions): Promise<Page<Ingredient>> {
		return (await paginatedFindAndCount(this.ingredientsRepository, pagingOptions)).map(
			deentitifyIngredient
		);
	}
	public async getIngredient(ingredientId: string): Promise<Ingredient> {
		try {
			return deentitifyIngredient(
				await this.ingredientsRepository.findOneByOrFail({id: ingredientId})
			);
		} catch (error) {
			if (error instanceof EntityNotFoundError) {
				throw new IngredientsServiceIngredientWithGivenIdNotFoundError(ingredientId);
			}
			throw error;
		}
	}
	public async getIngredientBySlug(ingredientSlug: string): Promise<Ingredient> {
		try {
			return deentitifyIngredient(
				await this.ingredientsRepository.findOneByOrFail({slug: ingredientSlug})
			);
		} catch (error) {
			if (error instanceof EntityNotFoundError) {
				throw new IngredientsServiceIngredientWithGivenSlugNotFoundError(ingredientSlug);
			}
			throw error;
		}
	}
	public async addIngredient(addIngredientPayload: AddIngredientPayload): Promise<Ingredient> {
		const ingredientEntity = this.ingredientsRepository.create(addIngredientPayload);
		const savedIngredientEntity = await this.ingredientsRepository.save(ingredientEntity);
		return deentitifyIngredient(savedIngredientEntity);
	}
	public async updateIngredient(
		ingredientId: string,
		updateIngredientPayload: UpdateIngredientPayload
	): Promise<Ingredient> {
		const updatedIngredientEntity = await this.ingredientsRepository.preload({
			id: ingredientId,
			...updateIngredientPayload,
		});
		if (!updatedIngredientEntity) {
			throw new IngredientsServiceIngredientWithGivenIdNotFoundError(ingredientId);
		}

		const savedIngredientEntity = await this.ingredientsRepository.save(updatedIngredientEntity);
		return deentitifyIngredient(savedIngredientEntity);
	}

	public async deleteIngredient(ingredientId: string): Promise<void> {
		try {
			const ingredientEntity = await this.ingredientsRepository.findOneByOrFail({id: ingredientId});
			await this.ingredientsRepository.remove(ingredientEntity);
		} catch (error) {
			if (error instanceof EntityNotFoundError) {
				throw new IngredientsServiceIngredientWithGivenIdNotFoundError(ingredientId);
			}
			throw error;
		}
	}
}

export default IngredientsService;
