import {Injectable, NotFoundException} from "@nestjs/common";
import {Repository} from "typeorm";
import IngredientEntity from "./IngredientEntity.js";
import {InjectRepository} from "@nestjs/typeorm";
import type Page from "../../../paging/Page.js";
import type PagingOptions from "../../../paging/PagingOptions.js";
import paginatedFindAndCount from "../../../paging/paginatedFindAndCount.js";
import type Ingredient from "../ingredients_controller/Ingredient.js";
import deentityifyIngredientEntity from "./deentityifyIngredientEntity.js";
import type CreateIngredientPayload from "./CreateIngredientPayload.js";
import IngredientsServiceIngredientWithGivenIdNotFoundError from "./IngredientsServiceIngredientWithGivenIdNotFoundError.js";
@Injectable()
export default class IngredientsService {
	private readonly ingredientsRepository: Repository<IngredientEntity>;
	public constructor(
		@InjectRepository(IngredientEntity) ingredientsRepository: Repository<IngredientEntity>
	) {
		this.ingredientsRepository = ingredientsRepository;
	}
	public async getIngredients(pagingOptions: PagingOptions): Promise<Page<Ingredient>> {
		return (await paginatedFindAndCount(this.ingredientsRepository, pagingOptions)).map(
			deentityifyIngredientEntity
		);
	}
	public async getIngredientById(id: string): Promise<Ingredient> {
		try {
			return deentityifyIngredientEntity(await this.ingredientsRepository.findOneByOrFail({id}));
		} catch (error) {
			if (error instanceof NotFoundException) {
				throw new IngredientsServiceIngredientWithGivenIdNotFoundError(id);
			}
			throw error;
		}
	}
	public async createIngredient(
		createIngredientPayload: CreateIngredientPayload
	): Promise<Ingredient> {
		return deentityifyIngredientEntity(
			await this.ingredientsRepository.save(createIngredientPayload)
		);
	}
}
