import {Module} from "@nestjs/common";
import ProductsController from "./ProductsController.js";
import ProductsService from "./ProductsService.js";
import {TypeOrmModule} from "@nestjs/typeorm";
import ProductEntity from "./ProductEntity.js";
import ProductInCategoryEntity from "./ProductInCategoryEntity.js";
import {CategoryEntity} from "../categories/index.js";
// import AppConfigModule from "../../config/AppConfigModule.js";

@Module({
	imports: [TypeOrmModule.forFeature([CategoryEntity, ProductEntity, ProductInCategoryEntity])],
	controllers: [ProductsController],
	providers: [ProductsService],
})
class ProductsModule {
	constructor() {}
}

export default ProductsModule;
