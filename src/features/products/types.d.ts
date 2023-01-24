import {type Brand} from "../brands/index.js";
import {type Ingredient} from "../ingredients/index.js";

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

type ProductInDataSource = {
	readonly productId: string;
	readonly dataSourceId: string;
	readonly referenceUrl: string | null;
	readonly imageUrl: string | null;
	readonly price: number | null;
};

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
	readonly categories: readonly {
		id: string;
		slug: string;
		name: string;
	}[];

	/**
	 * Information about the product's availability in the data sources.
	 */
	readonly inDataSources: readonly {
		readonly dataSource: {
			readonly id: string;
			readonly name: string;
			readonly slug: string;
			readonly url: string;
		};
		/**
		 * The URL of the product's page in the data source.
		 * @example "https://www.hebe.pl/claresa-zel-do-laminacji-brwi-8-g-000000000000407817.html"
		 */
		readonly referenceUrl: string | null;
		/**
		 * The URL of the product's image in the data source.
		 * May not always work due to CORS.
		 */
		readonly imageUrl: string | null;
		/**
		 * The product's price in PLN in the data source if it's known, null otherwise.
		 * @example 9.99
		 * @example null
		 */
		readonly price: number | null;
	}[];

	/**
	 * The product's brand if it's known, null otherwise.
	 */
	readonly brand: Brand | null;

	readonly ingredients: Ingredient[] | null;
};

type AddProductRequestBody = {
	readonly name?: string | null | undefined;
	readonly slug: string;
	readonly mass?: number | null | undefined;
	readonly volume?: number | null | undefined;
	readonly categoriesIds?: readonly string[];
	readonly ingredientsIds?: readonly string[];
};

type AddProductInDataSourceRequestBody = {
	readonly productId: string;
	readonly dataSourceId: string;
	readonly referenceUrl?: string | null | undefined;
	readonly imageUrl?: string | null | undefined;
	readonly price?: number | null | undefined;
};

export {
	type Product,
	type DetailedProduct,
	type AddProductRequestBody,
	type ProductInDataSource,
	type AddProductInDataSourceRequestBody,
};
