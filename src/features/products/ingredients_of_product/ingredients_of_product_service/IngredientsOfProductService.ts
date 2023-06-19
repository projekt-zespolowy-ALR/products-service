import {Injectable} from "@nestjs/common";

import type {IngredientOfProduct} from "../ingredients_of_product_controller/IngredientOfProduct.js";
import {InjectRepository} from "@nestjs/typeorm";
import ProductEntity from "../../products_service/ProductEntity.js";
import {EntityNotFoundError, type Repository} from "typeorm";
import {IngredientsOfProductServiceProductWithGivenIdNotFoundError} from "./IngredientsOfProductServiceProductWithGivenIdNotFoundError.js";
import deentityifyIngredientEntity from "../../../ingredients/ingredients_service/deentityifyIngredientEntity.js";
import {IngredientListEntity} from "./IngredientListEntity.js";
import {IngredientInIngredientListEntity} from "./IngredientInIngredientListEntity.js";

@Injectable()
export class IngredientsOfProductService {
	private readonly productRepository: Repository<ProductEntity>;
	private readonly ingredientListRepository: Repository<IngredientListEntity>;
	private readonly ingredientInIngredientListRepository: Repository<IngredientInIngredientListEntity>;

	public constructor(
		@InjectRepository(ProductEntity) productRepository: Repository<ProductEntity>,
		@InjectRepository(IngredientListEntity)
		ingredientListRepository: Repository<IngredientListEntity>,
		@InjectRepository(IngredientInIngredientListEntity)
		ingredientInListRepository: Repository<IngredientInIngredientListEntity>
	) {
		this.productRepository = productRepository;
		this.ingredientListRepository = ingredientListRepository;
		this.ingredientInIngredientListRepository = ingredientInListRepository;
	}

	public async getIngredientsOfProductById(
		productId: string
	): Promise<IngredientOfProduct[] | null> {
		try {
			const product = await this.productRepository.findOneOrFail({
				where: {
					id: productId,
				},
				relations: {
					ingredientList: {
						ingredientsInList: {
							ingredient: true,
						},
					},
				},
			});
			const {ingredientList} = product;
			if (ingredientList === null) {
				return null;
			}
			const {ingredientsInList} = ingredientList;
			return Array.from(ingredientsInList)
				.sort((ingredientInList1, ingredientInList2) => {
					return ingredientInList1.orderInList - ingredientInList2.orderInList;
				})
				.map((ingredientInList) => ingredientInList.ingredient)
				.map(deentityifyIngredientEntity);
		} catch (error) {
			if (error instanceof EntityNotFoundError) {
				throw new IngredientsOfProductServiceProductWithGivenIdNotFoundError(productId);
			}
			throw error;
		}
	}
	public async saveIngredientListOfProductByid(
		productId: string,
		ingredientIds: string[]
	): Promise<IngredientOfProduct[]> {
		const ingredientListEntity = await this.ingredientListRepository.save({
			productId,
		});

		await this.ingredientInIngredientListRepository.save(
			ingredientIds.map((ingredientId, index) => ({
				ingredientId,
				orderInList: index,
				ingredientListId: ingredientListEntity.id,
			}))
		);
		const ingredientInListEntities = await this.ingredientInIngredientListRepository.find({
			where: {
				ingredientListId: ingredientListEntity.id,
			},
			relations: {
				ingredient: true,
			},
		});

		return Array.from(ingredientInListEntities)
			.sort(
				(ingredientInList1, ingredientInList2) =>
					ingredientInList1.orderInList - ingredientInList2.orderInList
			)
			.map((ingredientInList) => ingredientInList.ingredient)
			.map(deentityifyIngredientEntity);
	}
}
