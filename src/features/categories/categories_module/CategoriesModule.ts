import {Module} from "@nestjs/common";

import {TypeOrmModule} from "@nestjs/typeorm";
import CategoriesController from "../categories_controller/CategoriesController.js";
import CategoryEntity from "../categories_service/CategoryEntity.js";
import CategoriesService from "../categories_service/CategoriesService.js";
import ProductEntity from "../../products/products_service/ProductEntity.js";

@Module({
	imports: [TypeOrmModule.forFeature([CategoryEntity, ProductEntity])],
	controllers: [CategoriesController],
	providers: [CategoriesService],
})
class CategoriesModule {
	constructor() {}
}

export default CategoriesModule;
