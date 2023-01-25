import type DataSource from "../../data_sources/types/DataSource.d.js";
import type ProductInDataSource from "./ProductInDataSource.d.js";
import type Product from "./Product.js";

type DetailedProductInDataSource = {
	readonly product: Product;
	readonly dataSource: DataSource;
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
	readonly description: string | null;
};

export default ProductInDataSource;
