type Ingredient = {
	readonly id: string;
	readonly name: string;
	readonly slug: string;
};

type AddIngredientRequestBody = {
	readonly name: string;
	readonly slug: string;
};

export {type Ingredient, type AddIngredientRequestBody};
