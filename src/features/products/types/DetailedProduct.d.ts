import type Category from "../../categories/types/Category.d.js";

type DetailedProduct = {
	/**
	 * The product's id in UUID format.
	 * @example "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11"
	 */
	readonly id: string;

	/**
	 * The product's name if it's known, null otherwise.
	 * @example "CLARESA TRUE GLUE"
	 * @example null
	 */
	readonly name: string | null;

	/**
	 * The product's slug. Use it in the links but use the `id` for API requests.
	 * @example "claresa-true-glue"
	 */
	readonly slug: string;

	/**
	 * The product's mass in killograms if it's known, null otherwise.
	 * @example 0.4
	 * @example null
	 */
	readonly mass: number | null;

	/**
	 * The product's volume in liters if it's known, null otherwise.
	 * @example 0.4
	 * @example null
	 */
	readonly volume: number | null;

	/**
	 * The product's categories.
	 */
	readonly categories: readonly Category[];

	/**
	 * Information about the product's availability in the data sources.
	 */
	readonly inDataSources: readonly DetailedProductInDataSource[];

	/**
	 * The product's brand if it's known, null otherwise.
	 */
	readonly brand: Brand | null;

	readonly ingredients: Ingredient[] | null;
};

export default DetailedProduct;
