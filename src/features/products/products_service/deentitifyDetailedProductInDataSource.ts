import deentitifyDataSource from "../../data_sources/data_sources_service/deentitifyDataSource.js";
import type DetailedProductInDataSource from "../types/DetailedProductInDataSource.js";
import deentitifyProduct from "./deentitifyProduct.js";
import ProductInDataSourceEntity from "./ProductInDataSourceEntity.js";

function deentitifyDetailedProductInDataSource(
	producInDataSourceEntity: ProductInDataSourceEntity
): DetailedProductInDataSource {
	return {
		dataSource: deentitifyDataSource(producInDataSourceEntity.dataSource),
		product: deentitifyProduct(producInDataSourceEntity.product),
		referenceUrl: producInDataSourceEntity.referenceUrl,
		imageUrl: producInDataSourceEntity.imageUrl,
		price: producInDataSourceEntity.price,
		description: producInDataSourceEntity.description,
	};
}

export default deentitifyDetailedProductInDataSource;
