import type ProductInDataSource from "../types/ProductInDataSource.js";
import ProductInDataSourceEntity from "./ProductInDataSourceEntity.js";

function deentitifyProductInDataSource(
	producInDataSourceEntity: ProductInDataSourceEntity
): ProductInDataSource {
	return {
		productId: producInDataSourceEntity.productId,
		dataSourceId: producInDataSourceEntity.dataSourceId,
		referenceUrl: producInDataSourceEntity.referenceUrl,
		imageUrl: producInDataSourceEntity.imageUrl,
		price: producInDataSourceEntity.price,
		description: producInDataSourceEntity.description,
	};
}

export default deentitifyProductInDataSource;
