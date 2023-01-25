class IngredientsServiceIngredientWithGivenSlugNotFoundError extends Error {
	public readonly ingredientSlug: string;
	constructor(ingredientSlug: string) {
		super(`Ingredient with slug ${ingredientSlug} was not found.`);
		this.ingredientSlug = ingredientSlug;
	}
}

export default IngredientsServiceIngredientWithGivenSlugNotFoundError;
