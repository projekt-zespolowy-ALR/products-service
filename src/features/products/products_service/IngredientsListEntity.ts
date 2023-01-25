import {Entity, OneToMany, PrimaryGeneratedColumn, type Relation} from "typeorm";
import IngredientInIngredientsListEntity from "./IngredientInIngredientsListEntity.js";

@Entity({name: "ingredients_lists"})
class IngredientsListEntity {
	@PrimaryGeneratedColumn("uuid", {name: "id"})
	public readonly id!: string;

	@OneToMany(
		() => IngredientInIngredientsListEntity,
		(ingredientInIngredientsList) => ingredientInIngredientsList.ingredientsList,
		{cascade: true}
	)
	public readonly inIngredients!: readonly Relation<IngredientInIngredientsListEntity>[];
}

export default IngredientsListEntity;
