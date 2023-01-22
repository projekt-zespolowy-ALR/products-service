import {type Category} from "../../categories/index.js";

type Product = {
	readonly id: string;

	readonly name: string | null;

	readonly slug: string;

	readonly mass: number | null;

	readonly volume: number | null;

	readonly categoriesIds: readonly string[];
};

type DetailedProduct = Omit<Product, "categoriesIds"> & {
	categories: readonly Category[];
};

type AddProductPayload = {
	readonly name: string | null;
	readonly slug: string;
	readonly mass: number | null;
	readonly volume: number | null;
	readonly categoriesIdsOrSlugs: readonly string[];
};

export {type Product, type DetailedProduct, type AddProductPayload};
