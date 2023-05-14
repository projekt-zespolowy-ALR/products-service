export default class IngredientsServiceIngredientWithGivenIdNotFoundError extends Error {
	public readonly ingredientId: string;

	public constructor(ingredientId: string) {
		super(`Ingredient with id ${ingredientId} not found`);
		this.ingredientId = ingredientId;
	}
}
