import {type Category} from "../../categories/index.js";
import {type DataSource} from "../../data_sources/index.js";

type Product = {
	readonly id: string;

	readonly name: string | null;

	readonly slug: string;

	readonly mass: number | null;

	readonly volume: number | null;

	readonly categoriesIds: readonly string[];

	readonly inDataSourcesIds: readonly string[];
};

// CREATE TABLE products_in_data_sources (
// 	product_id UUID NOT NULL,
// 	data_source_id UUID NOT NULL,
// 	reference_url TEXT,
// 	image_url TEXT,
// 	price NUMERIC(10, 2),
// 	PRIMARY KEY (product_id, data_source_id),
// 	FOREIGN KEY (product_id) REFERENCES products (id),
// 	FOREIGN KEY (data_source_id) REFERENCES data_sources (id)
// );

type ProductInDataSource = {
	readonly productId: string;
	readonly dataSourceId: string;
	readonly referenceUrl: string | null;
	readonly imageUrl: string | null;
	readonly price: number | null;
};

type DetailedProduct = Omit<Product, "categoriesIds" | "inDataSourcesIds"> & {
	readonly categories: readonly Category[];
	readonly inDataSources: readonly (Omit<ProductInDataSource, "productId" | "dataSourceId"> & {
		dataSource: DataSource;
	})[];
};

type AddProductPayload = {
	readonly name?: string | null | undefined;
	readonly slug: string;
	readonly mass?: number | null | undefined;
	readonly volume?: number | null | undefined;
	readonly categoriesIdsOrSlugs?: readonly string[];
	readonly inDataSources?: readonly {
		readonly dataSourceIdOrSlug: string;
		readonly referenceUrl?: string | null | undefined;
		readonly imageUrl?: string | null | undefined;
		readonly price?: number | null | undefined;
	}[];
};

export {type Product, type DetailedProduct, type AddProductPayload};
