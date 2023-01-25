type Product = {
	readonly id: string;

	readonly name: string | null;

	readonly slug: string;

	readonly mass: number | null;

	readonly volume: number | null;

	readonly categoriesIds: readonly string[];

	readonly inDataSourcesIds: readonly string[];

	readonly brandId: string | null;

	readonly ingredientsIds: readonly string[] | null;
};

export default Product;
