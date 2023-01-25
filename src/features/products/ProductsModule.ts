import {Module} from "@nestjs/common";

import {TypeOrmModule} from "@nestjs/typeorm";
import CategoryEntity from "../categories/categories_service/CategoryEntity.js";
import DataSourceEntity from "../data_sources/data_sources_service/DataSourceEntity.js";
import ProductsController from "./products_controller/ProductsController.js";
import ProductEntity from "./products_service/ProductEntity.js";
import ProductInDataSourceEntity from "./products_service/ProductInDataSourceEntity.js";
import ProductsService from "./products_service/ProductsService.js";

@Module({
	imports: [
		TypeOrmModule.forFeature([
			ProductEntity,
			CategoryEntity,
			ProductInDataSourceEntity,
			DataSourceEntity,
		]),
	],
	controllers: [ProductsController],
	providers: [ProductsService],
})
class ProductsModule {
	constructor() {}
}

export default ProductsModule;
