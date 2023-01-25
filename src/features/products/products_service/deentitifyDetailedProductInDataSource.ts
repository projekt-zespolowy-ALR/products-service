import type DetailedProductInDataSource from "../types/DetailedProductInDataSource.js";
import ProductInDataSourceEntity from "./ProductInDataSourceEntity.js";

function deentitifyDetailedProductInDataSource(
	producInDataSourceEntity: ProductInDataSourceEntity
): DetailedProductInDataSource {
	return {
		dataSource: producInDataSourceEntity.dataSource,
		referenceUrl: producInDataSourceEntity.referenceUrl,
		imageUrl: producInDataSourceEntity.imageUrl,
		price: producInDataSourceEntity.price,
		description: producInDataSourceEntity.description,
	};
}

export default deentitifyDetailedProductInDataSource;
