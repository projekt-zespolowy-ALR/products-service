import {type Category} from "../../categories/index.js";

interface Product {
	id: string;

	name: string | null;

	slug: string;

	mass: number | null;

	volume: number | null;
}

type DetailedProduct = Product & {
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
