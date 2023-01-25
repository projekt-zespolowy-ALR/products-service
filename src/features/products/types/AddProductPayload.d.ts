type AddProductPayload = {
	readonly name?: string | undefined | null;
	readonly slug: string;
	readonly mass?: number | undefined | null;
	readonly volume?: number | undefined | null;
	readonly categoriesIds?: readonly string[] | undefined | null;
	readonly brandId?: string | undefined | null;
	readonly ingredientsIds?: readonly string[] | undefined | null;
};

export default AddProductPayload;
