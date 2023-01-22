import {Module} from "@nestjs/common";
import ProductsController from "./products_controller/ProductsController.js";
import ProductsService from "./ProductsService.js";
import {TypeOrmModule} from "@nestjs/typeorm";
import ProductEntity from "./ProductEntity.js";
import {CategoryEntity} from "../categories/index.js";
// import AppConfigModule from "../../config/AppConfigModule.js";

@Module({
	imports: [TypeOrmModule.forFeature([CategoryEntity, ProductEntity])],
	controllers: [ProductsController],
	providers: [ProductsService],
})
class ProductsModule {
	constructor() {}
}

export default ProductsModule;
