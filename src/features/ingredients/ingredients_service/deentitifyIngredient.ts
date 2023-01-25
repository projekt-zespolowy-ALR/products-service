import type Ingredient from "../types/Ingredient.js";
import type IngredientEntity from "./IngredientEntity.js";

function deentitifyIngredient(ingredientEntity: IngredientEntity): Ingredient {
	return {
		id: ingredientEntity.id,
		name: ingredientEntity.name,
		slug: ingredientEntity.slug,
	};
}

export default deentitifyIngredient;
