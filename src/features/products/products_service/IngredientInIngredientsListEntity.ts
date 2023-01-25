import {Entity, JoinColumn, ManyToOne, PrimaryColumn, type Relation} from "typeorm";
import IngredientEntity from "../../ingredients/ingredients_service/IngredientEntity.js";
import IngredientsListEntity from "./IngredientsListEntity.js";

@Entity({name: "ingredients_in_ingredients_lists"})
class IngredientInIngredientsListEntity {
	@PrimaryColumn({name: "ingredient_id", type: "uuid"})
	public readonly ingredientId!: string;

	@PrimaryColumn({name: "ingredients_list_id", type: "uuid"})
	public readonly ingredientsListId!: string;

	@ManyToOne(() => IngredientEntity, (ingredient) => ingredient.inIngredientsLists)
	@JoinColumn({name: "ingredient_id"})
	public readonly ingredient!: Relation<IngredientEntity>;

	@ManyToOne(() => IngredientsListEntity, (ingredientsList) => ingredientsList.inIngredients)
	@JoinColumn({name: "ingredients_list_id"})
	public readonly ingredientsList!: Relation<IngredientsListEntity>;
}

export default IngredientInIngredientsListEntity;
