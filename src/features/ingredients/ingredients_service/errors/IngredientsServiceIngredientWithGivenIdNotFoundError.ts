class IngredientsServiceIngredientWithGivenIdNotFoundError extends Error {
	public readonly ingredientId: string;
	constructor(ingredientId: string) {
		super(`Ingredient with id ${ingredientId} was not found.`);
		this.ingredientId = ingredientId;
	}
}

export default IngredientsServiceIngredientWithGivenIdNotFoundError;
