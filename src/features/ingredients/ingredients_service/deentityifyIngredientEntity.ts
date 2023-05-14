import {plainToClass} from "class-transformer";
import Ingredient from "../ingredients_controller/Ingredient.js";
import type IngredientEntity from "./IngredientEntity.js";

export default function deentityifyIngredientEntity(
	ingredientEntity: IngredientEntity
): Ingredient {
	return plainToClass(Ingredient, ingredientEntity);
}
