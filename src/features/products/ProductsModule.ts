import {Module} from "@nestjs/common";
import ProductsController from "./products_controller/ProductsController.js";
import ProductsService from "./products_service/ProductsService.js";
import {TypeOrmModule} from "@nestjs/typeorm";
import ProductEntity from "./products_service/ProductEntity.js";
import {CategoryEntity} from "../categories/index.js";
import {ProductInDataSourceEntity} from "./products_service/index.js";
import {DataSourceEntity} from "../data_sources/index.js";
// import AppConfigModule from "../../config/AppConfigModule.js";

@Module({
	imports: [
		TypeOrmModule.forFeature([
			CategoryEntity,
			ProductEntity,
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
